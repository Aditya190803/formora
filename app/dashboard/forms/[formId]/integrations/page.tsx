/**
 * Form Integrations Page
 * /dashboard/forms/[formId]/integrations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
}

interface EmailNotification {
  id: string;
  recipientEmail: string;
  isActive: boolean;
}

interface SlackIntegration {
  id: string;
  webhookUrl: string;
  channel: string;
  isActive: boolean;
}

export default function FormIntegrationsPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
  const [slackIntegrations, setSlackIntegrations] = useState<SlackIntegration[]>([]);
  const [loading, setLoading] = useState(false);

  // Webhook form
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents] = useState<string[]>(['form_response_submitted']);

  // Email form
  const [email, setEmail] = useState('');

  // Slack form
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [slackChannel, setSlackChannel] = useState('');

  const fetchIntegrations = useCallback(async () => {
    try {
      // Fetch webhooks
      const webhooksRes = await fetch(`/api/forms/${formId}/webhooks`);
      if (webhooksRes.ok) {
        const data = await webhooksRes.json();
        setWebhooks(data.webhooks);
      }

      // Fetch email notifications
      const emailRes = await fetch(`/api/forms/${formId}/integrations/email`);
      if (emailRes.ok) {
        const data = await emailRes.json();
        setEmailNotifications(data.notifications);
      }

      // Fetch Slack integrations
      const slackRes = await fetch(`/api/forms/${formId}/integrations/slack`);
      if (slackRes.ok) {
        const data = await slackRes.json();
        setSlackIntegrations(data.integrations);
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    }
  }, [formId]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleAddWebhook = async () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/webhooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          events: webhookEvents,
        }),
      });

      if (response.ok) {
        toast.success('Webhook created successfully');
        setWebhookUrl('');
        fetchIntegrations();
      } else {
        toast.error('Failed to create webhook');
      }
    } catch (error) {
      toast.error('Error creating webhook');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/webhooks/${webhookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Webhook deleted successfully');
        fetchIntegrations();
      } else {
        toast.error('Failed to delete webhook');
      }
    } catch (error) {
      toast.error('Error deleting webhook');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/integrations/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          notifyOnSubmit: true,
        }),
      });

      if (response.ok) {
        toast.success('Email notification created successfully');
        setEmail('');
        fetchIntegrations();
      } else {
        toast.error('Failed to create email notification');
      }
    } catch (error) {
      toast.error('Error creating email notification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async (notificationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/integrations/email/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Email notification removed');
        fetchIntegrations();
      } else {
        toast.error('Failed to remove email notification');
      }
    } catch (error) {
      toast.error('Error removing email notification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlack = async () => {
    if (!slackWebhookUrl || !slackChannel) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/integrations/slack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: slackWebhookUrl,
          channel: slackChannel,
        }),
      });

      if (response.ok) {
        toast.success('Slack integration created successfully');
        setSlackWebhookUrl('');
        setSlackChannel('');
        fetchIntegrations();
      } else {
        toast.error('Failed to create Slack integration');
      }
    } catch (error) {
      toast.error('Error creating Slack integration');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlack = async (slackId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forms/${formId}/integrations/slack/${slackId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Slack integration disconnected');
        fetchIntegrations();
      } else {
        toast.error('Failed to disconnect Slack integration');
      }
    } catch (error) {
      toast.error('Error disconnecting Slack integration');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 font-body space-y-16">
      <div className="space-y-4 pb-12 border-b border-muted">
        <h1 className="text-6xl font-heading tracking-tighter italic">Protocols</h1>
        <div className="flex items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">
            Node Integrations: {formId} 
          </p>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>

      <Tabs defaultValue="webhooks" className="border-none bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <nav className="flex flex-col gap-4 sticky top-12">
              <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 ml-2">Channels</h2>
              <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 items-start space-y-2">
                <TabsTrigger 
                  value="webhooks" 
                  className="w-full justify-start px-4 py-3 rounded-none border border-transparent data-[state=active]:border-muted data-[state=active]:bg-muted/30 transition-all text-xs uppercase tracking-widest"
                >
                  Webhooks
                </TabsTrigger>
                <TabsTrigger 
                  value="email" 
                  className="w-full justify-start px-4 py-3 rounded-none border border-transparent data-[state=active]:border-muted data-[state=active]:bg-muted/30 transition-all text-xs uppercase tracking-widest"
                >
                  Email
                </TabsTrigger>
                <TabsTrigger 
                  value="slack" 
                  className="w-full justify-start px-4 py-3 rounded-none border border-transparent data-[state=active]:border-muted data-[state=active]:bg-muted/30 transition-all text-xs uppercase tracking-widest"
                >
                  Slack
                </TabsTrigger>
              </TabsList>
            </nav>
          </div>

          <div className="md:col-span-8">
            <TabsContent value="webhooks" className="mt-0 outline-none">
              <div className="border border-muted divide-y divide-muted">
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-heading italic">Webhooks</h3>
                  <p className="text-sm opacity-60">Push response payloads to external endpoints in real-time.</p>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Endpoint URL</Label>
                    <Input
                      placeholder="https://api.yourdomain.com/webhook"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddWebhook} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Deploy Webhook"}
                  </Button>
                </div>

                {webhooks.length > 0 && (
                  <div className="divide-y divide-muted">
                    {webhooks.map((webhook) => (
                      <div key={webhook.id} className="p-6 flex items-center justify-between group hover:bg-muted/10 transition-colors">
                        <div className="overflow-hidden">
                          <p className="text-xs font-mono truncate max-w-[300px]">{webhook.url}</p>
                          <p className="text-[9px] uppercase tracking-tighter opacity-40 mt-1">Status: {webhook.isActive ? 'Active' : 'Standby'}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-0 outline-none">
              <div className="border border-muted divide-y divide-muted">
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-heading italic">Notifications</h3>
                  <p className="text-sm opacity-60">Direct signal transmission to your inbox.</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Recipient Identity</Label>
                    <Input
                      type="email"
                      placeholder="operator@system.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddEmail} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Link Email"}
                  </Button>
                </div>

                {emailNotifications.length > 0 && (
                  <div className="divide-y divide-muted">
                    {emailNotifications.map((noti) => (
                      <div key={noti.id} className="p-6 flex items-center justify-between group hover:bg-muted/10 transition-colors">
                        <p className="text-sm">{noti.recipientEmail}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmail(noti.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Unlink
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="slack" className="mt-0 outline-none">
              <div className="border border-muted divide-y divide-muted">
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-heading italic">Slack</h3>
                  <p className="text-sm opacity-60">Broadcast events to your team workspace.</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhookUrl}
                      onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Target Channel</Label>
                    <Input
                      placeholder="#narrative-feed"
                      value={slackChannel}
                      onChange={(e) => setSlackChannel(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddSlack} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Establish Connection"}
                  </Button>
                </div>

                {slackIntegrations.length > 0 && (
                  <div className="divide-y divide-muted">
                    {slackIntegrations.map((slack) => (
                      <div key={slack.id} className="p-6 flex items-center justify-between group hover:bg-muted/10 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{slack.channel}</p>
                          <p className="text-[10px] uppercase opacity-40 mt-1">Live Feed</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlack(slack.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
