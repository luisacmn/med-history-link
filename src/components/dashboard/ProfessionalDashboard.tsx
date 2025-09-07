import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, FileText, Calendar, MoreVertical, Stethoscope, Activity } from "lucide-react";
import AddPatientModal from "@/components/modals/AddPatientModal";
const ProfessionalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const patients = [{
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    lastVisit: "15/12/2024",
    status: "Active",
    avatar: "M",
    documentsCount: 8,
    nextAppointment: "22/12/2024"
  }, {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    lastVisit: "12/12/2024",
    status: "Active",
    avatar: "J",
    documentsCount: 5,
    nextAppointment: "20/12/2024"
  }, {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    lastVisit: "10/12/2024",
    status: "Pending",
    avatar: "A",
    documentsCount: 3,
    nextAppointment: null
  }, {
    id: 4,
    name: "Carlos Oliveira",
    email: "carlos@email.com",
    lastVisit: "08/12/2024",
    status: "Active",
    avatar: "C",
    documentsCount: 12,
    nextAppointment: "18/12/2024"
  }];
  const stats = [{
    title: "Total Patients",
    value: "4",
    description: "2 new this month",
    icon: Users,
    color: "text-primary"
  }, {
    title: "Today's Appointments",
    value: "3",
    description: "2 pending",
    icon: Calendar,
    color: "text-accent"
  }, {
    title: "Documents",
    value: "28",
    description: "5 new this week",
    icon: FileText,
    color: "text-primary"
  }, {
    title: "Adherence Rate",
    value: "85%",
    description: "↑ 12% vs last month",
    icon: Activity,
    color: "text-accent"
  }];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b soft-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dr. Francisco Costa</h1>
                <p className="text-sm text-muted-foreground">Cardiologist - License 12345</p>
              </div>
            </div>
            
            <Button variant="medical" onClick={() => setAddPatientModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => <Card key={index} className="soft-shadow">
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
            </Card>)}
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
                  <Input placeholder="Search patient..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {patients.map(patient => <Card key={patient.id} className="border border-border hover:border-primary/50 smooth-transition cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{patient.avatar}</span>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-foreground">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              Last visit: {patient.lastVisit}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {patient.documentsCount} documents
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                          {patient.status}
                        </Badge>
                        
                        {patient.nextAppointment && <div className="text-right">
                            <p className="text-xs text-muted-foreground">Next appointment</p>
                            <p className="text-sm font-medium text-foreground">{patient.nextAppointment}</p>
                          </div>}
                        
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
            
            {patients.length === 0 && <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No patients registered</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first patient or sending an invitation
                </p>
                <Button variant="medical" onClick={() => setAddPatientModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Add First Patient
                </Button>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={addPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
      />
    </div>;
};
export default ProfessionalDashboard;