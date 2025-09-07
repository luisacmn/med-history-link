import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Mail, Phone, Calendar, CreditCard, Copy, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddPatientModalProps {
  children: React.ReactNode;
  onPatientAdded?: () => void;
}

export default function AddPatientModal({ children, onPatientAdded }: AddPatientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    cpf: ""
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get user's profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Professional profile not found');
      }

      // Check patient limit (5 for free plan)
      const { data: existingPatients, count } = await supabase
        .from('patients')
        .select('id', { count: 'exact' })
        .eq('professional_id', profile.id);

      if (count && count >= 5) {
        toast({
          title: "Limit reached",
          description: "You have reached the limit of 5 patients on the free plan. Upgrade to add more patients.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Insert patient
      const { data: patient, error } = await supabase
        .from('patients')
        .insert({
          professional_id: profile.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birth_date || null,
          cpf: formData.cpf || null
        })
        .select()
        .single();

      if (error) throw error;

      // Generate access link
      const accessLink = `${window.location.origin}/patient-access?token=${patient.access_token}`;
      setGeneratedLink(accessLink);

      toast({
        title: "Patient added successfully!",
        description: "Access link generated. Share with the patient."
      });

      onPatientAdded?.();
    } catch (error: any) {
      toast({
        title: "Error adding patient",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Link copied!",
      description: "The link has been copied to the clipboard."
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      birth_date: "",
      cpf: ""
    });
    setGeneratedLink("");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  if (generatedLink) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild onClick={() => setIsOpen(true)}>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Patient Added Successfully!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <CardContent className="p-0">
                <div className="text-center space-y-4">
                  <QrCode className="w-16 h-16 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Access Link Generated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share this link with {formData.name} so they can access and register their medical record:
                    </p>
                    
                    <div className="bg-background border rounded-lg p-3 mb-4">
                      <code className="text-xs break-all">{generatedLink}</code>
                    </div>
                    
                    <Button onClick={copyLink} className="w-full" variant="medical">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                The patient will be able to use this link to access the platform and organize their medical data.
              </p>
              <Button variant="outline" onClick={handleClose} className="w-full">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Patient
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Patient's full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(11) 99999-9999"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birth_date">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  placeholder="000.000.000-00"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="medical" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}