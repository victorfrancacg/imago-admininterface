import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamTypeBadge } from '@/components/ExamTypeBadge';
import { Report, QuestionAnswer } from '@/types/report';
import { CheckCircle2, User, FileText } from 'lucide-react';

interface ReviewReportProps {
  report: Report;
  allAnswers: QuestionAnswer[];
  onContinue: () => void;
  onBack: () => void;
}

export function ReviewReport({ report, allAnswers, onContinue, onBack }: ReviewReportProps) {
  const categories = Array.from(new Set(allAnswers.map(a => a.category || 'Geral')));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">Revisão Final</h2>
        <p className="text-muted-foreground">Confirme todas as informações antes de prosseguir para assinatura</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Dados do Paciente</CardTitle>
          <ExamTypeBadge type={report.examType} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground">Nome</p><p className="font-medium">{report.patient.name}</p></div>
            <div><p className="text-muted-foreground">CPF</p><p className="font-medium font-mono">{report.patient.cpf}</p></div>
            <div><p className="text-muted-foreground">Nascimento</p><p className="font-medium">{new Date(report.patient.birthDate).toLocaleDateString('pt-BR')}</p></div>
            <div><p className="text-muted-foreground">Telefone</p><p className="font-medium">{report.patient.phone || '-'}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Respostas do Questionário</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3 text-primary">{category}</h4>
              <div className="space-y-2">
                {allAnswers.filter(a => (a.category || 'Geral') === category).map(qa => (
                  <div key={qa.id} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{qa.question}</span>
                    <span className="font-medium text-right max-w-[50%]">{qa.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 p-4 bg-success/10 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="text-sm font-medium text-success">Todas as informações foram revisadas</span>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>Voltar para Edição</Button>
        <Button onClick={onContinue} className="gradient-success">Prosseguir para Assinatura</Button>
      </div>
    </div>
  );
}