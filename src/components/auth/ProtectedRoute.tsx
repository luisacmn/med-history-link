import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AuthModal from './AuthModal';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: string[];
}

const ProtectedRoute = ({ children, allowedUserTypes }: ProtectedRouteProps) => {
  const { user, loading, getUserProfile } = useAuth();
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
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">Authentication Required</h2>
            <p className="text-muted-foreground text-center">
              Please sign in to access this page.
            </p>
            <AuthModal>
              <Button variant="medical">Sign In</Button>
            </AuthModal>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (allowedUserTypes && userProfile && !allowedUserTypes.includes(userProfile.user_type)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold text-center text-destructive">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;