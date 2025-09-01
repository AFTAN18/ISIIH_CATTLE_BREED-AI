import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  MapPin,
  Users,
  Target,
  Camera,
  Star,
  Award,
  TrendingUp,
  Droplets,
  Scale,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreedInfo {
  id: string;
  name: string;
  type: 'cattle' | 'buffalo';
  origin: string;
  region: string;
  characteristics: string[];
  physicalFeatures: {
    color: string;
    size: string;
    horns: string;
    hump: string;
    ears: string;
    tail: string;
  };
  performance: {
    milkYield: string;
    weight: string;
    age: string;
    temperament: string;
  };
  bestPractices: string[];
  commonMistakes: string[];
  identificationTips: string[];
  imageUrl: string;
}

const BreedGuide: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'cattle' | 'buffalo'>('all');
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  const breeds: BreedInfo[] = [
    {
      id: 'gir',
      name: 'Gir',
      type: 'cattle',
      origin: 'Gujarat, India',
      region: 'Western India',
      characteristics: [
        'Large distinctive hump',
        'Drooping pendulous ears',
        'Reddish coat color',
        'Large body size',
        'Docile temperament'
      ],
      physicalFeatures: {
        color: 'Reddish brown to red',
        size: 'Large (400-500 kg)',
        horns: 'Curved and medium length',
        hump: 'Large and prominent',
        ears: 'Long and drooping',
        tail: 'Long with white switch'
      },
      performance: {
        milkYield: '12-18 L/day',
        weight: '400-500 kg',
        age: '15-20 years',
        temperament: 'Docile and gentle'
      },
      bestPractices: [
        'Capture side view to show hump clearly',
        'Ensure good lighting on the body',
        'Keep animal at 3-5 meters distance',
        'Avoid shadows on the hump'
      ],
      commonMistakes: [
        'Shooting from too close distance',
        'Poor lighting hiding hump features',
        'Backlighting making identification difficult',
        'Not capturing full body view'
      ],
      identificationTips: [
        'Look for the large, prominent hump',
        'Check for long, drooping ears',
        'Observe reddish coat color',
        'Note the large body size'
      ],
      imageUrl: '/images/breeds/gir.svg'
    },
    {
      id: 'sahiwal',
      name: 'Sahiwal',
      type: 'cattle',
      origin: 'Punjab, India',
      region: 'Northern India',
      characteristics: [
        'Reddish brown color',
        'Medium body size',
        'Good dairy breed',
        'Heat tolerant',
        'Docile nature'
      ],
      physicalFeatures: {
        color: 'Reddish brown',
        size: 'Medium (350-450 kg)',
        horns: 'Short and curved',
        hump: 'Small or absent',
        ears: 'Medium size, erect',
        tail: 'Medium length'
      },
      performance: {
        milkYield: '15-20 L/day',
        weight: '350-450 kg',
        age: '12-15 years',
        temperament: 'Docile and friendly'
      },
      bestPractices: [
        'Clear background for better contrast',
        'Even lighting across the body',
        'Side view position',
        'Capture full body in frame'
      ],
      commonMistakes: [
        'Cluttered background',
        'Harsh shadows',
        'Shooting from above',
        'Incomplete body capture'
      ],
      identificationTips: [
        'Look for reddish brown color',
        'Check medium body size',
        'Observe small or absent hump',
        'Note docile temperament'
      ],
      imageUrl: '/images/breeds/sahiwal.svg'
    },
    {
      id: 'murrah',
      name: 'Murrah',
      type: 'buffalo',
      origin: 'Haryana, India',
      region: 'Northern India',
      characteristics: [
        'Black color',
        'Curved horns',
        'Large size',
        'High milk yield',
        'Strong build'
      ],
      physicalFeatures: {
        color: 'Black',
        size: 'Large (500-600 kg)',
        horns: 'Curved and long',
        hump: 'Absent',
        ears: 'Medium size',
        tail: 'Long with white switch'
      },
      performance: {
        milkYield: '18-25 L/day',
        weight: '500-600 kg',
        age: '18-22 years',
        temperament: 'Calm and gentle'
      },
      bestPractices: [
        'Good lighting on black body',
        'Side view for horn visibility',
        'Contrasting background',
        'Full body capture'
      ],
      commonMistakes: [
        'Dark shadows on black body',
        'Hiding horns in photo',
        'Dark backgrounds',
        'Poor lighting'
      ],
      identificationTips: [
        'Look for black color',
        'Check curved horns',
        'Observe large size',
        'Note strong build'
      ],
      imageUrl: '/images/breeds/murrah.svg'
    }
  ];

  const filteredBreeds = breeds.filter(breed => {
    const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         breed.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         breed.characteristics.some(char => char.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || breed.type === selectedType;
    return matchesSearch && matchesType;
  });

  const selectedBreedData = selectedBreed ? breeds.find(b => b.id === selectedBreed) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Target className="w-6 h-6 mr-2 text-green-600" />
                {t('breedGuide.title')}
              </h1>
              <p className="text-sm text-gray-600">{t('breedGuide.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('breedGuide.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('all')}
                >
                  {t('breedGuide.allBreeds')}
                </Button>
                <Button
                  variant={selectedType === 'cattle' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('cattle')}
                >
                  {t('breedGuide.cattle')}
                </Button>
                <Button
                  variant={selectedType === 'buffalo' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('buffalo')}
                >
                  {t('breedGuide.buffalo')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Breed List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {t('breedGuide.availableBreeds')} ({filteredBreeds.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredBreeds.map((breed) => (
                      <motion.div
                        key={breed.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          variant={selectedBreed === breed.id ? 'default' : 'ghost'}
                          className={`w-full justify-start h-auto p-3 ${
                            selectedBreed === breed.id ? 'bg-green-100 text-green-900' : ''
                          }`}
                          onClick={() => setSelectedBreed(breed.id)}
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Target className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{breed.name}</p>
                            <p className="text-sm text-muted-foreground">{breed.origin}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {breed.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {breed.region}
                              </Badge>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breed Details */}
          <div className="lg:col-span-2">
            {selectedBreedData ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBreedData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl flex items-center">
                            <Target className="w-6 h-6 mr-2 text-green-600" />
                            {selectedBreedData.name}
                          </CardTitle>
                          <p className="text-muted-foreground mt-1">
                            {selectedBreedData.origin} • {selectedBreedData.region}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{selectedBreedData.type}</Badge>
                          <Badge variant="secondary">{selectedBreedData.region}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">{t('breedGuide.overview')}</TabsTrigger>
                          <TabsTrigger value="physical">{t('breedGuide.physical')}</TabsTrigger>
                          <TabsTrigger value="performance">{t('breedGuide.performance')}</TabsTrigger>
                          <TabsTrigger value="identification">{t('breedGuide.identification')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">{t('breedGuide.characteristics')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {selectedBreedData.characteristics.map((char, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-green-500" />
                                  <span className="text-sm">{char}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="physical" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selectedBreedData.physicalFeatures).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium capitalize">{key}:</span>
                                <span className="text-sm text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="performance" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selectedBreedData.performance).map(([key, value]) => (
                              <div key={key} className="flex items-center space-x-2">
                                {key === 'milkYield' && <Droplets className="w-4 h-4 text-blue-500" />}
                                {key === 'weight' && <Scale className="w-4 h-4 text-green-500" />}
                                {key === 'age' && <TrendingUp className="w-4 h-4 text-orange-500" />}
                                {key === 'temperament' && <Heart className="w-4 h-4 text-red-500" />}
                                <span className="text-sm font-medium capitalize">{key}:</span>
                                <span className="text-sm text-muted-foreground">{value}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="identification" className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center">
                              <Camera className="w-5 h-5 mr-2 text-blue-600" />
                              {t('breedGuide.bestPractices')}
                            </h3>
                            <div className="space-y-2">
                              {selectedBreedData.bestPractices.map((practice, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <Award className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{practice}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3 flex items-center">
                              <Target className="w-5 h-5 mr-2 text-orange-600" />
                              {t('breedGuide.identificationTips')}
                            </h3>
                            <div className="space-y-2">
                              {selectedBreedData.identificationTips.map((tip, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm">{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3 flex items-center">
                              <Target className="w-5 h-5 mr-2 text-red-600" />
                              {t('breedGuide.commonMistakes')}
                            </h3>
                            <div className="space-y-2">
                              {selectedBreedData.commonMistakes.map((mistake, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">⚠</div>
                                  <span className="text-sm">{mistake}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('breedGuide.selectBreed')}
                  </h3>
                  <p className="text-gray-600">
                    {t('breedGuide.selectBreedDesc')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedGuide;
