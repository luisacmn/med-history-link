import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Syringe, Calendar, MapPin, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddVaccineModalProps {
  children: React.ReactNode;
  onVaccineAdded?: () => void;
}

export default function AddVaccineModal({ children, onVaccineAdded }: AddVaccineModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    vaccine_date: "",
    location: ""
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
        throw new Error('Profile not found');
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

      // Insert vaccine
      const { error } = await supabase
        .from('vaccines')
        .insert({
          patient_profile_id: profile.id,
          name: formData.name,
          vaccine_date: formData.vaccine_date,
          location: formData.location || null,
          proof_file_url: fileUrl
        });

      if (error) throw error;

      toast({
        title: "Vaccine added successfully!",
        description: "The vaccine has been saved to your vaccination card."
      });

      resetForm();
      setIsOpen(false);
      onVaccineAdded?.();
    } catch (error: any) {
      toast({
        title: "Error adding vaccine",
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
      vaccine_date: "",
      location: ""
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
            <Syringe className="w-5 h-5" />
            Add Vaccine
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vaccine Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: COVID-19 (4th dose)"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vaccine_date">Application Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="vaccine_date"
                type="date"
                value={formData.vaccine_date}
                onChange={(e) => setFormData({...formData, vaccine_date: e.target.value})}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Application Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Ex: Public Health Center, Private Clinic"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Proof (Optional)</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="pl-10"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (max. 10MB)
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Vaccine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}