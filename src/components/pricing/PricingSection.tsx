import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
const PricingSection = () => {
  const plans = [{
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect to get started",
    features: ["Up to 5 patients", "Complete history", "Document upload", "Email support"],
    buttonText: "Start Free",
    variant: "outline" as const,
    popular: false
  }, {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For active professionals",
    features: ["Up to 50 patients", "Complete history", "Document upload", "Private notes", "Basic reports", "Priority support"],
    buttonText: "Choose Pro",
    variant: "medical" as const,
    popular: true
  }, {
    name: "Premium",
    price: "$79",
    period: "/month",
    description: "For larger practices",
    features: ["Unlimited patients", "Complete history", "Document upload", "Private notes", "Advanced reports", "Data export", "Custom API", "24/7 support"],
    buttonText: "Choose Premium",
    variant: "accent" as const,
    popular: false
  }];
  return <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Choose the Plan That’s Right for You</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Start for Free and Upgrade as Your Practice Grows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => <Card key={index} className={`relative ${plan.popular ? 'border-primary medical-shadow scale-105' : 'soft-shadow'} smooth-transition hover:scale-105`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>)}
                </ul>
                
                <Button className="w-full" variant={plan.variant} size="lg">
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">All Plans Include Medical Data Security and GDPR Compliance</p>
        </div>
      </div>
    </section>;
};
export default PricingSection;