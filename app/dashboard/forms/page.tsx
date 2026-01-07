'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Loader2
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
            Archive
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.5em] font-medium"
          >
            Your collection of narrative instruments
          </motion.p>
        </div>
        <Button size="lg" className="h-14" asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="w-4 h-4 mr-3" />
            New Narrative
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row gap-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <Input 
            placeholder="Search narratives..." 
            className="pl-12 h-14 border-muted bg-transparent font-body focus-visible:ring-0 focus-visible:border-ink transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={styleFilter} onValueChange={(value) => setStyleFilter(value as FormStyle | 'all')}>
          <SelectTrigger className="w-full md:w-[200px] h-14 border-muted bg-transparent font-body focus:ring-0">
            <SelectValue placeholder="Protocol" />
          </SelectTrigger>
          <SelectContent className="border-muted">
            <SelectItem value="all">All Protocols</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="neo_brutalism">Neo Brutalism</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-8 border border-muted border-dashed">
          <Loader2 className="w-8 h-8 animate-spin opacity-20" />
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Synchronizing Archive</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="py-32 text-center border border-muted border-dashed space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-heading tracking-tight italic opacity-60">
              {searchQuery ? 'No matches found' : 'The archive is empty'}
            </h2>
            <p className="text-sm opacity-40 max-w-sm mx-auto leading-relaxed">
              {searchQuery 
                ? "Try adjusting your search parameters" 
                : "Forms are not containers. They are dialogues waiting to happen. Begin your first narrative."}
            </p>
          </div>
          {!searchQuery && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/forms/new">
                Initialize First Form
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y border border-muted">
          {filteredForms.map((form, index) => (
            <motion.div
              key={form.$id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <Link 
                href={`/dashboard/forms/${form.$id}`} 
                className="block p-8 space-y-8 hover:bg-muted/5 transition-all min-h-[280px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="text-[10px] opacity-20 font-mono tracking-tighter">
                    [ {index.toString().padStart(2, '0')} ]
                  </span>
                  <h3 className="text-2xl font-heading tracking-tight leading-tight group-hover:italic transition-all">
                    {form.title}
                  </h3>
                  <p className="text-sm opacity-50 line-clamp-2 leading-relaxed">
                    {form.description || 'Formal inquiry node without meta-description.'}
                  </p>
                </div>

                <div className="flex items-end justify-between uppercase text-[9px] tracking-[0.2em] font-medium">
                  <div className="space-y-1">
                    <div className="opacity-40">Protocol</div>
                    <div>{form.style}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="opacity-40">Established</div>
                    <div>{form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-GB') : 'N/A'}</div>
                  </div>
                </div>
              </Link>

              {/* Actions Dropdown */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 border-muted">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/forms/${form.$id}`} className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/f/${form.slug || form.$id}`} target="_blank" className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/responses?formId=${form.$id}`} className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Responses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => form.$id && copyToClipboard(form.slug || form.$id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => form.$id && handleDelete(form.$id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
