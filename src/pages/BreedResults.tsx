import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  X, 
  HelpCircle, 
  MapPin, 
  Weight, 
  Milk,
  ArrowRight,
  Star,
  Eye,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';
import { useIdentifyBreed, IdentificationResult } from '@/services/api';

const BreedResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedBreed, setSelectedBreed] = useState(0);
  const [results, setResults] = useState<IdentificationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const identifyBreedMutation = useIdentifyBreed();

  // Process image if provided
  useEffect(() => {
    const processImage = async () => {
      if (location.state?.imageData && !results.length) {
        setIsProcessing(true);
        
        try {
          // Simulate processing delay for better UX
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For now, use mock data since API might not be available
          // In production, uncomment the API call below
          /*
          const response = await fetch(location.state.imageData);
          const blob = await response.blob();
          const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });

          const result = await identifyBreedMutation.mutateAsync({
            imageFile: file,
            options: { topK: 3, confidenceThreshold: 0.7 }
          });

          if (result.success && result.data.results) {
            setResults(result.data.results);
          }
          */
          
          // Mock data for demonstration
          setResults([
            {
              id: '1',
              breed: 'Gir',
              confidence: 94.5,
              species: 'Cattle',
              origin: 'Gujarat, India',
              avgWeight: '400-500 kg',
              milkYield: '12-18 L/day',
              features: ['Distinctive hump', 'Pendulous ears', 'Docile nature'],
              characteristics: ['Disease resistant', 'Tropical climate adapted', 'Good draught animal'],
              description: 'Indigenous Indian breed known for disease resistance and adaptability to tropical climate.'
            },
            {
              id: '2',
              breed: 'Sahiwal',
              confidence: 87.2,
              species: 'Cattle',
              origin: 'Punjab, India',
              avgWeight: '350-450 kg',
              milkYield: '15-20 L/day',
              features: ['Reddish brown', 'Medium size', 'Short horns'],
              characteristics: ['Heat tolerant', 'High milk production', 'Good temperament'],
              description: 'Heat-tolerant dairy breed known for high milk production and good temperament.'
            },
            {
              id: '3',
              breed: 'Murrah',
              confidence: 76.8,
              species: 'Buffalo',
              origin: 'Haryana, India',
              avgWeight: '450-550 kg',
              milkYield: '15-20 L/day',
              features: ['Black color', 'Short horns', 'High milk yield'],
              characteristics: ['High milk production', 'Good temperament', 'Commercial breed'],
              description: 'High-yielding buffalo breed known for excellent milk quality and commercial value.'
            }
          ]);
          
          toast({
            title: t('identification.success'),
            description: t('identification.processingComplete'),
          });
          
        } catch (error) {
          console.error('Breed identification failed:', error);
          toast({
            title: t('identification.error'),
            description: t('identification.processingFailed'),
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      } else if (!location.state?.imageData) {
        // No image data provided, redirect back to camera
        navigate('/camera');
      }
    };

    processImage();
  }, [location.state?.imageData, results.length, toast, t, navigate]);

  const currentResult = results[selectedBreed];

  const handleConfirm = () => {
    toast({
      title: "Breed confirmed!",
      description: `${currentResult.breed} has been selected.`,
    });
    navigate('/animal-profile', { 
      state: { 
        breed: currentResult,
        imageData: location.state?.imageData 
      } 
    });
  };

  const handleReject = () => {
    toast({
      title: "Let's try again",
      description: "Taking you back to camera.",
    });
    navigate('/camera');
  };

  const handleExpertReview = () => {
    toast({
      title: "Expert review requested",
      description: "Your request has been submitted for expert verification.",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 75) return 'text-accent';
    return 'text-warning';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return 'default';
    if (confidence >= 75) return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="flex items-center justify-between p-3 sm:p-4 bg-card shadow-soft">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="touch-target">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-semibold truncate mx-2">{t('identification.title')}</h1>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSelector variant="dropdown" className="text-foreground" />
          <Button variant="ghost" size="sm" onClick={handleExpertReview} className="touch-target">
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Image Preview */}
        {location.state?.imageData && (
          <Card className="shadow-soft">
            <CardContent className="p-3 sm:p-4">
              <div className="aspect-video sm:aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img 
                  src={location.state.imageData} 
                  alt={t('identification.capturedImage')}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', location.state?.imageData);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t('identification.capturedImage')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Match */}
        <Card className="shadow-medium bg-gradient-secondary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{t('identification.bestMatch')}</CardTitle>
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t('identification.processing')}</span>
                </div>
              ) : currentResult ? (
                <Badge variant={getConfidenceBadge(currentResult.confidence)} className="text-lg px-3 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  {currentResult.confidence}%
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">{t('identification.analyzing')}</p>
                </div>
              </div>
            ) : currentResult ? (
              <>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{currentResult.breed}</h3>
                  <p className="text-muted-foreground">{currentResult.species} • {currentResult.origin}</p>
                </div>
                
                <Progress value={currentResult.confidence} className="h-3" />
                
                <p className="text-sm leading-relaxed">{currentResult.description}</p>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('identification.noResults')}</p>
              </div>
            )}

            {/* Key Characteristics */}
            {currentResult && !isProcessing && (
              <>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{t('identification.origin')}</p>
                      <p className="text-sm text-muted-foreground">{currentResult.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                    <Weight className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">{t('identification.averageWeight')}</p>
                      <p className="text-sm text-muted-foreground">{currentResult.avgWeight}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                    <Milk className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">{t('identification.milkYield')}</p>
                      <p className="text-sm text-muted-foreground">{currentResult.milkYield}</p>
                    </div>
                  </div>
                </div>

                {/* Identifying Features */}
                <div>
                  <h4 className="font-semibold mb-2">{t('identification.keyFeatures')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Alternative Matches */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('identification.alternativeMatches')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.slice(1).map((result, index) => (
              <div 
                key={result.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedBreed === index + 1 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => setSelectedBreed(index + 1)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold">{result.breed}</h5>
                    <p className="text-sm text-muted-foreground">{result.origin}</p>
                  </div>
                  <Badge variant={getConfidenceBadge(result.confidence)}>
                    {result.confidence}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {currentResult && !isProcessing && (
          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-primary hover:bg-primary-hover touch-target"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="truncate">{t('identification.confirm')}: {currentResult.breed}</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                className="h-10 sm:h-12 touch-target text-sm sm:text-base"
              >
                <X className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('identification.notCorrect')}</span>
                <span className="sm:hidden">Wrong</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handleExpertReview}
                className="h-10 sm:h-12 touch-target text-sm sm:text-base"
              >
                <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t('identification.expertReview')}</span>
                <span className="sm:hidden">Expert</span>
              </Button>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <Card className="shadow-soft bg-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium">{t('identification.nextStep')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('identification.createProfile')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom safe area */}
      <div className="h-6"></div>
    </div>
  );
};

export default BreedResults;