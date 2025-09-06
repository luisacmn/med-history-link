import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddExamModalProps {
  children: React.ReactNode;
  onExamAdded?: () => void;
}

const EXAM_TYPES = [
  "Laboratório",
  "Imagem",
  "Cardiológico",
  "Neurológico",
  "Oftalmológico",
  "Audiológico",
  "Endoscópico",
  "Outros"
];

export default function AddExamModal({ children, onExamAdded }: AddExamModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    exam_type: "",
    exam_date: "",
    notes: ""
  });
  const [file, setFile] = useState<File | null>(null);
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

      let fileUrl = null;

      // Upload file if provided
      if (file) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('medical-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('medical-files')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      // Insert exam
      const { error } = await supabase
        .from('exams')
        .insert({
          patient_profile_id: profile.id,
          name: formData.name,
          exam_type: formData.exam_type,
          exam_date: formData.exam_date,
          file_url: fileUrl,
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Exame adicionado com sucesso!",
        description: "O exame foi salvo no seu histórico médico."
      });

      resetForm();
      setIsOpen(false);
      onExamAdded?.();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar exame",
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
      exam_type: "",
      exam_date: "",
      notes: ""
    });
    setFile(null);
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
            <FileText className="w-5 h-5" />
            Adicionar Exame
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Exame *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Hemograma Completo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exam_type">Tipo de Exame *</Label>
            <Select value={formData.exam_type} onValueChange={(value) => setFormData({...formData, exam_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de exame" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exam_date">Data do Exame *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="exam_date"
                type="date"
                value={formData.exam_date}
                onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo do Exame</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="pl-10"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Observações adicionais sobre o exame..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="medical" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar Exame"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}