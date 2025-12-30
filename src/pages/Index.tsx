import { WorkflowStepper } from '@/components/WorkflowStepper';
import { SearchReport } from '@/components/SearchReport';
import { EditReport } from '@/components/EditReport';
import { ReviewReport } from '@/components/ReviewReport';
import { SignatureStep } from '@/components/SignatureStep';
import { useReportWorkflow } from '@/hooks/useReportWorkflow';
import { toast } from '@/hooks/use-toast';
import imagoLogo from '@/assets/imago-logo.png';

const Index = () => {
  const workflow = useReportWorkflow();

  const handleComplete = () => {
    toast({ title: 'Relatório finalizado!', description: 'O documento foi salvo e o PDF gerado.' });
    workflow.resetWorkflow();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex flex-col items-center justify-center py-5">
          <img src={imagoLogo} alt="Imago - Diagnóstico por Imagem" className="h-20 object-contain" />
          <h1 className="font-display font-semibold text-base text-muted-foreground mt-3 tracking-wide">Central de Questionários</h1>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <WorkflowStepper steps={workflow.steps} currentStep={workflow.currentStep} onStepClick={workflow.goToStep} />

          {workflow.currentStep === 1 && <SearchReport onSelectReport={workflow.selectReport} />}
          
          {workflow.currentStep === 2 && workflow.selectedReport && (
            <EditReport
              report={workflow.selectedReport}
              editedAnswers={workflow.editedAnswers}
              appliedSuggestions={workflow.appliedSuggestions}
              onUpdateAnswer={workflow.updateAnswer}
              onApplySuggestion={workflow.applySuggestion}
              onDismissSuggestion={workflow.dismissSuggestion}
              onContinue={() => workflow.goToStep(3)}
              onBack={workflow.resetWorkflow}
            />
          )}

          {workflow.currentStep === 3 && workflow.selectedReport && (
            <ReviewReport
              report={workflow.selectedReport}
              allAnswers={workflow.getAllAnswers()}
              onContinue={() => workflow.goToStep(4)}
              onBack={() => workflow.goToStep(2)}
            />
          )}

          {workflow.currentStep === 4 && workflow.selectedReport && (
            <SignatureStep
              report={workflow.selectedReport}
              allAnswers={workflow.getAllAnswers()}
              patientSignature={workflow.patientSignature}
              technicianSignature={workflow.technicianSignature}
              onPatientSignatureChange={workflow.setPatientSignature}
              onTechnicianSignatureChange={workflow.setTechnicianSignature}
              onBack={() => workflow.goToStep(3)}
              onComplete={handleComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;