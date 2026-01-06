'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Loader2, Inbox, Trash2, RefreshCcw, Eye, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormResponse } from '@/lib/types';
import { formsService, responsesService } from '@/lib/appwrite';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseWithForm extends FormResponse {
  formTitle?: string;
}

function AnalyticsSummary({ responses, selectedForm, forms }: { responses: ResponseWithForm[], selectedForm: string, forms: Form[] }) {
  const currentForm = selectedForm === 'all' ? null : forms.find(f => f.$id === selectedForm);
  
  if (!currentForm && selectedForm !== 'all') return null;

  // Calculate stats
  const totalResponses = responses.length;
  
  // If a specific form is selected, we can show question-specific analytics
  const questionStats = currentForm?.questions.map(q => {
    if (q.type === 'multiple_choice' || q.type === 'checkboxes' || q.type === 'dropdown') {
      const distribution: Record<string, number> = {};
      q.options?.forEach(opt => distribution[opt.label] = 0);
      
      responses.forEach(r => {
        const answer = r.answers[q.id];
        if (Array.isArray(answer)) {
          answer.forEach(a => {
            if (distribution[a] !== undefined) distribution[a]++;
          });
        } else if (answer && distribution[answer] !== undefined) {
          distribution[answer]++;
        }
      });
      
      return {
        question: q.title,
        type: q.type,
        distribution
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="p-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border-4 border-foreground bg-primary text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Total Responses</div>
          <div className="text-6xl font-black italic">{totalResponses}</div>
        </div>
        <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase tracking-widest mb-2 text-muted-foreground">Completion Rate</div>
          <div className="text-6xl font-black italic">100%</div>
          <div className="text-[10px] font-black uppercase mt-2 text-muted-foreground">Based on submissions</div>
        </div>
        <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-xs font-black uppercase tracking-widest mb-2 text-muted-foreground">Avg. Time</div>
          <div className="text-6xl font-black italic">1.2m</div>
          <div className="text-[10px] font-black uppercase mt-2 text-muted-foreground">Estimated</div>
        </div>
      </div>

      {questionStats && questionStats.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-black uppercase italic">Question Distribution</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {questionStats.map((stat, i) => (
              <div key={i} className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
                <h3 className="text-xl font-black uppercase italic border-b-4 border-foreground pb-4">{stat?.question}</h3>
                <div className="space-y-4">
                  {Object.entries(stat?.distribution || {}).map(([label, count], j) => {
                    const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
                    return (
                      <div key={j} className="space-y-2">
                        <div className="flex justify-between text-sm font-black uppercase italic">
                          <span>{label}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="h-6 border-4 border-foreground bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResponsesPage() {
  const user = useUser();
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<ResponseWithForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Fetch user's forms
  const fetchForms = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await formsService.listByUser(user.id);
      setForms(data);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Fetch responses when form selection changes
  const fetchResponses = useCallback(async () => {
    setLoadingResponses(true);
    try {
      if (selectedForm === 'all') {
        const allResponses: ResponseWithForm[] = [];
        // Fetch responses for all forms in parallel
        const responsePromises = forms.map(async (form) => {
          if (form.$id) {
            const formResponses = await responsesService.listByForm(form.$id);
            return formResponses.map(r => ({ ...r, formTitle: form.title }));
          }
          return [];
        });
        
        const results = await Promise.all(responsePromises);
        results.forEach(res => allResponses.push(...res));
        
        setResponses(allResponses.sort((a, b) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      } else {
        const data = await responsesService.listByForm(selectedForm);
        const form = forms.find(f => f.$id === selectedForm);
        setResponses(data.map(r => ({ ...r, formTitle: form?.title || 'Unknown' })));
      }
    } catch (error) {
      console.error('Failed to fetch responses:', error);
      toast.error('Failed to load responses');
    } finally {
      setLoadingResponses(false);
    }
  }, [selectedForm, forms]);

  useEffect(() => {
    if (forms.length > 0 || (forms.length === 0 && !loading)) {
      fetchResponses();
    }
  }, [fetchResponses, forms.length, loading]);

  const handleDeleteResponse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;
    try {
      await responsesService.delete(id);
      setResponses(responses.filter(r => r.$id !== id));
      toast.success('Response deleted');
    } catch (error) {
      console.error('Failed to delete response:', error);
      toast.error('Failed to delete response');
    }
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;
    
    const headers = ['Form', 'Submitted At', 'Answers'];
    const csvContent = [
      headers.join(','),
      ...responses.map(r => [
        r.formTitle,
        new Date(r.submittedAt).toLocaleString(),
        JSON.stringify(r.answers).replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `responses-${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Responses exported successfully');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Responses
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-bold uppercase">
            Analyze and export your collected data
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            size="lg" 
            onClick={fetchResponses}
            className="h-14 px-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg font-black uppercase italic"
          >
            <RefreshCcw className={cn("w-6 h-6 stroke-[3]", loadingResponses && "animate-spin")} />
          </Button>
          <Button 
            size="lg" 
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="h-14 px-8 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg font-black uppercase italic"
          >
            <Download className="w-6 h-6 mr-2 stroke-[3]" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="text-xs font-black uppercase tracking-widest mb-2 ml-1">Filter by Form</div>
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="h-14 w-full border-4 border-foreground bg-card text-lg font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
              <SelectValue placeholder="SELECT A FORM" />
            </SelectTrigger>
            <SelectContent position="popper" className="border-4 border-foreground p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <SelectItem value="all" className="font-black uppercase italic focus:bg-primary focus:text-white">All Forms</SelectItem>
              {forms.map((form) => (
                <SelectItem key={form.$id} value={form.$id || ''} className="font-black uppercase italic focus:bg-primary focus:text-white">
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Area */}
      <div className="border-4 border-foreground bg-card shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b-4 border-foreground bg-muted/30 p-2">
            <TabsList className="h-12 border-2 border-foreground bg-card p-1">
              <TabsTrigger value="list" className="h-full px-6 font-black uppercase italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Inbox className="w-4 h-4 mr-2" />
                Responses
              </TabsTrigger>
              <TabsTrigger value="analytics" className="h-full px-6 font-black uppercase italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="m-0">
            {loading || loadingResponses ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[3]" />
                <p className="text-xl font-black uppercase italic">Fetching responses...</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="py-32 text-center p-12">
                <div className="w-24 h-24 border-4 border-foreground bg-muted flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Inbox className="w-12 h-12 text-muted-foreground stroke-[3]" />
                </div>
                <h2 className="text-4xl font-black mb-4 uppercase italic">No responses yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-xl font-bold uppercase">
                  Share your form to start collecting data from your audience.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted border-b-4 border-foreground">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="h-16 text-foreground font-black uppercase italic text-lg px-8">Form</TableHead>
                      <TableHead className="h-16 text-foreground font-black uppercase italic text-lg px-8">Submitted At</TableHead>
                      <TableHead className="h-16 text-foreground font-black uppercase italic text-lg px-8">Preview</TableHead>
                      <TableHead className="h-16 text-foreground font-black uppercase italic text-lg px-8 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.$id} className="border-b-4 border-foreground/10 hover:bg-muted/50 transition-colors">
                        <TableCell className="py-6 px-8 font-black uppercase italic">{response.formTitle}</TableCell>
                        <TableCell className="py-6 px-8 font-bold text-muted-foreground">
                          {new Date(response.submittedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <div className="max-w-[300px] truncate font-bold">
                            {Object.entries(response.answers).map(([key, val]) => {
                              const form = forms.find(f => f.$id === response.formId);
                              const question = form?.questions.find(q => q.id === key);
                              return `${question?.title || key}: ${Array.isArray(val) ? val.join(', ') : val}`;
                            }).join(' | ')}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-muted transition-all"
                                >
                                  <Eye className="w-5 h-5 stroke-[3]" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <DialogHeader>
                                  <DialogTitle className="text-3xl font-black uppercase italic">Response Details</DialogTitle>
                                  <DialogDescription className="font-bold uppercase">
                                    Submitted for {response.formTitle} on {new Date(response.submittedAt).toLocaleString()}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                                  {Object.entries(response.answers).map(([key, val]) => {
                                    const form = forms.find(f => f.$id === response.formId);
                                    const question = form?.questions.find(q => q.id === key);
                                    return (
                                      <div key={key} className="p-4 border-2 border-foreground bg-muted/30">
                                        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                                          {question?.title || `Question ID: ${key}`}
                                        </div>
                                        <div className="text-lg font-black italic">
                                          {Array.isArray(val) ? (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              {val.map((v, i) => (
                                                <span key={i} className="px-3 py-1 bg-primary text-white text-sm font-black uppercase italic">
                                                  {v}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            val || <span className="text-muted-foreground opacity-50">No answer</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteResponse(response.$id!)}
                              className="h-10 w-10 border-2 border-transparent hover:border-red-500 hover:bg-red-50 text-red-500 transition-all"
                            >
                              <Trash2 className="w-5 h-5 stroke-[3]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            {loading || loadingResponses ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[3]" />
                <p className="text-xl font-black uppercase italic">Calculating analytics...</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="py-32 text-center p-12">
                <div className="w-24 h-24 border-4 border-foreground bg-muted flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <BarChart3 className="w-12 h-12 text-muted-foreground stroke-[3]" />
                </div>
                <h2 className="text-3xl font-black mb-4 uppercase italic">No data to analyze</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg font-bold uppercase">
                  Collect some responses first to see analytics here.
                </p>
              </div>
            ) : (
              <AnalyticsSummary 
                responses={responses} 
                selectedForm={selectedForm} 
                forms={forms} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
