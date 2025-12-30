import { useState, useCallback } from 'react';
import { Search, FileText, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamTypeBadge } from '@/components/ExamTypeBadge';
import { Report } from '@/types/report';
import { mockReports } from '@/data/mockReports';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SearchReportProps {
  onSelectReport: (report: Report) => void;
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function SearchReport({ onSelectReport }: SearchReportProps) {
  const [cpfSearch, setCpfSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpfSearch(formatted);
    }
  };

  const handleSearch = useCallback(async () => {
    if (cpfSearch.length < 11) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock reports by CPF (in production, this would be an API call)
    const results = mockReports.filter(report => 
      report.patient.cpf.includes(cpfSearch.replace(/\D/g, '').slice(0, 3))
    );
    
    setSearchResults(results);
    setIsSearching(false);
  }, [cpfSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Buscar Relatório de Anamnese
        </h2>
        <p className="text-muted-foreground">
          Digite o CPF do paciente para localizar o relatório
        </p>
      </div>

      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="000.000.000-00"
                value={cpfSearch}
                onChange={handleCpfChange}
                onKeyPress={handleKeyPress}
                className="pl-10 text-lg h-12 font-mono"
                maxLength={14}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={cpfSearch.length < 11 || isSearching}
              className="h-12 px-6 gradient-primary"
            >
              {isSearching ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {searchResults.length} relatório(s) encontrado(s)
              </p>
              <div className="grid gap-4">
                {searchResults.map((report, index) => (
                  <Card 
                    key={report.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-soft hover:border-primary/50",
                      "animate-slide-in"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => onSelectReport(report)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-foreground">
                                {report.patient.name}
                              </h3>
                              <ExamTypeBadge type={report.examType} size="sm" />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                CPF: {report.patient.cpf}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(report.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            report.status === 'pending' && "bg-warning/10 text-warning",
                            report.status === 'in_review' && "bg-info/10 text-info",
                            report.status === 'completed' && "bg-success/10 text-success"
                          )}>
                            {report.status === 'pending' && 'Pendente'}
                            {report.status === 'in_review' && 'Em Revisão'}
                            {report.status === 'completed' && 'Concluído'}
                          </span>
                          {report.aiSuggestions && report.aiSuggestions.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {report.aiSuggestions.length} sugestões de IA
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">
                  Nenhum relatório encontrado
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verifique o CPF digitado e tente novamente
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}