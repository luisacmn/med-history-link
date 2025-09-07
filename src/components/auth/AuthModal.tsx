import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Stethoscope, User, UserPlus, Mail, Lock } from "lucide-react";

interface AuthModalProps {
  children: React.ReactNode;
}

const AuthModal = ({ children }: AuthModalProps) => {
  const [userType, setUserType] = useState<"professional" | "patient">("professional");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Access Your Account</CardTitle>
            <CardDescription>
              Sign in or create your account to start using Digital Medical Records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-login"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button className="w-full" variant="medical">
                  Sign In
                </Button>
                
                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                {/* User Type Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    type="button"
                    variant={userType === "professional" ? "medical" : "outline"}
                    onClick={() => setUserType("professional")}
                    className="flex flex-col h-20 gap-2"
                  >
                    <Stethoscope className="w-5 h-5" />
                    <span className="text-xs">Professional</span>
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "patient" ? "accent" : "outline"}
                    onClick={() => setUserType("patient")}
                    className="flex flex-col h-20 gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs">Patient</span>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="Create a secure password"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant={userType === "professional" ? "medical" : "accent"}
                >
                  Create {userType === "professional" ? "Professional" : "Patient"} Account
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our terms of service and privacy policy.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;