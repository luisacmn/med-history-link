import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddMedicationModalProps {
  children: React.ReactNode;
  onMedicationAdded?: () => void;
}

export default function AddMedicationModal({ children, onMedicationAdded }: AddMedicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dose: "",
    frequency: "",
    start_date: "",
    end_date: "",
    still_in_use: false
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Perfil não encontrado');
      }

      // Insert medication
      const { error } = await supabase
        .from('medications')
        .insert({
          patient_profile_id: profile.id,
          name: formData.name,
          dose: formData.dose,
          frequency: formData.frequency,
          start_date: formData.start_date,
          end_date: formData.still_in_use ? null : (formData.end_date || null),
          still_in_use: formData.still_in_use
        });

      if (error) throw error;

      toast({
        title: "Medicação adicionada com sucesso!",
        description: "A medicação foi salva no seu histórico médico."
      });

      resetForm();
      setIsOpen(false);
      onMedicationAdded?.();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar medicação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dose: "",
      frequency: "",
      start_date: "",
      end_date: "",
      still_in_use: false
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Adicionar Medicação
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Medicação *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Losartana 50mg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dose">Dosagem *</Label>
            <Input
              id="dose"
              value={formData.dose}
              onChange={(e) => setFormData({...formData, dose: e.target.value})}
              placeholder="Ex: 1 comprimido"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência *</Label>
            <Input
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              placeholder="Ex: 1x ao dia pela manhã"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start_date">Data de Início *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="still_in_use"
              checked={formData.still_in_use}
              onCheckedChange={(checked) => setFormData({...formData, still_in_use: checked as boolean})}
            />
            <Label htmlFor="still_in_use">Ainda em uso</Label>
          </div>
          
          {!formData.still_in_use && (
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Término</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="medical" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar Medicação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}