import { Button } from "@/components/ui/button";
import { Stethoscope, Shield, Users, FileText } from "lucide-react";
import medicalIcon from "@/assets/medical-icon.png";
const Hero = () => {
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <img src={medicalIcon} alt="Prontuário Digital" className="w-16 h-16 mx-auto lg:mx-0 mb-4" />
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Prontuário Digital
                <span className="block text-primary">Record</span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">Keep all your patients’ history in one place. They enter their data, and you access it easily and professionally.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" variant="medical" className="text-lg px-8 py-6">Start for Free
            </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">See a Demo
            </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <FileText className="w-8 h-8 text-primary mx-auto lg:mx-0 mb-2" />
                <h3 className="font-semibold text-foreground">Complete History
              </h3>
                <p className="text-sm text-muted-foreground">Exams, vaccines, and medications</p>
              </div>
              
              <div className="text-center lg:text-left">
                <Users className="w-8 h-8 text-accent mx-auto lg:mx-0 mb-2" />
                <h3 className="font-semibold text-foreground">Shared Access
              </h3>
                <p className="text-sm text-muted-foreground">Patient inputs, you review</p>
              </div>
              
              <div className="text-center lg:text-left">
                <Shield className="w-8 h-8 text-primary mx-auto lg:mx-0 mb-2" />
                <h3 className="font-semibold text-foreground">Safe and Professional
              </h3>
                <p className="text-sm text-muted-foreground">Data protected and organized</p>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="flex-1 relative">
            <div className="relative bg-card rounded-2xl p-8 soft-shadow max-w-md mx-auto">
              <div className="text-center mb-6">
                <Stethoscope className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground">Professional Dashboard</h3>
                <p className="text-muted-foreground">Quick Access to Patient Data</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Maria Silva</p>
                    <p className="text-xs text-muted-foreground">Last Appointment: 15/12</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">J</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">João Santos</p>
                    <p className="text-xs text-muted-foreground">Last Appointment: 12/12</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ana Costa</p>
                    <p className="text-xs text-muted-foreground">Last Appointment: 10/12</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-6" variant="accent">+ Add Patient</Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;