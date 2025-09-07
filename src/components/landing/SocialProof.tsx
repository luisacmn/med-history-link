import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Users, Award } from "lucide-react";

const SocialProof = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Martinez",
      role: "Family Medicine",
      location: "Austin, TX",
      rating: 5,
      text: "This platform has revolutionized how I manage patient records. The interface is intuitive and my patients love being able to upload their own documents.",
      avatar: "SM"
    },
    {
      name: "Dr. Michael Chen", 
      role: "Cardiology",
      location: "Seattle, WA",
      rating: 5,
      text: "Finally, a medical records system that works for both doctors and patients. The shared access feature has improved our workflow tremendously.",
      avatar: "MC"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Internal Medicine",
      location: "Miami, FL", 
      rating: 5,
      text: "Security and ease of use - exactly what we needed. My patients are more engaged with their health data than ever before.",
      avatar: "ER"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Healthcare Providers",
      color: "text-primary"
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Data Security Uptime",
      color: "text-accent"
    },
    {
      icon: Award,
      value: "HIPAA",
      label: "Compliant Platform",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join thousands of healthcare providers who trust our platform for secure patient data management
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="soft-shadow hover:scale-105 smooth-transition">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl mx-auto">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              SOC 2 Certified
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              256-bit Encryption
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              24/7 Support
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;