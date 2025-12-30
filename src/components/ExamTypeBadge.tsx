import { ExamType, EXAM_TYPE_LABELS } from '@/types/report';
import { cn } from '@/lib/utils';
import { Scan, Brain, Bone, Heart } from 'lucide-react';

interface ExamTypeBadgeProps {
  type: ExamType;
  size?: 'sm' | 'md' | 'lg';
}

const EXAM_ICONS: Record<ExamType, typeof Scan> = {
  ct: Scan,
  mri: Brain,
  densitometry: Bone,
  mammography: Heart,
};

const EXAM_COLORS: Record<ExamType, string> = {
  ct: 'bg-exam-ct text-primary-foreground',
  mri: 'bg-exam-mri text-primary-foreground',
  densitometry: 'bg-exam-densitometry text-accent-foreground',
  mammography: 'bg-exam-mammography text-primary-foreground',
};

export function ExamTypeBadge({ type, size = 'md' }: ExamTypeBadgeProps) {
  const Icon = EXAM_ICONS[type];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        EXAM_COLORS[type],
        size === 'sm' && "px-2 py-0.5 text-xs",
        size === 'md' && "px-3 py-1 text-sm",
        size === 'lg' && "px-4 py-1.5 text-base"
      )}
    >
      <Icon className={cn(
        size === 'sm' && "h-3 w-3",
        size === 'md' && "h-4 w-4",
        size === 'lg' && "h-5 w-5"
      )} />
      {EXAM_TYPE_LABELS[type]}
    </span>
  );
}