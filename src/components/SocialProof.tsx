import { Shield, Users, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: "+100",
      label: "Profissionais de saúde já utilizam",
      color: "text-primary"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Dados criptografados e seguros",
      color: "text-accent"
    },
    {
      icon: CheckCircle,
      value: "+500",
      label: "Pacientes cadastrados",
      color: "text-primary"
    },
    {
      icon: Star,
      value: "4.9",
      label: "Avaliação média dos usuários",
      color: "text-accent"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Carlos Silva",
      specialty: "Cardiologista",
      text: "Revolucionou minha prática. Agora recebo os dados organizados dos pacientes antes mesmo da consulta.",
      avatar: "C"
    },
    {
      name: "Dra. Ana Santos",
      specialty: "Nutricionista",
      text: "Meus pacientes adoram poder organizar seus exames e histórico. Me poupa muito tempo nas consultas.",
      avatar: "A"
    },
    {
      name: "Dr. João Oliveira",
      specialty: "Fisioterapeuta",
      text: "Interface simples e segura. Fácil para os pacientes usarem e prático para nós profissionais.",
      avatar: "J"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Confiado por profissionais de saúde
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Dados seguros, pacientes organizados, consultas mais eficientes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 bg-background/50 soft-shadow">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            O que dizem nossos usuários
          </h3>
          <p className="text-muted-foreground">
            Depoimentos reais de profissionais que já transformaram sua prática
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-background soft-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.specialty}</p>
                  </div>
                </div>
                <p className="text-foreground italic">"{testimonial.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Section */}
        <div className="mt-16 text-center">
          <Card className="border-primary/20 bg-primary/5 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Segurança e Privacidade Garantidas
              </h3>
              <p className="text-muted-foreground mb-4">
                Seus dados e dos seus pacientes estão protegidos com criptografia de ponta a ponta, 
                seguindo as mais rígidas normas de segurança médica.
              </p>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  LGPD Compliance
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  SSL/TLS Encryption
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Backup Automático
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;