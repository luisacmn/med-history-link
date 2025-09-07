import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Syringe, 
  Pill, 
  History, 
  Upload, 
  Plus,
  User,
  Calendar,
  Download,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AddExamModal from "@/components/modals/AddExamModal";
import AddMedicationModal from "@/components/modals/AddMedicationModal";
import AddVaccineModal from "@/components/modals/AddVaccineModal";
import AddHistoryModal from "@/components/modals/AddHistoryModal";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Get user's profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        
        // Fetch all medical data in parallel
        const [examsRes, vaccinesRes, medicationsRes, historyRes] = await Promise.all([
          supabase.from('exams').select('*').eq('patient_profile_id', profile.id).order('exam_date', { ascending: false }),
          supabase.from('vaccines').select('*').eq('patient_profile_id', profile.id).order('vaccine_date', { ascending: false }),
          supabase.from('medications').select('*').eq('patient_profile_id', profile.id).order('start_date', { ascending: false }),
          supabase.from('medical_history').select('*').eq('patient_profile_id', profile.id).order('history_date', { ascending: false })
        ]);

        setExams(examsRes.data || []);
        setVaccines(vaccinesRes.data || []);
        setMedications(medicationsRes.data || []);
        setHistory(historyRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDataAdded = () => {
    fetchData();
  };

  const stats = [
    {
      title: "Exams",
      value: exams.length,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Vaccines",
      value: vaccines.length,
      icon: Syringe,
      color: "text-accent"
    },
    {
      title: "Medications",
      value: medications.filter(m => m.still_in_use).length,
      icon: Pill,
      color: "text-primary"
    },
    {
      title: "History",
      value: history.length,
      icon: History,
      color: "text-accent"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b soft-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{userProfile?.full_name || 'Patient'}</h1>
                <p className="text-sm text-muted-foreground">Patient Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="soft-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="soft-shadow">
          <CardHeader>
            <CardTitle>My Medical History</CardTitle>
            <CardDescription>
              Organize your exams, vaccines and medications in one place
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="exams">Exams</TabsTrigger>
                <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Exams</h3>
                  <AddExamModal onExamAdded={handleDataAdded}>
                    <Button variant="medical">
                      <Upload className="w-4 h-4" />
                      Add Exam
                    </Button>
                  </AddExamModal>
                </div>
                
                <div className="space-y-3">
                  {exams.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No exams registered yet</p>
                    </div>
                  ) : (
                    exams.map((exam) => {
                      const formattedDate = new Date(exam.exam_date).toLocaleDateString('pt-BR');
                      return (
                        <Card key={exam.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary" />
                                <div>
                                  <h4 className="font-medium text-foreground">{exam.name}</h4>
                                  <p className="text-sm text-muted-foreground">{formattedDate} • {exam.exam_type}</p>
                                  {exam.notes && (
                                    <p className="text-xs text-muted-foreground mt-1">{exam.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{exam.exam_type}</Badge>
                                {exam.file_url && (
                                  <Button variant="ghost" size="sm" onClick={() => window.open(exam.file_url, '_blank')}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
              
              {/* Vaccines Tab */}
              <TabsContent value="vaccines" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Vaccination Card</h3>
                  <AddVaccineModal onVaccineAdded={handleDataAdded}>
                    <Button variant="accent">
                      <Plus className="w-4 h-4" />
                      Add Vaccine
                    </Button>
                  </AddVaccineModal>
                </div>
                
                <div className="space-y-3">
                  {vaccines.map((vaccine) => (
                    <Card key={vaccine.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Syringe className="w-8 h-8 text-accent" />
                            <div>
                              <h4 className="font-medium text-foreground">{vaccine.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {vaccine.date} • Batch: {vaccine.batch}
                              </p>
                              <p className="text-xs text-muted-foreground">{vaccine.location}</p>
                            </div>
                          </div>
                          <Badge variant="default">Applied</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Current Medications</h3>
                  <AddMedicationModal onMedicationAdded={handleDataAdded}>
                    <Button variant="medical">
                      <Plus className="w-4 h-4" />
                      Add Medication
                    </Button>
                  </AddMedicationModal>
                </div>
                
                <div className="space-y-3">
                  {medications.map((medication) => (
                    <Card key={medication.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Pill className="w-8 h-8 text-primary" />
                            <div>
                              <h4 className="font-medium text-foreground">{medication.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {medication.dosage} • {medication.frequency}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Started on: {medication.startDate}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={medication.status === "Active" ? "default" : "secondary"}
                          >
                            {medication.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Clinical History</h3>
                  <AddHistoryModal onHistoryAdded={handleDataAdded}>
                    <Button variant="accent">
                      <Plus className="w-4 h-4" />
                      Add Entry
                    </Button>
                  </AddHistoryModal>
                </div>
                
                <div className="space-y-3">
                  {history.map((entry) => (
                    <Card key={entry.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <History className="w-8 h-8 text-accent mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">{entry.type}</h4>
                              <Badge variant="outline">{entry.date}</Badge>
                            </div>
                            <p className="text-sm text-foreground mb-1">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{entry.professional}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;