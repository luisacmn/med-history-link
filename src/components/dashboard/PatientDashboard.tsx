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
  Download
} from "lucide-react";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("exams");

  const exams = [
    {
      id: 1,
      name: "Hemograma Completo",
      date: "15/12/2024",
      type: "Laboratório",
      file: "hemograma-12-2024.pdf"
    },
    {
      id: 2,
      name: "Raio-X Tórax",
      date: "10/12/2024",
      type: "Imagem",
      file: "raio-x-torax.pdf"
    },
    {
      id: 3,
      name: "Eletrocardiograma",
      date: "05/12/2024",
      type: "Cardiológico",
      file: "ecg-dezembro.pdf"
    }
  ];

  const vaccines = [
    {
      id: 1,
      name: "COVID-19 (4ª dose)",
      date: "01/11/2024",
      batch: "CV2024001",
      location: "UBS Centro"
    },
    {
      id: 2,
      name: "Influenza 2024",
      date: "15/03/2024",
      batch: "FLU24003",
      location: "Clínica Particular"
    }
  ];

  const medications = [
    {
      id: 1,
      name: "Losartana 50mg",
      dosage: "1 comprimido",
      frequency: "1x ao dia",
      startDate: "01/10/2024",
      status: "Ativo"
    },
    {
      id: 2,
      name: "Omeprazol 20mg",
      dosage: "1 cápsula",
      frequency: "1x ao dia (jejum)",
      startDate: "15/11/2024",
      status: "Ativo"
    }
  ];

  const history = [
    {
      id: 1,
      date: "15/12/2024",
      type: "Consulta",
      description: "Consulta cardiológica de rotina. Pressão arterial controlada.",
      professional: "Dr. João Médico"
    },
    {
      id: 2,
      date: "10/12/2024",
      type: "Exame",
      description: "Realização de Raio-X do tórax. Resultado normal.",
      professional: "Clínica RadiMed"
    }
  ];

  const stats = [
    {
      title: "Exames",
      value: exams.length,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Vacinas",
      value: vaccines.length,
      icon: Syringe,
      color: "text-accent"
    },
    {
      title: "Medicações",
      value: medications.filter(m => m.status === "Ativo").length,
      icon: Pill,
      color: "text-primary"
    },
    {
      title: "Histórico",
      value: history.length,
      icon: History,
      color: "text-accent"
    }
  ];

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
                <p className="text-sm text-muted-foreground">Paciente - Dr. João Médico</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-accent">
                Próxima consulta: 22/12
              </Badge>
              <Button variant="outline">
                <Calendar className="w-4 h-4" />
                Agendar
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
            <CardTitle>Meu Histórico Médico</CardTitle>
            <CardDescription>
              Organize seus exames, vacinas e medicações em um só lugar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="exams">Exames</TabsTrigger>
                <TabsTrigger value="vaccines">Vacinas</TabsTrigger>
                <TabsTrigger value="medications">Medicações</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Exames</h3>
                  <Button variant="medical">
                    <Upload className="w-4 h-4" />
                    Adicionar Exame
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
                  <h3 className="text-lg font-semibold">Cartão de Vacinação</h3>
                  <Button variant="accent">
                    <Plus className="w-4 h-4" />
                    Adicionar Vacina
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
                                {vaccine.date} • Lote: {vaccine.batch}
                              </p>
                              <p className="text-xs text-muted-foreground">{vaccine.location}</p>
                            </div>
                          </div>
                          <Badge variant="default">Aplicada</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Medications Tab */}
              <TabsContent value="medications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Medicações Atuais</h3>
                  <Button variant="medical">
                    <Plus className="w-4 h-4" />
                    Adicionar Medicação
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
                                Iniciado em: {medication.startDate}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={medication.status === "Ativo" ? "default" : "secondary"}
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
                  <h3 className="text-lg font-semibold">Histórico Clínico</h3>
                  <Button variant="accent">
                    <Plus className="w-4 h-4" />
                    Adicionar Entrada
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
    </div>
  );
};

export default PatientDashboard;