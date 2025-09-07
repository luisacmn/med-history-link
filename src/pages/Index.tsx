import { useState } from "react";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import PricingSection from "@/components/pricing/PricingSection";
import AuthModal from "@/components/auth/AuthModal";
import ProfessionalDashboard from "@/components/dashboard/ProfessionalDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { Button } from "@/components/ui/button";
const Index = () => {
  // Demo state to simulate user authentication and type
  const [userType, setUserType] = useState<"guest" | "professional" | "patient">("guest");
  if (userType === "professional") {
    return <ProfessionalDashboard />;
  }
  if (userType === "patient") {
    return <PatientDashboard />;
  }
  return <div className="min-h-screen">
      <Hero />
      <SocialProof />
      <PricingSection />
      
      {/* Demo Navigation - Remove in production */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-card rounded-lg soft-shadow">
        <p className="text-xs text-muted-foreground mb-2">Demo Navigation:</p>
        <Button variant="medical" size="sm" onClick={() => setUserType("professional")}>Professional Dashboard</Button>
        <Button variant="accent" size="sm" onClick={() => setUserType("patient")}>Patient Dashboard</Button>
        <AuthModal>
          <Button variant="outline" size="sm">Register / Login</Button>
        </AuthModal>
      </div>
    </div>;
};
export default Index;