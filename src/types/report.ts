export type ExamType = 'ct' | 'mri' | 'densitometry' | 'mammography';

export interface PatientInfo {
  name: string;
  cpf: string;
  birthDate: string;
  phone?: string;
  email?: string;
}

export interface ResponsibleInfo {
  name: string;
  cpf: string;
  relationship: string;
  phone?: string;
}

export interface QuestionAnswer {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface AISuggestion {
  id: string;
  type: 'correction' | 'additional_question';
  originalQuestionId?: string;
  suggestion: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  applied?: boolean;
  newAnswer?: string;
}

export interface Report {
  id: string;
  examType: ExamType;
  patient: PatientInfo;
  responsible?: ResponsibleInfo;
  answers: QuestionAnswer[];
  aiSuggestions?: AISuggestion[];
  status: 'pending' | 'in_review' | 'completed';
  createdAt: string;
  updatedAt?: string;
  technicianId?: string;
  technicianName?: string;
  patientSignature?: string;
  technicianSignature?: string;
  completedAt?: string;
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  ct: 'Tomografia Computadorizada',
  mri: 'Ressonância Magnética',
  densitometry: 'Densitometria',
  mammography: 'Mamografia',
};

export const EXAM_TYPE_COLORS: Record<ExamType, string> = {
  ct: 'bg-exam-ct',
  mri: 'bg-exam-mri',
  densitometry: 'bg-exam-densitometry',
  mammography: 'bg-exam-mammography',
};