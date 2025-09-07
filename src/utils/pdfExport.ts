import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MedicalData {
  exams: Array<{
    id: number;
    name: string;
    date: string;
    type: string;
    file?: string;
  }>;
  vaccines: Array<{
    id: number;
    name: string;
    date: string;
    batch?: string;
    location?: string;
  }>;
  medications: Array<{
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    status: string;
  }>;
  history: Array<{
    id: number;
    date: string;
    type: string;
    description: string;
    professional?: string;
  }>;
}

interface ExportOptions {
  sections?: ('exams' | 'vaccines' | 'medications' | 'history')[];
  patientName?: string;
  professionalName?: string;
}

export const exportMedicalHistoryToPDF = async (
  data: MedicalData, 
  options: ExportOptions = {}
) => {
  const {
    sections = ['exams', 'vaccines', 'medications', 'history'],
    patientName = 'Patient',
    professionalName = 'Healthcare Provider'
  } = options;

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add new page if needed
  const checkAndAddPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, fontSize: number = 10, fontStyle: string = 'normal') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    const lines = pdf.splitTextToSize(text, pageWidth - 40);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.35);
  };

  // Header
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  addText('MEDICAL HISTORY REPORT', 20, 18, 18, 'bold');
  
  pdf.setTextColor(0, 0, 0);
  yPosition = 45;

  // Patient Information
  addText(`Patient: ${patientName}`, 20, yPosition, 12, 'bold');
  yPosition += 8;
  addText(`Healthcare Provider: ${professionalName}`, 20, yPosition, 10);
  yPosition += 8;
  addText(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition, 10);
  yPosition += 20;

  // Exams Section
  if (sections.includes('exams') && data.exams.length > 0) {
    checkAndAddPage(40);
    
    // Section header
    pdf.setFillColor(52, 152, 219);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    addText('EXAMS', 20, yPosition + 5, 14, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition += 25;

    data.exams.forEach((exam, index) => {
      checkAndAddPage(25);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition - 3, pageWidth - 20, yPosition - 3);
      
      const nameHeight = addText(`${index + 1}. ${exam.name}`, 20, yPosition, 11, 'bold');
      yPosition += nameHeight + 3;
      
      const detailsHeight = addText(`Date: ${exam.date} | Type: ${exam.type}`, 25, yPosition, 9);
      yPosition += detailsHeight + 8;
    });
    
    yPosition += 10;
  }

  // Vaccines Section
  if (sections.includes('vaccines') && data.vaccines.length > 0) {
    checkAndAddPage(40);
    
    pdf.setFillColor(46, 204, 113);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    addText('VACCINES', 20, yPosition + 5, 14, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition += 25;

    data.vaccines.forEach((vaccine, index) => {
      checkAndAddPage(30);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition - 3, pageWidth - 20, yPosition - 3);
      
      const nameHeight = addText(`${index + 1}. ${vaccine.name}`, 20, yPosition, 11, 'bold');
      yPosition += nameHeight + 3;
      
      let details = `Date: ${vaccine.date}`;
      if (vaccine.batch) details += ` | Batch: ${vaccine.batch}`;
      if (vaccine.location) details += ` | Location: ${vaccine.location}`;
      
      const detailsHeight = addText(details, 25, yPosition, 9);
      yPosition += detailsHeight + 8;
    });
    
    yPosition += 10;
  }

  // Medications Section
  if (sections.includes('medications') && data.medications.length > 0) {
    checkAndAddPage(40);
    
    pdf.setFillColor(155, 89, 182);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    addText('MEDICATIONS', 20, yPosition + 5, 14, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition += 25;

    data.medications.forEach((medication, index) => {
      checkAndAddPage(35);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition - 3, pageWidth - 20, yPosition - 3);
      
      const nameHeight = addText(`${index + 1}. ${medication.name}`, 20, yPosition, 11, 'bold');
      yPosition += nameHeight + 3;
      
      const dosageHeight = addText(`Dosage: ${medication.dosage} | Frequency: ${medication.frequency}`, 25, yPosition, 9);
      yPosition += dosageHeight + 3;
      
      const statusHeight = addText(`Start Date: ${medication.startDate} | Status: ${medication.status}`, 25, yPosition, 9);
      yPosition += statusHeight + 8;
    });
    
    yPosition += 10;
  }

  // Medical History Section
  if (sections.includes('history') && data.history.length > 0) {
    checkAndAddPage(40);
    
    pdf.setFillColor(230, 126, 34);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    addText('MEDICAL HISTORY', 20, yPosition + 5, 14, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition += 25;

    data.history.forEach((entry, index) => {
      checkAndAddPage(40);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition - 3, pageWidth - 20, yPosition - 3);
      
      const typeHeight = addText(`${index + 1}. ${entry.type}`, 20, yPosition, 11, 'bold');
      yPosition += typeHeight + 3;
      
      const dateHeight = addText(`Date: ${entry.date}${entry.professional ? ` | Professional: ${entry.professional}` : ''}`, 25, yPosition, 9);
      yPosition += dateHeight + 3;
      
      const descHeight = addText(entry.description, 25, yPosition, 9);
      yPosition += descHeight + 8;
    });
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
    pdf.text('Generated by Medical Records System', 20, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `${patientName.replace(/\s+/g, '_')}_Medical_History_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const exportElementToPDF = async (elementId: string, fileName: string = 'export.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
};