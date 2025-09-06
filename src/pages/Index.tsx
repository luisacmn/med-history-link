import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import PricingSection from "@/components/pricing/PricingSection";
import AuthModal from "@/components/auth/AuthModal";
import ProfessionalDashboard from "@/components/dashboard/ProfessionalDashboard";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import SocialProof from "@/components/SocialProof";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Menu } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [demoType, setDemoType] = useState<"professional" | "patient">("professional");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show dashboards for authenticated users
  if (user && userProfile && !demoMode) {
    if (userProfile.user_type === "professional") {
      return <ProfessionalDashboard />;
    }
    if (userProfile.user_type === "patient") {
      return <PatientDashboard />;
    }
  }

  // Show demo dashboards
  if (demoMode) {
    if (demoType === "professional") {
      return <ProfessionalDashboard />;
    }
    if (demoType === "patient") {
      return <PatientDashboard />;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <header className="bg-card border-b soft-shadow sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">Prontuário Digital</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Olá, {userProfile?.full_name || user.email}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDemoMode(!demoMode)}
                  >
                    {demoMode ? "Voltar" : "Demo"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <AuthModal>
                  <Button variant="medical">
                    Entrar / Cadastrar
                  </Button>
                </AuthModal>
              )}
            </div>
          </div>
        </div>
      </header>

      <Hero />
      <SocialProof />
      <PricingSection />
      
      {/* Demo Navigation */}
      {!user && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 p-4 bg-card rounded-lg soft-shadow">
          <p className="text-xs text-muted-foreground mb-2">Demonstração:</p>
          <Button 
            variant="medical" 
            size="sm"
            onClick={() => { setDemoMode(true); setDemoType("professional"); }}
          >
            Dashboard Profissional
          </Button>
          <Button 
            variant="accent" 
            size="sm"
            onClick={() => { setDemoMode(true); setDemoType("patient"); }}
          >
            Dashboard Paciente
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
