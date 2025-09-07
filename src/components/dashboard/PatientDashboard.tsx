import { useState } from "react";
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
  FileDown
} from "lucide-react";
import UploadDocumentModal from "@/components/modals/UploadDocumentModal";
import { exportMedicalHistoryToPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"exams" | "vaccines" | "medications" | "history">("exams");
  const { toast } = useToast();

  const exams = [
    {
      id: 1,
      name: "Complete Blood Count",
      date: "15/12/2024",
      type: "Laboratory",
      file: "cbc-12-2024.pdf"
    },
    {
      id: 2,
      name: "Chest X-Ray",
      date: "10/12/2024",
      type: "Imaging",
      file: "chest-xray.pdf"
    },
    {
      id: 3,
      name: "Electrocardiogram",
      date: "05/12/2024",
      type: "Cardiology",
      file: "ecg-december.pdf"
    }
  ];

  const vaccines = [
    {
      id: 1,
      name: "COVID-19 (4th dose)",
      date: "01/11/2024",
      batch: "CV2024001",
      location: "Central Health Unit"
    },
    {
      id: 2,
      name: "Influenza 2024",
      date: "15/03/2024",
      batch: "FLU24003",
      location: "Private Clinic"
    }
  ];

  const medications = [
    {
      id: 1,
      name: "Losartan 50mg",
      dosage: "1 tablet",
      frequency: "Once daily",
      startDate: "01/10/2024",
      status: "Active"
    },
    {
      id: 2,
      name: "Omeprazole 20mg",
      dosage: "1 capsule",
      frequency: "Once daily (fasting)",
      startDate: "15/11/2024",
      status: "Active"
    }
  ];

  const history = [
    {
      id: 1,
      date: "15/12/2024",
      type: "Consultation",
      description: "Routine cardiology consultation. Blood pressure under control.",
      professional: "Dr. João Médico"
    },
    {
      id: 2,
      date: "10/12/2024",
      type: "Exam",
      description: "Chest X-ray performed. Normal results.",
      professional: "RadiMed Clinic"
    }
  ];

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
      value: medications.filter(m => m.status === "Active").length,
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

  const openUploadModal = (type: "exams" | "vaccines" | "medications" | "history") => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your medical history."
      });

      await exportMedicalHistoryToPDF(
        { exams, vaccines, medications, history },
        { 
          patientName: "Maria Silva",
          professionalName: "Dr. João Médico"
        }
      );

      toast({
        title: "PDF exported successfully",
        description: "Your medical history has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

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
                <h1 className="text-xl font-bold text-foreground">Maria Silva</h1>
                <p className="text-sm text-muted-foreground">Patient - Dr. João Médico</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-accent">
                Next appointment: 22/12
              </Badge>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4" />
                Schedule
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
                  <Button variant="medical" onClick={() => openUploadModal("exams")}>
                    <Upload className="w-4 h-4" />
                    Add Exam
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <Card key={exam.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div>
                              <h4 className="font-medium text-foreground">{exam.name}</h4>
                              <p className="text-sm text-muted-foreground">{exam.date} • {exam.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{exam.type}</Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Vaccines Tab */}
              <TabsContent value="vaccines" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Vaccination Card</h3>
                  <Button variant="accent" onClick={() => openUploadModal("vaccines")}>
                    <Plus className="w-4 h-4" />
                    Add Vaccine
                  </Button>
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
                  <Button variant="medical" onClick={() => openUploadModal("medications")}>
                    <Plus className="w-4 h-4" />
                    Add Medication
                  </Button>
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
                  <Button variant="accent" onClick={() => openUploadModal("history")}>
                    <Plus className="w-4 h-4" />
                    Add Entry
                  </Button>
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

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        documentType={uploadType}
      />
    </div>
  );
};

export default PatientDashboard;