import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Camera, 
  Target, 
  Award, 
  Play, 
  Download, 
  MapPin, 
  Users,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from '@/components/LanguageSelector';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  progress: number;
  icon: React.ReactNode;
}

interface BreedGuide {
  id: string;
  name: string;
  type: 'cattle' | 'buffalo';
  region: string;
  characteristics: string[];
  bestPractices: string[];
  commonMistakes: string[];
  imageUrl: string;
}

const LearningCenter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tutorials');
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    totalTutorials: 15,
    completedTutorials: 3,
    totalQuizzes: 8,
    completedQuizzes: 2,
    achievements: 5
  });

  const tutorials: Tutorial[] = [
    {
      id: 'camera-basics',
      title: t('learning.cameraBasics.title'),
      description: t('learning.cameraBasics.description'),
      duration: '10 min',
      difficulty: 'beginner',
      completed: true,
      progress: 100,
      icon: <Camera className="w-6 h-6" />
    },
    {
      id: 'breed-identification',
      title: t('learning.breedIdentification.title'),
      description: t('learning.breedIdentification.description'),
      duration: '15 min',
      difficulty: 'beginner',
      completed: true,
      progress: 100,
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'photo-quality',
      title: t('learning.photoQuality.title'),
      description: t('learning.photoQuality.description'),
      duration: '12 min',
      difficulty: 'intermediate',
      completed: false,
      progress: 60,
      icon: <Camera className="w-6 h-6" />
    },
    {
      id: 'lighting-techniques',
      title: 'Optimal Lighting for Cattle Photography',
      description: 'Learn how to use natural and artificial lighting for clear breed identification photos',
      duration: '8 min',
      difficulty: 'beginner',
      completed: false,
      progress: 0,
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      id: 'animal-handling',
      title: 'Safe Animal Handling Techniques',
      description: 'Best practices for safely positioning animals for photography without stress',
      duration: '18 min',
      difficulty: 'intermediate',
      completed: false,
      progress: 25,
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'breed-characteristics',
      title: 'Key Breed Characteristics Guide',
      description: 'Comprehensive guide to identifying distinguishing features of Indian cattle breeds',
      duration: '25 min',
      difficulty: 'intermediate',
      completed: false,
      progress: 40,
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 'regional-variations',
      title: 'Regional Breed Variations',
      description: 'Understanding how environmental factors affect breed characteristics across regions',
      duration: '20 min',
      difficulty: 'advanced',
      completed: false,
      progress: 0,
      icon: <MapPin className="w-6 h-6" />
    },
    {
      id: 'advanced-features',
      title: t('learning.advancedFeatures.title'),
      description: t('learning.advancedFeatures.description'),
      duration: '20 min',
      difficulty: 'advanced',
      completed: false,
      progress: 0,
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 'data-accuracy',
      title: 'Ensuring Data Accuracy & Quality',
      description: 'Methods to validate identification results and maintain high accuracy standards',
      duration: '15 min',
      difficulty: 'advanced',
      completed: false,
      progress: 0,
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  const breedGuides: BreedGuide[] = [
    {
      id: 'gir',
      name: 'Gir',
      type: 'cattle',
      region: 'Gujarat',
      characteristics: [
        'Prominent forehead hump',
        'Long pendulous ears',
        'White to light red coat color',
        'Medium to large size (400-500kg)'
      ],
      bestPractices: [
        'Capture side profile to show hump clearly',
        'Use natural lighting to highlight coat patterns',
        'Maintain 3-4 meter distance for full body shots'
      ],
      commonMistakes: [
        'Photographing in harsh shadows',
        'Too close angle missing body proportions',
        'Poor lighting obscuring coat color'
      ],
      imageUrl: '/images/breeds/gir.svg'
    },
    {
      id: 'sahiwal',
      name: 'Sahiwal',
      type: 'cattle',
      region: 'Punjab',
      characteristics: [
        'Reddish brown to light red color',
        'Medium to large size',
        'Docile temperament',
        'Heat tolerant breed'
      ],
      bestPractices: [
        'Use neutral background to highlight color',
        'Soft even lighting for accurate color capture',
        'Position animal in comfortable stance'
      ],
      commonMistakes: [
        'Busy background distracting from animal',
        'Harsh lighting altering color perception',
        'Awkward animal positioning'
      ],
      imageUrl: '/images/breeds/sahiwal.svg'
    },
    {
      id: 'murrah',
      name: 'Murrah',
      type: 'buffalo',
      region: 'Haryana',
      characteristics: [
        'Jet black coat color',
        'Curved horns pointing backward',
        'Large size (500-800kg)',
        'High milk yield capacity'
      ],
      bestPractices: [
        'Use adequate lighting for dark coat',
        'Capture horn shape and curvature',
        'Show body size and proportions'
      ],
      commonMistakes: [
        'Insufficient lighting for black coat',
        'Missing horn details in photos',
        'Poor angle hiding body structure'
      ],
      imageUrl: '/images/breeds/murrah.svg'
    },
    {
      id: 'holstein',
      name: 'Holstein Friesian',
      type: 'cattle',
      region: 'Imported/Crossbred',
      characteristics: [
        'Black and white patches',
        'Large body size',
        'High milk production',
        'Distinctive color pattern'
      ],
      bestPractices: [
        'Capture clear patch patterns',
        'Use good contrast lighting',
        'Show full body proportions'
      ],
      commonMistakes: [
        'Poor contrast hiding patterns',
        'Incomplete body coverage',
        'Overexposed white patches'
      ],
      imageUrl: '/images/breeds/holstein.svg'
    },
    {
      id: 'red-sindhi',
      name: 'Red Sindhi',
      type: 'cattle',
      region: 'Sindh/Rajasthan',
      characteristics: [
        'Deep red coat color',
        'Compact body structure',
        'Heat resistant',
        'Good milk quality'
      ],
      bestPractices: [
        'Capture true red color tone',
        'Show compact body structure',
        'Use natural lighting'
      ],
      commonMistakes: [
        'Color distortion in photos',
        'Missing body proportion details',
        'Artificial lighting effects'
      ],
      imageUrl: '/images/breeds/red-sindhi.svg'
    },
    {
      id: 'nili-ravi',
      name: 'Nili Ravi',
      type: 'buffalo',
      region: 'Punjab/Pakistan',
      characteristics: [
        'Dark coat with white markings',
        'Large curved horns',
        'Wall eyes (blue eyes)',
        'High milk production'
      ],
      bestPractices: [
        'Capture eye color clearly',
        'Show white markings pattern',
        'Highlight horn structure'
      ],
      commonMistakes: [
        'Missing eye color details',
        'Poor marking visibility',
        'Unclear horn photography'
      ],
      imageUrl: '/images/breeds/nili-ravi.svg'
    }
  ];

  const achievements = [
    { id: 'first-identification', title: t('learning.achievements.firstId'), icon: <Target className="w-4 h-4" />, earned: true },
    { id: 'camera-master', title: t('learning.achievements.cameraMaster'), icon: <Camera className="w-4 h-4" />, earned: true },
    { id: 'breed-expert', title: t('learning.achievements.breedExpert'), icon: <Award className="w-4 h-4" />, earned: false },
    { id: 'quiz-champion', title: t('learning.achievements.quizChampion'), icon: <Star className="w-4 h-4" />, earned: false }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return t('learning.difficulty.beginner');
      case 'intermediate': return t('learning.difficulty.intermediate');
      case 'advanced': return t('learning.difficulty.advanced');
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                {t('common.back')}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-green-600" />
                  {t('learning.title')}
                </h1>
                <p className="text-sm text-gray-600">{t('learning.subtitle')}</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {t('learning.progress.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress.completedTutorials}/{userProgress.totalTutorials}</div>
                <div className="text-sm text-gray-600">{t('learning.progress.tutorials')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProgress.completedQuizzes}/{userProgress.totalQuizzes}</div>
                <div className="text-sm text-gray-600">{t('learning.progress.quizzes')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userProgress.achievements}</div>
                <div className="text-sm text-gray-600">{t('learning.progress.achievements')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((userProgress.completedTutorials / userProgress.totalTutorials) * 100)}%
                </div>
                <div className="text-sm text-gray-600">{t('learning.progress.completion')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tutorials">{t('learning.tabs.tutorials')}</TabsTrigger>
            <TabsTrigger value="breeds">{t('learning.tabs.breeds')}</TabsTrigger>
            <TabsTrigger value="quizzes">{t('learning.tabs.quizzes')}</TabsTrigger>
            <TabsTrigger value="achievements">{t('learning.tabs.achievements')}</TabsTrigger>
          </TabsList>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-4">
            <div className="grid gap-4">
              {tutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTutorial === tutorial.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedTutorial(tutorial.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            tutorial.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tutorial.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                              {tutorial.completed && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {tutorial.duration}
                              </span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getDifficultyColor(tutorial.difficulty)} text-white`}
                              >
                                {getDifficultyText(tutorial.difficulty)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {tutorial.progress}%
                          </div>
                          <Progress value={tutorial.progress} className="w-20 h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Breeds Tab */}
          <TabsContent value="breeds" className="space-y-4">
            <div className="grid gap-4">
              {breedGuides.map((breed) => (
                <motion.div
                  key={breed.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBreed === breed.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedBreed(breed.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Target className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{breed.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {breed.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {breed.region}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {breed.characteristics.slice(0, 2).join(', ')}...
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {breed.region}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {breed.characteristics.length} {t('learning.breeds.characteristics')}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          {t('learning.breeds.learn')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {t('learning.quizzes.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('learning.quizzes.comingSoon')}
                  </h3>
                  <p className="text-gray-600">
                    {t('learning.quizzes.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`transition-all ${
                    achievement.earned ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gray-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          achievement.earned ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.earned ? 'text-green-900' : 'text-gray-600'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-green-700' : 'text-gray-500'
                          }`}>
                            {achievement.earned ? t('learning.achievements.earned') : t('learning.achievements.locked')}
                          </p>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate('/camera')}
          >
            <Camera className="w-6 h-6" />
            <span>{t('learning.quickActions.practice')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Download className="w-6 h-6" />
            <span>{t('learning.quickActions.download')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Lightbulb className="w-6 h-6" />
            <span>{t('learning.quickActions.tips')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
