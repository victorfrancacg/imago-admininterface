import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SignatureCanvas } from '@/components/SignatureCanvas';
import { ExamTypeBadge } from '@/components/ExamTypeBadge';
import { Report, QuestionAnswer } from '@/types/report';
import { FileDown, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface SignatureStepProps {
  report: Report;
  allAnswers: QuestionAnswer[];
  patientSignature: string | null;
  technicianSignature: string | null;
  onPatientSignatureChange: (sig: string | null) => void;
  onTechnicianSignatureChange: (sig: string | null) => void;
  onBack: () => void;
  onComplete: () => void;
}

export function SignatureStep({
  report, allAnswers, patientSignature, technicianSignature,
  onPatientSignatureChange, onTechnicianSignatureChange, onBack, onComplete
}: SignatureStepProps) {
  
  const canComplete = patientSignature && technicianSignature;

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Relatório de Anamnese', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Paciente: ${report.patient.name}`, 20, 40);
    pdf.text(`CPF: ${report.patient.cpf}`, 20, 48);
    pdf.text(`Exame: ${report.examType.toUpperCase()}`, 20, 56);
    
    let y = 70;
    allAnswers.forEach((qa, i) => {
      if (y > 250) { pdf.addPage(); y = 20; }
      pdf.setFontSize(10);
      pdf.text(`${qa.question}`, 20, y);
      pdf.setFontSize(9);
      pdf.text(`R: ${qa.answer}`, 25, y + 6);
      y += 14;
    });

    if (patientSignature) { pdf.addImage(patientSignature, 'PNG', 20, y + 10, 60, 25); pdf.text('Assinatura Paciente/Responsável', 20, y + 40); }
    if (technicianSignature) { pdf.addImage(technicianSignature, 'PNG', 110, y + 10, 60, 25); pdf.text('Assinatura Técnico', 110, y + 40); }
    
    pdf.save(`anamnese_${report.patient.cpf.replace(/\D/g, '')}.pdf`);
    toast({ title: 'PDF gerado com sucesso!', description: 'O documento foi baixado.' });
  };

  const handleComplete = () => {
    generatePDF();
    onComplete();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold">Assinaturas</h2>
        <p className="text-muted-foreground">Colete as assinaturas para finalizar o documento</p>
      </div>

      <div className="flex flex-col gap-6">
        <SignatureCanvas label="Assinatura do Paciente/Responsável" onSignatureChange={onPatientSignatureChange} />
        <SignatureCanvas label="Assinatura do Técnico" onSignatureChange={onTechnicianSignatureChange} />
      </div>

      {canComplete && (
        <div className="flex items-center justify-center gap-2 p-4 bg-success/10 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-success">Ambas assinaturas coletadas</span>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>Voltar para Revisão</Button>
        <Button onClick={handleComplete} disabled={!canComplete} className="gradient-success">
          <FileDown className="h-4 w-4 mr-2" />Gerar PDF e Finalizar
        </Button>
      </div>
    </div>
  );
}