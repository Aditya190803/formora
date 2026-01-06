/**
 * Form Analytics Dashboard Component
 * Displays form analytics and insights
 */

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FormAnalytics } from '@/lib/types-extended';
import { Eye, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface FormAnalyticsDashboardProps {
  formId: string;
  analytics: FormAnalytics;
}

export function FormAnalyticsDashboard({ analytics }: FormAnalyticsDashboardProps) {
  const stats = [
    {
      label: 'Total Views',
      value: analytics.totalViews,
      icon: Eye,
      color: 'text-blue-500',
    },
    {
      label: 'Submissions',
      value: analytics.totalSubmissions,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      label: 'Avg. Time',
      value: `${Math.floor(analytics.averageTimeToComplete / 60)}m`,
      icon: Clock,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Completion Funnel</CardTitle>
              <CardDescription>Drop-off tracking by question</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.questionsAnalytics.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.questionsAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="questionTitle" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalAnswers" fill="#3b82f6" />
                    <Bar dataKey="dropOffCount" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  No data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Responses by device type</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.deviceBreakdown ? (
                <div className="space-y-4">
                  {[
                    { label: 'Desktop', value: analytics.deviceBreakdown.desktop },
                    { label: 'Mobile', value: analytics.deviceBreakdown.mobile },
                    { label: 'Tablet', value: analytics.deviceBreakdown.tablet },
                  ].map(device => {
                    const total = analytics.deviceBreakdown!.desktop + analytics.deviceBreakdown!.mobile + analytics.deviceBreakdown!.tablet;
                    const percentage = total > 0 ? ((device.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={device.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{device.label}</span>
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No device data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Drop-off Alert */}
      {analytics.dropOffRate > 50 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 dark:text-orange-100">High Drop-off Rate</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
              {analytics.dropOffRate}% of users abandon the form. Consider simplifying your questions or improving the UX.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
