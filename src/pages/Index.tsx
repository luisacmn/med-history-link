import { useEffect, useState } from "react";
import Hero from "@/components/landing/Hero";
import PricingSection from "@/components/pricing/PricingSection";
import AuthModal from "@/components/auth/AuthModal";
import ProfessionalDashboard from "@/components/dashboard/ProfessionalDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
const Index = () => {
  const { user, loading, getUserProfile, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user && !userProfile) {
      setProfileLoading(true);
      getUserProfile().then((profile) => {
        setUserProfile(profile);
        setProfileLoading(false);
      });
    }
  }, [user, userProfile, getUserProfile]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user && userProfile) {
    if (userProfile.user_type === "professional") {
      return (
        <ProtectedRoute allowedUserTypes={["professional"]}>
          <ProfessionalDashboard />
        </ProtectedRoute>
      );
    }
    if (userProfile.user_type === "patient") {
      return (
        <ProtectedRoute allowedUserTypes={["patient"]}>
          <PatientDashboard />
        </ProtectedRoute>
      );
    }
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen">
      <Hero />
      <PricingSection />
      
      {/* Authentication Actions */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-card rounded-lg soft-shadow">
        {user ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground mb-2">
              Welcome, {userProfile?.full_name || user.email}!
            </p>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground mb-2">Get Started:</p>
            <AuthModal>
              <Button variant="medical" size="sm">Sign In / Register</Button>
            </AuthModal>
          </div>
        )}
      </div>
    </div>
  );
};
export default Index;