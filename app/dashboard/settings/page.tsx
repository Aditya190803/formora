'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Bell, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const user = useUser();
  const [activeSection, setActiveSection] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyDigest: true,
  });
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/users/${user.id}/notifications`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };
    loadNotifications();
  }, [user?.id]);

  const handleSave = async () => {
    try {
      if (user) {
        await user.update({ displayName });
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    if (!user?.id) return;
    
    setLoadingNotifications(true);
    try {
      const newNotifications = { ...notifications, [key]: !notifications[key] };
      const response = await fetch(`/api/users/${user.id}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotifications),
      });
      
      if (response.ok) {
        setNotifications(newNotifications);
        toast.success(newNotifications[key] ? `${key} enabled` : `${key} disabled`);
      } else {
        toast.error('Failed to update notification settings');
      }
    } catch (error) {
      console.error('Failed to update notifications:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setLoadingNotifications(false);
    }
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-20 font-body">
      {/* Header */}
      <div className="pb-12 border-b border-muted">
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-heading tracking-tighter leading-none italic"
          >
            Preferences
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.5em] font-medium"
          >
            System configuration and account parameters
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Nav */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:w-56 space-y-1"
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 text-left transition-all",
                activeSection === section.id 
                  ? "bg-muted/10 border-l-2 border-ink" 
                  : "opacity-40 hover:opacity-100 border-l-2 border-transparent"
              )}
            >
              <section.icon className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{section.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 max-w-2xl"
        >
          {activeSection === 'profile' && (
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pb-12 border-b border-muted">
                <Avatar className="h-24 w-24 rounded-full border border-muted">
                  <AvatarImage src={user?.profileImageUrl || undefined} />
                  <AvatarFallback className="text-2xl font-heading bg-muted">
                    {user?.displayName?.[0] || user?.primaryEmail?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-2xl font-heading tracking-tight italic">Profile Identity</h2>
                  <p className="text-sm opacity-40">Manage your public-facing information</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.3em] opacity-40">Display Name</Label>
                  <Input 
                    id="name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 border-muted bg-transparent font-body focus-visible:ring-0 focus-visible:border-ink transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] opacity-40">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={user?.primaryEmail || ''} 
                    disabled
                    className="h-14 border-muted bg-muted/5 font-body opacity-50 cursor-not-allowed"
                  />
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-30">
                    Email is managed through authentication provider
                  </p>
                </div>
              </div>

              <Button size="lg" className="h-14" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-12">
              <div className="pb-8 border-b border-muted">
                <h2 className="text-2xl font-heading tracking-tight italic">Notification Settings</h2>
                <p className="text-sm opacity-40 mt-2">Configure how you receive updates</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-6 border-b border-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm opacity-40">
                      Receive emails when you get new responses
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    disabled={loadingNotifications}
                  />
                </div>

                <div className="flex items-center justify-between py-6 border-b border-muted/50">
                  <div className="space-y-1">
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm opacity-40">
                      Get a weekly summary of your form activity
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                    disabled={loadingNotifications}
                  />
                </div>
              </div>

              <div className="p-6 border-l-2 border-muted bg-muted/5">
                <p className="text-sm opacity-60">
                  All notification features are included in your plan. Toggle settings anytime.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-12">
              <div className="pb-8 border-b border-muted">
                <h2 className="text-2xl font-heading tracking-tight italic">Security & Access</h2>
                <p className="text-sm opacity-40 mt-2">Manage your account security</p>
              </div>
              
              <div className="space-y-8">
                <div className="py-6 border-b border-muted/50 space-y-4">
                  <div className="font-medium">Password</div>
                  <p className="text-sm opacity-40">Update your password to keep your account secure</p>
                  <Button variant="outline">
                    Update Password
                  </Button>
                </div>
                
                <div className="py-6 space-y-4">
                  <div className="font-medium text-destructive">Danger Zone</div>
                  <p className="text-sm opacity-40">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
