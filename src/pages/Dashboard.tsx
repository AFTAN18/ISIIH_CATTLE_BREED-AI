import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  BarChart3, 
  Award, 
  Wifi, 
  WifiOff, 
  Calendar,
  TrendingUp,
  BookOpen,
  Plus,
  History,
  Target,
  Users,
  Activity,
  Sparkles,
  Trophy,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LanguageSelector from '@/components/LanguageSelector';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force component re-render
      window.location.reload();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats] = useState({
    todayCount: 12,
    weekCount: 67,
    monthCount: 234,
    accuracyScore: 94,
    streak: 8,
    totalAnimals: 1247,
    weeklyGoal: 300
  });

  // Chart data
  const weeklyData = [
    { day: 'Mon', registrations: 8, accuracy: 92 },
    { day: 'Tue', registrations: 12, accuracy: 95 },
    { day: 'Wed', registrations: 15, accuracy: 88 },
    { day: 'Thu', registrations: 10, accuracy: 96 },
    { day: 'Fri', registrations: 18, accuracy: 94 },
    { day: 'Sat', registrations: 14, accuracy: 91 },
    { day: 'Sun', registrations: 12, accuracy: 94 }
  ];

  const breedDistribution = [
    { name: 'Holstein', value: 35, color: '#22c55e' },
    { name: 'Gir', value: 25, color: '#f59e0b' },
    { name: 'Jersey', value: 20, color: '#3b82f6' },
    { name: 'Murrah', value: 15, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#6b7280' }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const recentRegistrations = [
    { id: 1, breed: 'Holstein Friesian', confidence: 96, time: '2 hours ago', verified: true, image: '🐄' },
    { id: 2, breed: 'Gir', confidence: 89, time: '4 hours ago', verified: false, image: '🐄' },
    { id: 3, breed: 'Murrah Buffalo', confidence: 94, time: '6 hours ago', verified: true, image: '🐃' },
    { id: 4, breed: 'Jersey', confidence: 91, time: '8 hours ago', verified: true, image: '🐄' },
  ];

  const achievements = [
    { id: 1, title: t('dashboard.achievements.firstCapture.title'), description: t('dashboard.achievements.firstCapture.description'), icon: '🎯', unlocked: true },
    { id: 2, title: t('dashboard.achievements.accuracyMaster.title'), description: t('dashboard.achievements.accuracyMaster.description'), icon: '🏆', unlocked: true },
    { id: 3, title: t('dashboard.achievements.weeklyGoal.title'), description: t('dashboard.achievements.weeklyGoal.description'), icon: '⭐', unlocked: true },
    { id: 4, title: t('dashboard.achievements.expertLevel.title'), description: t('dashboard.achievements.expertLevel.description'), icon: '👑', unlocked: false },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-earth"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="bg-gradient-primary text-primary-foreground p-4 sm:p-6 shadow-medium"
        variants={itemVariants}
      >
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <motion.h1 
                className="text-responsive-2xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t('dashboard.welcomeBack')}
              </motion.h1>
              <motion.p 
                className="text-primary-foreground/80 text-responsive-base"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('dashboard.readyToIdentify')}
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <LanguageSelector variant="dropdown" className="text-primary-foreground flex-1 sm:flex-none" />
              {isOnline ? (
                <Badge variant="secondary" className="bg-success text-success-foreground animate-bounce-gentle touch-friendly">
                  <Wifi className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{t('common.online')}</span>
                </Badge>
              ) : (
                <Badge variant="destructive" className="touch-friendly">
                  <WifiOff className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{t('common.offline')}</span>
                </Badge>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Quick Action */}
      <motion.div 
        className="p-4 sm:p-6"
        variants={itemVariants}
      >
        <div className="container-responsive">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => navigate('/camera')}
              className="btn-responsive w-full h-16 sm:h-20 text-responsive-lg font-semibold bg-gradient-primary hover:bg-primary-hover shadow-glow touch-friendly"
              size="lg"
            >
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              {t('dashboard.identifyNewBreed')}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        <div className="container-responsive">
          <motion.h2 
            className="text-responsive-xl font-semibold text-foreground flex items-center gap-2"
            variants={itemVariants}
          >
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            {t('dashboard.yourStatistics')}
          </motion.h2>
        </div>
        
        <div className="container-responsive">
          <div className="grid-responsive-2 gap-3 sm:gap-4">
          {[
            { icon: Calendar, value: stats.todayCount, label: t('dashboard.today'), color: 'text-primary' },
            { icon: TrendingUp, value: stats.weekCount, label: t('dashboard.thisWeek'), color: 'text-accent' },
            { icon: Award, value: `${stats.accuracyScore}%`, label: t('dashboard.accuracy'), color: 'text-success' },
            { icon: Target, value: stats.streak, label: t('dashboard.dayStreak'), color: 'text-warning' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card-hover"
            >
              <Card className="card-responsive shadow-soft border-0">
                <CardContent className="p-3 sm:p-4 text-center">
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} mx-auto mb-2`} />
                  <p className="text-responsive-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-responsive-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        </div>

        {/* Progress Section */}
        <div className="container-responsive">
          <motion.div variants={cardVariants}>
            <Card className="card-responsive shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-responsive-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('dashboard.monthlyProgress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-responsive-sm">
                    <span>{t('dashboard.registrations')}: {stats.monthCount}/{stats.weeklyGoal}</span>
                    <span>{Math.round((stats.monthCount / stats.weeklyGoal) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(stats.monthCount / stats.weeklyGoal) * 100} 
                    className="h-2 sm:h-3 bg-muted"
                  />
                  <p className="text-responsive-xs text-muted-foreground">
                    {t('dashboard.greatProgress', { remaining: stats.weeklyGoal - stats.monthCount })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="container-responsive">
          <motion.div variants={cardVariants}>
            <Card className="card-responsive shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-responsive-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('dashboard.weeklyPerformance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="registrations" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="container-responsive">
          <motion.div variants={cardVariants}>
            <Card className="card-responsive shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-responsive-base flex items-center gap-2">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('dashboard.recentRegistrations')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentRegistrations.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <span className="text-xl sm:text-2xl">{item.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-responsive-sm text-foreground truncate">{item.breed}</p>
                        <p className="text-responsive-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Badge variant={item.confidence >= 90 ? "default" : "secondary"} className="text-xs">
                        {item.confidence}%
                      </Badge>
                      {item.verified && (
                        <Badge variant="outline" className="text-success border-success text-xs hidden sm:flex">
                          <Star className="w-3 h-3 mr-1" />
                          {t('common.verified')}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                <Button variant="outline" className="btn-responsive w-full">
                  {t('dashboard.viewAllHistory')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <div className="container-responsive">
          <motion.div variants={cardVariants}>
            <Card className="card-responsive shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-responsive-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('dashboard.achievements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid-responsive-2 gap-2 sm:gap-3">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all touch-friendly ${
                        achievement.unlocked 
                          ? 'border-success bg-success/10' 
                          : 'border-muted bg-muted/30 opacity-50'
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-xl sm:text-2xl">{achievement.icon}</span>
                        <p className="font-medium text-responsive-xs mt-1">{achievement.title}</p>
                        <p className="text-responsive-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Learning Resources */}
        <div className="container-responsive">
          <motion.div variants={cardVariants}>
            <Card className="card-responsive shadow-soft border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-responsive-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {t('dashboard.learningResources')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="btn-responsive w-full justify-start h-auto p-3 touch-friendly"
                    onClick={() => navigate('/learning')}
                  >
                    <BookOpen className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-responsive-sm">{t('dashboard.learningCenter')}</p>
                      <p className="text-responsive-xs text-muted-foreground">{t('dashboard.learningCenterDesc')}</p>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="btn-responsive w-full justify-start h-auto p-3 touch-friendly"
                    onClick={() => navigate('/manual-identification')}
                  >
                    <Target className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-responsive-sm">{t('dashboard.manualIdentification')}</p>
                      <p className="text-responsive-xs text-muted-foreground">{t('dashboard.manualIdentificationDesc')}</p>
                    </div>
                  </Button>
                  <Button variant="ghost" className="btn-responsive w-full justify-start h-auto p-3 touch-friendly">
                    <Camera className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-responsive-sm">{t('dashboard.photoGuidelines')}</p>
                      <p className="text-responsive-xs text-muted-foreground">{t('dashboard.photoGuidelinesDesc')}</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>

      {/* Bottom padding for safe area */}
      <div className="h-20"></div>
    </motion.div>
  );
};

export default Dashboard;