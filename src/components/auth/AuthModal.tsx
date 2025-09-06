import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Stethoscope, User, UserPlus, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  children: React.ReactNode;
}

const AuthModal = ({ children }: AuthModalProps) => {
  const [userType, setUserType] = useState<"professional" | "patient">("professional");
  const [isOpen, setIsOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    if (!error) {
      setIsOpen(false);
      setLoginData({ email: "", password: "" });
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(registerData.email, registerData.password, {
      full_name: registerData.name,
      user_type: userType
    });
    if (!error) {
      setIsOpen(false);
      setRegisterData({ name: "", email: "", password: "" });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>
              Entre ou crie sua conta para começar a usar o Prontuário Digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-login"
                        type="password"
                        placeholder="Digite sua senha"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" variant="medical" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                  
                  <div className="text-center">
                    <Button type="button" variant="link" className="text-sm">
                      Esqueceu sua senha?
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* User Type Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                      type="button"
                      variant={userType === "professional" ? "medical" : "outline"}
                      onClick={() => setUserType("professional")}
                      className="flex flex-col h-20 gap-2"
                    >
                      <Stethoscope className="w-5 h-5" />
                      <span className="text-xs">Profissional</span>
                    </Button>
                    <Button
                      type="button"
                      variant={userType === "patient" ? "accent" : "outline"}
                      onClick={() => setUserType("patient")}
                      className="flex flex-col h-20 gap-2"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-xs">Paciente</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-register">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-register"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-register"
                        type="password"
                        placeholder="Crie uma senha segura"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full" 
                    variant={userType === "professional" ? "medical" : "accent"}
                    disabled={loading}
                  >
                    {loading ? "Criando..." : `Criar Conta ${userType === "professional" ? "Profissional" : "de Paciente"}`}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;