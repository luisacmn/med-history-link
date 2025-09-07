import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  MoreVertical,
  Stethoscope,
  Activity,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AddPatientModal from "@/components/modals/AddPatientModal";

const ProfessionalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  const fetchPatients = async () => {
    if (!user) return;
    
    try {
      // Get user's profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
        
        // Get patients for this professional
        const { data: patientsData } = await supabase
          .from('patients')
          .select('*')
          .eq('professional_id', profile.id)
          .order('created_at', { ascending: false });

        setPatients(patientsData || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const handlePatientAdded = () => {
    fetchPatients();
  };

  const stats = [
    {
      title: "Total Patients",
      value: patients.length.toString(),
      description: `${patients.length}/5 on free plan`,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Appointments Today",
      value: "0",
      description: "None scheduled",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Documents",
      value: "0",
      description: "Waiting for patients",
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Adoption Rate",
      value: "100%",
      description: "New active users",
      icon: Activity,
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
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{userProfile?.full_name || 'Professional'}</h1>
                <p className="text-sm text-muted-foreground">Professional Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <AddPatientModal onPatientAdded={handlePatientAdded}>
                <Button variant="medical">
                  <Plus className="w-4 h-4" />
                  Add Patient
                </Button>
              </AddPatientModal>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="soft-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Patients Section */}
        <Card className="soft-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Patients
                </CardTitle>
                <CardDescription>
                  Manage your patients' history and data
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {patients
                .filter(patient => 
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((patient) => {
                  const avatar = patient.name.charAt(0).toUpperCase();
                  const formattedDate = new Date(patient.created_at).toLocaleDateString('pt-BR');
                  
                  return (
                    <Card key={patient.id} className="border border-border hover:border-primary/50 smooth-transition cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{avatar}</span>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-foreground">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  Registered on: {formattedDate}
                                </span>
                                {patient.phone && (
                                  <span className="text-xs text-muted-foreground">
                                    {patient.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge variant="default">
                              {patient.patient_id ? "Active" : "Pending"}
                            </Badge>
                            
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            
            {patients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No patients registered</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first patient to manage medical records
                </p>
                <AddPatientModal onPatientAdded={handlePatientAdded}>
                  <Button variant="medical">
                    <Plus className="w-4 h-4" />
                    Add First Patient
                  </Button>
                </AddPatientModal>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;