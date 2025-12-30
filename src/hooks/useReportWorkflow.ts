import { useState, useCallback } from 'react';
import { Report, WorkflowStep, AISuggestion, QuestionAnswer } from '@/types/report';

const INITIAL_STEPS: WorkflowStep[] = [
  { id: 1, title: 'Busca', description: 'Localizar relatório', status: 'active' },
  { id: 2, title: 'Edição', description: 'Revisar e corrigir', status: 'pending' },
  { id: 3, title: 'Revisão', description: 'Confirmar dados', status: 'pending' },
  { id: 4, title: 'Assinatura', description: 'Finalizar documento', status: 'pending' },
];

export function useReportWorkflow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<QuestionAnswer[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<AISuggestion[]>([]);
  const [additionalAnswers, setAdditionalAnswers] = useState<QuestionAnswer[]>([]);
  const [patientSignature, setPatientSignature] = useState<string | null>(null);
  const [technicianSignature, setTechnicianSignature] = useState<string | null>(null);

  const updateStepStatus = useCallback((stepId: number, status: 'pending' | 'active' | 'complete') => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const goToStep = useCallback((stepId: number) => {
    if (stepId < 1 || stepId > 4) return;
    
    // Mark current step as complete if moving forward
    if (stepId > currentStep) {
      updateStepStatus(currentStep, 'complete');
    }
    
    // Mark new step as active
    updateStepStatus(stepId, 'active');
    setCurrentStep(stepId);
  }, [currentStep, updateStepStatus]);

  const selectReport = useCallback((report: Report) => {
    setSelectedReport(report);
    setEditedAnswers([...report.answers]);
    setAppliedSuggestions([]);
    setAdditionalAnswers([]);
    setPatientSignature(null);
    setTechnicianSignature(null);
    goToStep(2);
  }, [goToStep]);

  const updateAnswer = useCallback((questionId: string, newAnswer: string) => {
    setEditedAnswers(prev => prev.map(qa => 
      qa.id === questionId ? { ...qa, answer: newAnswer } : qa
    ));
  }, []);

  const applySuggestion = useCallback((suggestion: AISuggestion, answer?: string) => {
    setAppliedSuggestions(prev => [...prev, { ...suggestion, applied: true, newAnswer: answer }]);
    
    if (suggestion.type === 'additional_question' && answer) {
      const newQA: QuestionAnswer = {
        id: `additional-${suggestion.id}`,
        question: suggestion.suggestion,
        answer: answer,
        category: 'Perguntas Adicionais',
      };
      setAdditionalAnswers(prev => [...prev, newQA]);
    }
  }, []);

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setAppliedSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  const getAllAnswers = useCallback(() => {
    return [...editedAnswers, ...additionalAnswers];
  }, [editedAnswers, additionalAnswers]);

  const resetWorkflow = useCallback(() => {
    setCurrentStep(1);
    setSteps(INITIAL_STEPS);
    setSelectedReport(null);
    setEditedAnswers([]);
    setAppliedSuggestions([]);
    setAdditionalAnswers([]);
    setPatientSignature(null);
    setTechnicianSignature(null);
  }, []);

  const completeReport = useCallback(() => {
    if (!selectedReport) return null;
    
    return {
      ...selectedReport,
      answers: getAllAnswers(),
      status: 'completed' as const,
      patientSignature: patientSignature || undefined,
      technicianSignature: technicianSignature || undefined,
      completedAt: new Date().toISOString(),
    };
  }, [selectedReport, getAllAnswers, patientSignature, technicianSignature]);

  return {
    currentStep,
    steps,
    selectedReport,
    editedAnswers,
    appliedSuggestions,
    additionalAnswers,
    patientSignature,
    technicianSignature,
    goToStep,
    selectReport,
    updateAnswer,
    applySuggestion,
    dismissSuggestion,
    getAllAnswers,
    setPatientSignature,
    setTechnicianSignature,
    resetWorkflow,
    completeReport,
  };
}