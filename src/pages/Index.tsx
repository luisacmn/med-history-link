import { useState } from "react";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import PricingSection from "@/components/pricing/PricingSection";
import TopNavigation from "@/components/navigation/TopNavigation";
import ProfessionalDashboard from "@/components/dashboard/ProfessionalDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";

const Index = () => {
  // Demo state to simulate user authentication and type
  const [userType, setUserType] = useState<"guest" | "professional" | "patient">("guest");

  if (userType === "professional") {
    return (
      <>
        <TopNavigation userType={userType} onUserTypeChange={setUserType} />
        <ProfessionalDashboard />
      </>
    );
  }

  if (userType === "patient") {
    return (
      <>
        <TopNavigation userType={userType} onUserTypeChange={setUserType} />
        <PatientDashboard />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNavigation userType={userType} onUserTypeChange={setUserType} />
      <Hero />
      <SocialProof />
      <PricingSection />
    </div>
  );
};

export default Index;