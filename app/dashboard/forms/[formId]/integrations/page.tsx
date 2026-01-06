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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your form with external services
        </p>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="email">Email Notifications</TabsTrigger>
          <TabsTrigger value="slack">Slack</TabsTrigger>
        </TabsList>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Webhook</CardTitle>
              <CardDescription>
                Send form submissions to your webhook endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Webhook URL</Label>
                <Input
                  placeholder="https://your-domain.com/webhooks/forms"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleAddWebhook}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Webhook
              </Button>
            </CardContent>
          </Card>

          {webhooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium break-all">{webhook.url}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {webhook.events.join(', ')}
                        </p>
                      </div>
                      {webhook.isActive && (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Email Notification</CardTitle>
              <CardDescription>
                Receive email when form is submitted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleAddEmail}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Email Notification
              </Button>
            </CardContent>
          </Card>

          {emailNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Email Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <p className="font-medium">{notif.recipientEmail}</p>
                      {notif.isActive && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Slack Tab */}
        <TabsContent value="slack" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Slack Integration</CardTitle>
              <CardDescription>
                Send form submissions to Slack channel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  Create a <strong>Incoming Webhook</strong> in your Slack workspace and paste the URL below.
                </div>
              </div>

              <div>
                <Label>Slack Webhook URL</Label>
                <Input
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Channel (optional)</Label>
                <Input
                  placeholder="#form-submissions"
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleAddSlack}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Slack Integration
              </Button>
            </CardContent>
          </Card>

          {slackIntegrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Slack Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {slackIntegrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="p-4 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{integration.channel}</p>
                        <p className="text-sm text-muted-foreground mt-1 break-all">
                          {integration.webhookUrl}
                        </p>
                      </div>
                      {integration.isActive && (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
