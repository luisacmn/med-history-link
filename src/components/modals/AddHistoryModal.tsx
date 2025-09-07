import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { History, Calendar, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddHistoryModalProps {
  children: React.ReactNode;
  onHistoryAdded?: () => void;
}

export default function AddHistoryModal({ children, onHistoryAdded }: AddHistoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    evaluating_professional: "",
    history_date: ""
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

      // Insert history entry
      const { error } = await supabase
        .from('medical_history')
        .insert({
          patient_profile_id: profile.id,
          title: formData.title,
          description: formData.description,
          evaluating_professional: formData.evaluating_professional || null,
          history_date: formData.history_date || new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Entrada adicionada com sucesso!",
        description: "A entrada foi salva no seu histórico médico."
      });

      resetForm();
      setIsOpen(false);
      onHistoryAdded?.();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar entrada",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      evaluating_professional: "",
      history_date: ""
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
            <History className="w-5 h-5" />
            Add to History
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Cardiology Consultation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe consultation details, symptoms, diagnoses, etc..."
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evaluating_professional">Responsible Professional</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="evaluating_professional"
                value={formData.evaluating_professional}
                onChange={(e) => setFormData({...formData, evaluating_professional: e.target.value})}
                placeholder="Ex: Dr. John Smith - License 12345"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="history_date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="history_date"
                type="date"
                value={formData.history_date}
                onChange={(e) => setFormData({...formData, history_date: e.target.value})}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              If not provided, current date will be used
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}