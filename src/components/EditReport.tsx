import { useState } from 'react';
import { Lightbulb, AlertCircle, CheckCircle2, X, Pencil, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ExamTypeBadge } from '@/components/ExamTypeBadge';
import { Report, QuestionAnswer, AISuggestion, EXAM_TYPE_LABELS } from '@/types/report';
import { cn } from '@/lib/utils';

interface EditReportProps {
  report: Report;
  editedAnswers: QuestionAnswer[];
  appliedSuggestions: AISuggestion[];
  onUpdateAnswer: (questionId: string, newAnswer: string) => void;
  onApplySuggestion: (suggestion: AISuggestion, answer?: string) => void;
  onDismissSuggestion: (suggestionId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function EditReport({
  report,
  editedAnswers,
  appliedSuggestions,
  onUpdateAnswer,
  onApplySuggestion,
  onDismissSuggestion,
  onContinue,
  onBack,
}: EditReportProps) {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [suggestionAnswers, setSuggestionAnswers] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

  const pendingSuggestions = report.aiSuggestions?.filter(
    s => !appliedSuggestions.find(as => as.id === s.id)
  ) || [];

  const categories = Array.from(new Set(editedAnswers.map(a => a.category || 'Geral')));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.type === 'additional_question') {
      const answer = suggestionAnswers[suggestion.id];
      if (answer?.trim()) {
        onApplySuggestion(suggestion, answer);
        setSuggestionAnswers(prev => {
          const next = { ...prev };
          delete next[suggestion.id];
          return next;
        });
      }
    } else {
      onApplySuggestion(suggestion);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Edição do Relatório
          </h2>
          <p className="text-muted-foreground">
            Revise as respostas e aplique as sugestões da IA
          </p>
        </div>
        <ExamTypeBadge type={report.examType} size="lg" />
      </div>

      {/* Patient Info */}
      <Card className="bg-secondary/50">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Paciente</p>
              <p className="font-medium">{report.patient.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">CPF</p>
              <p className="font-medium font-mono">{report.patient.cpf}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">{new Date(report.patient.birthDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">{report.patient.phone || 'Não informado'}</p>
            </div>
          </div>
          {report.responsible && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Responsável</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nome</p>
                  <p className="font-medium">{report.responsible.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Parentesco</p>
                  <p className="font-medium">{report.responsible.relationship}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CPF</p>
                  <p className="font-medium font-mono">{report.responsible.cpf}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Suggestions Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-soft border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Sugestões da IA
                {pendingSuggestions.length > 0 && (
                  <span className="ml-auto bg-warning/10 text-warning text-xs font-medium px-2 py-0.5 rounded-full">
                    {pendingSuggestions.length} pendente(s)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingSuggestions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm">Todas as sugestões foram processadas</p>
                </div>
              ) : (
                pendingSuggestions.map(suggestion => (
                  <Card 
                    key={suggestion.id}
                    className={cn(
                      "border-l-4",
                      suggestion.priority === 'high' && "border-l-destructive",
                      suggestion.priority === 'medium' && "border-l-warning",
                      suggestion.priority === 'low' && "border-l-info"
                    )}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {suggestion.type === 'correction' ? (
                            <Pencil className="h-4 w-4 text-warning" />
                          ) : (
                            <Plus className="h-4 w-4 text-info" />
                          )}
                          <span className={cn(
                            "text-xs font-medium px-1.5 py-0.5 rounded",
                            suggestion.type === 'correction' && "bg-warning/10 text-warning",
                            suggestion.type === 'additional_question' && "bg-info/10 text-info"
                          )}>
                            {suggestion.type === 'correction' ? 'Correção' : 'Pergunta Adicional'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onDismissSuggestion(suggestion.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-sm font-medium">{suggestion.suggestion}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                      
                      {suggestion.type === 'additional_question' && (
                        <Textarea
                          placeholder="Digite a resposta..."
                          value={suggestionAnswers[suggestion.id] || ''}
                          onChange={(e) => setSuggestionAnswers(prev => ({
                            ...prev,
                            [suggestion.id]: e.target.value
                          }))}
                          className="text-sm min-h-[60px]"
                        />
                      )}
                      
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleApplySuggestion(suggestion)}
                        disabled={suggestion.type === 'additional_question' && !suggestionAnswers[suggestion.id]?.trim()}
                      >
                        {suggestion.type === 'correction' ? 'Marcar como Revisado' : 'Adicionar Resposta'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Answers Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Respostas do Questionário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map(category => {
                const categoryAnswers = editedAnswers.filter(a => (a.category || 'Geral') === category);
                const isExpanded = expandedCategories.has('all') || expandedCategories.has(category);
                
                return (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="font-medium text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {categoryAnswers.length} pergunta(s)
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="divide-y">
                        {categoryAnswers.map(qa => (
                          <div key={qa.id} className="p-3 space-y-2">
                            <p className="text-sm font-medium text-foreground">{qa.question}</p>
                            {editingQuestion === qa.id ? (
                              <div className="flex gap-2">
                                <Input
                                  defaultValue={qa.answer}
                                  onBlur={(e) => {
                                    onUpdateAnswer(qa.id, e.target.value);
                                    setEditingQuestion(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      onUpdateAnswer(qa.id, e.currentTarget.value);
                                      setEditingQuestion(null);
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingQuestion(null);
                                    }
                                  }}
                                  autoFocus
                                  className="text-sm"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-muted-foreground">{qa.answer}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingQuestion(qa.id)}
                                  className="h-7 px-2"
                                >
                                  <Pencil className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Voltar à Busca
        </Button>
        <Button onClick={onContinue} className="gradient-primary">
          Continuar para Revisão
        </Button>
      </div>
    </div>
  );
}