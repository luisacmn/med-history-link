import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "exams" | "vaccines" | "medications" | "history";
}

const UploadDocumentModal = ({ isOpen, onClose, documentType }: UploadDocumentModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    type: "",
    notes: "",
    dosage: "",
    frequency: "",
    location: "",
    batch: "",
    professional: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const getModalTitle = () => {
    switch (documentType) {
      case "exams": return "Upload Exam Document";
      case "vaccines": return "Upload Vaccine Record";
      case "medications": return "Upload Medication Information";
      case "history": return "Upload Medical History Entry";
      default: return "Upload Document";
    }
  };

  const getExamTypes = () => [
    "Blood Test", "X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Biopsy", "Other"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, JPG, JPEG, or PNG files only.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: "File required",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically upload to Supabase storage and save to database
      console.log("Uploading:", { formData, file: selectedFile });
      
      setUploadStatus("success");
      toast({
        title: "Upload successful",
        description: `${getModalTitle().replace("Upload ", "")} has been uploaded successfully.`
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          name: "", date: "", type: "", notes: "", dosage: "", frequency: "",
          location: "", batch: "", professional: "", description: ""
        });
        setSelectedFile(null);
        setUploadStatus("idle");
        onClose();
      }, 1500);
      
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderFormFields = () => {
    switch (documentType) {
      case "exams":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Blood Test, X-Ray"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Exam Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {getExamTypes().map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Exam Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </>
        );

      case "vaccines":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Vaccine Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., COVID-19, Influenza"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Vaccination Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch">Batch Number</Label>
              <Input
                id="batch"
                value={formData.batch}
                onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                placeholder="e.g., CV2024001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Vaccination Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Central Clinic"
              />
            </div>
          </>
        );

      case "medications":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Medication Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Losartan 50mg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Once daily"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Start Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </>
        );

      case "history":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="type">Entry Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="diagnosis">Diagnosis</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional">Healthcare Professional</Label>
              <Input
                id="professional"
                value={formData.professional}
                onChange={(e) => setFormData(prev => ({ ...prev, professional: e.target.value }))}
                placeholder="e.g., Dr. Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the medical event, findings, or treatment..."
                required
                rows={3}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            Fill in the details and upload your document. Supported formats: PDF, JPG, PNG (max 5MB)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Document File *</Label>
            {!selectedFile ? (
              <label className="block border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
                </div>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {uploadStatus === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {uploadStatus === "error" && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    {uploadStatus === "idle" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Form Fields */}
          {renderFormFields()}

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information or notes..."
              rows={2}
            />
          </div>

          {/* Upload Status */}
          {uploadStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Document uploaded successfully! The modal will close automatically.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload failed. Please check your connection and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isUploading || !selectedFile || uploadStatus === "success"}
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentModal;