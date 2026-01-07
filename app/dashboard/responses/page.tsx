'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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

  const totalResponses = responses.length;
  
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
    <div className="p-8 space-y-16">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-muted border border-muted">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 space-y-4"
        >
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Total Responses</span>
          </div>
          <div className="text-5xl font-heading tracking-tighter">{totalResponses}</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 space-y-4"
        >
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Completion Rate</span>
          </div>
          <div className="text-5xl font-heading tracking-tighter">100%</div>
          <div className="text-[10px] uppercase tracking-widest opacity-40">Based on submissions</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 space-y-4"
        >
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Avg. Duration</span>
          </div>
          <div className="text-5xl font-heading tracking-tighter">1.2m</div>
          <div className="text-[10px] uppercase tracking-widest opacity-40">Estimated</div>
        </motion.div>
      </div>

      {questionStats && questionStats.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-heading tracking-tight italic">Distribution Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-muted border border-muted">
            {questionStats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-bg space-y-6"
              >
                <h3 className="text-lg font-heading tracking-tight border-b border-muted pb-4">{stat?.question}</h3>
                <div className="space-y-4">
                  {Object.entries(stat?.distribution || {}).map(([label, count], j) => {
                    const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
                    return (
                      <div key={j} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="opacity-60">{label}</span>
                          <span className="font-medium">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-1 bg-muted overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: j * 0.1 }}
                            className="h-full bg-ink"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
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

  const fetchResponses = useCallback(async () => {
    setLoadingResponses(true);
    try {
      if (selectedForm === 'all') {
        const allResponses: ResponseWithForm[] = [];
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
    <div className="space-y-20 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-12 border-b border-muted">
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-heading tracking-tighter leading-none italic"
          >
            Ledger
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.5em] font-medium"
          >
            Collected narratives and their artifacts
          </motion.p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            size="lg" 
            onClick={fetchResponses}
            className="h-14 px-6"
          >
            <RefreshCcw className={cn("w-4 h-4", loadingResponses && "animate-spin")} />
          </Button>
          <Button 
            size="lg" 
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="h-14"
          >
            <Download className="w-4 h-4 mr-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Filter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">Filter by Narrative</div>
        <Select value={selectedForm} onValueChange={setSelectedForm}>
          <SelectTrigger className="h-14 w-full md:w-[300px] border-muted bg-transparent font-body focus:ring-0">
            <SelectValue placeholder="Select a form" />
          </SelectTrigger>
          <SelectContent className="border-muted">
            <SelectItem value="all">All Narratives</SelectItem>
            {forms.map((form) => (
              <SelectItem key={form.$id} value={form.$id || ''}>
                {form.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Content Area */}
      <div className="border border-muted overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-muted bg-muted/5 px-6 py-3">
            <TabsList className="h-auto p-0 bg-transparent flex gap-6">
              <TabsTrigger 
                value="list" 
                className="rounded-none border-b border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-widest font-medium pb-1"
              >
                <Inbox className="w-3 h-3 mr-2" />
                Responses
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-none border-b border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-widest font-medium pb-1"
              >
                <BarChart3 className="w-3 h-3 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="m-0">
            {loading || loadingResponses ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-8">
                <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Retrieving Records</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="py-32 text-center space-y-8">
                <h2 className="text-4xl font-heading tracking-tight italic opacity-60">No responses yet</h2>
                <p className="text-sm opacity-40 max-w-sm mx-auto leading-relaxed">
                  Share your narratives to begin collecting responses from your audience.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-muted">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="h-14 text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 px-6">Narrative</TableHead>
                      <TableHead className="h-14 text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 px-6">Timestamp</TableHead>
                      <TableHead className="h-14 text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 px-6">Preview</TableHead>
                      <TableHead className="h-14 text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response, index) => (
                      <motion.tr 
                        key={response.$id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-muted/50 hover:bg-muted/5 transition-colors"
                      >
                        <TableCell className="py-6 px-6 font-medium">{response.formTitle}</TableCell>
                        <TableCell className="py-6 px-6 opacity-60 text-sm">
                          {new Date(response.submittedAt).toLocaleString('en-GB')}
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="max-w-[300px] truncate text-sm opacity-50">
                            {Object.entries(response.answers).slice(0, 2).map(([key, val]) => {
                              const form = forms.find(f => f.$id === response.formId);
                              const question = form?.questions.find(q => q.id === key);
                              return `${question?.title || key}: ${Array.isArray(val) ? val.join(', ') : val}`;
                            }).join(' · ')}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-40 hover:opacity-100">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl border-muted">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-heading tracking-tight italic">Response Record</DialogTitle>
                                  <DialogDescription className="text-[10px] uppercase tracking-[0.3em] opacity-60">
                                    {response.formTitle} — {new Date(response.submittedAt).toLocaleString('en-GB')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                                  {Object.entries(response.answers).map(([key, val]) => {
                                    const form = forms.find(f => f.$id === response.formId);
                                    const question = form?.questions.find(q => q.id === key);
                                    return (
                                      <div key={key} className="p-4 border-l-2 border-muted bg-muted/5">
                                        <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">
                                          {question?.title || `Field: ${key}`}
                                        </div>
                                        <div className="text-lg">
                                          {Array.isArray(val) ? (
                                            <div className="flex flex-wrap gap-2">
                                              {val.map((v, i) => (
                                                <span key={i} className="px-3 py-1 bg-muted text-sm">
                                                  {v}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            val || <span className="opacity-30 italic">No response</span>
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
                              className="h-8 w-8 opacity-40 hover:opacity-100 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            {loading || loadingResponses ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-8">
                <Loader2 className="w-8 h-8 animate-spin opacity-20" />
                <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Calculating Metrics</p>
              </div>
            ) : responses.length === 0 ? (
              <div className="py-32 text-center space-y-8">
                <h2 className="text-4xl font-heading tracking-tight italic opacity-60">No data to analyze</h2>
                <p className="text-sm opacity-40 max-w-sm mx-auto leading-relaxed">
                  Collect some responses first to view analytics.
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
