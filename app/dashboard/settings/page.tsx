'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
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

  // Load notification preferences
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
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-lg font-bold uppercase">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 border-4 border-foreground font-black uppercase italic transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                activeSection === section.id ? "bg-primary text-white" : "bg-card"
              )}
            >
              <section.icon className="w-5 h-5 stroke-[3]" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-12">
          {activeSection === 'profile' && (
            <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-foreground rounded-none blur-sm opacity-25 group-hover:opacity-50 transition duration-300" />
                  <Avatar className="h-32 w-32 rounded-none border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="text-4xl font-black bg-primary text-white">
                      {user?.displayName?.[0] || user?.primaryEmail?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase italic">Profile Info</h2>
                  <p className="text-muted-foreground font-bold uppercase">Update your personal details</p>
                  <Button variant="outline" className="h-10 border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-xs">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest ml-1">Display Name</Label>
                  <Input 
                    id="name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="YOUR NAME"
                    className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest ml-1">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={user?.primaryEmail || ''} 
                    disabled
                    className="h-14 border-4 border-foreground bg-muted/10 text-lg font-black uppercase italic opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">
                    Email cannot be changed here
                  </p>
                </div>
              </div>

              <Button size="lg" className="h-14 px-10 border-4 border-foreground bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg font-black uppercase italic" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
              <div>
                <h2 className="text-3xl font-black uppercase italic">Notifications</h2>
                <p className="text-muted-foreground font-bold uppercase">Configure your updates</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 border-4 border-foreground bg-muted/30">
                  <div className="flex-1">
                    <div className="font-black text-xl uppercase italic">Email notifications</div>
                    <div className="text-muted-foreground font-bold uppercase text-sm">
                      Receive emails when you get new responses
                    </div>
                  </div>
                  <div className="ml-4">
                    <Checkbox
                      checked={notifications.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      disabled={loadingNotifications}
                      className="w-6 h-6 border-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 border-4 border-foreground bg-muted/30">
                  <div className="flex-1">
                    <div className="font-black text-xl uppercase italic">Weekly digest</div>
                    <div className="text-muted-foreground font-bold uppercase text-sm">
                      Get a weekly summary of your form activity
                    </div>
                  </div>
                  <div className="ml-4">
                    <Checkbox
                      checked={notifications.weeklyDigest}
                      onCheckedChange={() => handleNotificationToggle('weeklyDigest')}
                      disabled={loadingNotifications}
                      className="w-6 h-6 border-2"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-lg">
                <p className="text-sm font-bold text-blue-900">
                  💡 Free notification features: Toggle email alerts and weekly digests anytime. All notifications are processed automatically at no cost.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
              <div>
                <h2 className="text-3xl font-black uppercase italic">Security</h2>
                <p className="text-muted-foreground font-bold uppercase">Manage your account security</p>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 border-4 border-foreground bg-muted/30 space-y-4">
                  <div className="font-black text-xl uppercase italic">Change Password</div>
                  <p className="text-muted-foreground font-bold uppercase text-sm">Update your password to keep your account secure</p>
                  <Button variant="outline" className="h-12 px-6 border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic">
                    Update Password
                  </Button>
                </div>
                
                <div className="p-6 border-4 border-foreground bg-red-50 space-y-4">
                  <div className="font-black text-xl uppercase italic text-red-600">Delete Account</div>
                  <p className="text-red-600/70 font-bold uppercase text-sm">Permanently delete your account and all your forms. This action cannot be undone.</p>
                  <Button variant="outline" className="h-12 px-6 border-4 border-red-600 bg-white text-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
