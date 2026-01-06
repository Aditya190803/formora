'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Copy, 
  Trash2, 
  FileText, 
  BarChart3, 
  Settings,
  Loader2,
  Filter
} from 'lucide-react';
import { Form, FormStyle } from '@/lib/types';
import { formsService } from '@/lib/appwrite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function FormsPage() {
  const user = useUser();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<FormStyle | 'all'>('all');

  useEffect(() => {
    const fetchForms = async () => {
      if (!user?.id) return;
      try {
        const data = await formsService.listByUser(user.id);
        setForms(data);
      } catch (error) {
        console.error('Failed to fetch forms:', error);
        toast.error('Failed to load forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    try {
      await formsService.delete(id);
      setForms(forms.filter(f => f.$id !== id));
      toast.success('Form deleted successfully');
    } catch (error) {
      console.error('Failed to delete form:', error);
      toast.error('Failed to delete form');
    }
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/f/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Form link copied to clipboard');
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = styleFilter === 'all' || form.style === styleFilter;
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            My Forms
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-bold uppercase">
            Manage and monitor your data collection tools
          </p>
        </div>
        <Button size="lg" className="h-14 px-8 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg font-black uppercase italic" asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="w-6 h-6 mr-2 stroke-[3]" />
            New Form
          </Link>
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground stroke-[3]" />
          <Input 
            placeholder="SEARCH FORMS..." 
            className="pl-12 h-14 border-4 border-foreground bg-card text-lg font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-primary transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={styleFilter} onValueChange={(value) => setStyleFilter(value as FormStyle | 'all')}>
          <SelectTrigger className="w-full md:w-[200px] h-14 border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic">
            <div className="flex items-center">
              <Filter className="w-5 h-5 mr-2 stroke-[3]" />
              <SelectValue placeholder="STYLE" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-4 border-foreground p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <SelectItem value="all" className="font-black uppercase italic">All Styles</SelectItem>
            <SelectItem value="classic" className="font-black uppercase italic">Classic</SelectItem>
            <SelectItem value="conversational" className="font-black uppercase italic">Conversational</SelectItem>
            <SelectItem value="marketing" className="font-black uppercase italic">Marketing</SelectItem>
            <SelectItem value="neo_brutalism" className="font-black uppercase italic">Neo Brutalism</SelectItem>
            <SelectItem value="minimal" className="font-black uppercase italic">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 border-4 border-foreground border-dashed bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[3]" />
          <p className="text-xl font-black uppercase italic">Loading your forms...</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="py-24 text-center bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12">
          <div className="w-24 h-24 border-4 border-foreground bg-muted flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <FileText className="w-12 h-12 text-muted-foreground stroke-[3]" />
          </div>
          <h2 className="text-4xl font-black mb-4 uppercase italic">No forms found</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto text-xl font-bold uppercase">
            {searchQuery ? "Try adjusting your search terms" : "Start by creating your first form"}
          </p>
          {!searchQuery && (
            <Button size="lg" className="h-16 px-10 border-4 border-foreground bg-primary text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-xl font-black uppercase italic" asChild>
              <Link href="/dashboard/forms/new">
                Create Form
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredForms.map((form) => (
            <div key={form.$id} className="group relative border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-4 py-1 border-2 border-foreground bg-primary/10 text-xs font-black uppercase tracking-widest">
                    {form.style}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-foreground hover:bg-muted transition-all">
                        <MoreVertical className="w-5 h-5 stroke-[3]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-4 border-foreground p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <DropdownMenuItem className="font-black uppercase italic focus:bg-primary focus:text-white cursor-pointer" asChild>
                        <Link href={`/dashboard/forms/${form.$id}`}>
                          <Settings className="w-4 h-4 mr-2 stroke-[3]" />
                          Edit Form
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-black uppercase italic focus:bg-primary focus:text-white cursor-pointer" asChild>
                        <Link href={`/dashboard/responses?formId=${form.$id}`}>
                          <BarChart3 className="w-4 h-4 mr-2 stroke-[3]" />
                          View Responses
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="font-black uppercase italic focus:bg-primary focus:text-white cursor-pointer"
                        onClick={() => form.$id && copyToClipboard(form.$id)}
                      >
                        <Copy className="w-4 h-4 mr-2 stroke-[3]" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-foreground h-1" />
                      <DropdownMenuItem 
                        className="font-black uppercase italic text-destructive focus:bg-destructive focus:text-white cursor-pointer"
                        onClick={() => form.$id && handleDelete(form.$id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2 stroke-[3]" />
                        Delete Form
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <h3 className="text-2xl font-black mb-2 uppercase italic group-hover:text-primary transition-colors line-clamp-1">
                  {form.title}
                </h3>
                <p className="text-muted-foreground font-bold line-clamp-2 mb-8">
                  {form.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t-4 border-foreground/10">
                  <div>
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Responses</div>
                    <div className="text-xl font-black">0</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Created</div>
                    <div className="text-sm font-black">{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted border-t-4 border-foreground flex gap-4">
                <Button variant="outline" className="flex-1 border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-xs" asChild>
                  <Link href={`/f/${form.$id}`} target="_blank">
                    <ExternalLink className="w-3 h-3 mr-2 stroke-[3]" />
                    Preview
                  </Link>
                </Button>
                <Button className="flex-1 border-2 border-foreground bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-xs" asChild>
                  <Link href={`/dashboard/forms/${form.$id}`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
