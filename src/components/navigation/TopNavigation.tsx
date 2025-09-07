import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, User, LogOut } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

interface TopNavigationProps {
  userType: "guest" | "professional" | "patient";
  onUserTypeChange: (type: "guest" | "professional" | "patient") => void;
}

const TopNavigation = ({ userType, onUserTypeChange }: TopNavigationProps) => {
  const handleLogout = () => {
    onUserTypeChange("guest");
  };

  return (
    <nav className="bg-card border-b soft-shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Digital Medical Records</span>
            <Badge variant="outline" className="text-xs">Demo</Badge>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-4">
            {userType === "guest" ? (
              <>
                {/* Demo Login Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Try Demo:</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUserTypeChange("professional")}
                    className="flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Professional
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onUserTypeChange("patient")}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Patient
                  </Button>
                </div>

                {/* Real Auth */}
                <div className="h-6 w-px bg-border" />
                <AuthModal>
                  <Button variant="medical">Sign In / Register</Button>
                </AuthModal>
              </>
            ) : (
              <>
                {/* Current User Info */}
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="capitalize">
                    {userType} Demo
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      {userType === "professional" ? (
                        <Stethoscope className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {userType === "professional" ? "Dr. Francisco Costa" : "Maria Silva"}
                    </span>
                  </div>
                </div>

                {/* Switch Demo User */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Switch to:</span>
                  {userType === "professional" ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUserTypeChange("patient")}
                      className="text-xs"
                    >
                      Patient View
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onUserTypeChange("professional")}
                      className="text-xs"
                    >
                      Professional View
                    </Button>
                  )}
                </div>

                {/* Logout */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Exit Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;