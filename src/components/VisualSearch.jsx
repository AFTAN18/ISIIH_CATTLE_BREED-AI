import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Palette, 
  Crown, 
  Zap, 
  Target,
  Eye,
  MapPin,
  Scale,
  ArrowRight,
  X,
  Check,
  Info,
  Camera,
  RotateCcw
} from 'lucide-react';

const VisualSearch = ({ onBreedSelect }) => {
  const { t } = useTranslation();
  const [searchCriteria, setSearchCriteria] = useState({
    colors: [],
    sizes: [],
    horns: [],
    hump: [],
    regions: [],
    milkYield: [0, 30],
    weight: [200, 800]
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Available search options
  const searchOptions = {
    colors: [
      { id: 'black', label: t('visualSearch.black'), icon: '⚫' },
      { id: 'brown', label: t('visualSearch.brown'), icon: '🟫' },
      { id: 'red', label: t('visualSearch.red'), icon: '🔴' },
      { id: 'white', label: t('visualSearch.white'), icon: '⚪' },
      { id: 'gray', label: t('visualSearch.gray'), icon: '⚪' },
      { id: 'mixed', label: t('visualSearch.mixed'), icon: '🌈' }
    ],
    sizes: [
      { id: 'small', label: t('visualSearch.small'), description: '< 300 kg' },
      { id: 'medium', label: t('visualSearch.medium'), description: '300-500 kg' },
      { id: 'large', label: t('visualSearch.large'), description: '> 500 kg' }
    ],
    horns: [
      { id: 'long', label: t('visualSearch.longHorns'), description: t('visualSearch.longHornsDesc') },
      { id: 'short', label: t('visualSearch.shortHorns'), description: t('visualSearch.shortHornsDesc') },
      { id: 'curved', label: t('visualSearch.curvedHorns'), description: t('visualSearch.curvedHornsDesc') },
      { id: 'none', label: t('visualSearch.noHorns'), description: t('visualSearch.noHornsDesc') }
    ],
    hump: [
      { id: 'large', label: t('visualSearch.largeHump'), description: t('visualSearch.largeHumpDesc') },
      { id: 'small', label: t('visualSearch.smallHump'), description: t('visualSearch.smallHumpDesc') },
      { id: 'none', label: t('visualSearch.noHump'), description: t('visualSearch.noHumpDesc') }
    ],
    regions: [
      { id: 'north', label: t('visualSearch.northIndia'), icon: '🏔️' },
      { id: 'south', label: t('visualSearch.southIndia'), icon: '🌴' },
      { id: 'east', label: t('visualSearch.eastIndia'), icon: '🌾' },
      { id: 'west', label: t('visualSearch.westIndia'), icon: '🏜️' },
      { id: 'central', label: t('visualSearch.centralIndia'), icon: '🏞️' }
    ]
  };

  // Mock breed database for search
  const breedDatabase = [
    {
      id: 'gir',
      name: 'Gir',
      type: 'cattle',
      colors: ['brown', 'red'],
      size: 'large',
      horns: 'long',
      hump: 'large',
      region: 'west',
      milkYield: 15,
      weight: 450,
      characteristics: ['Distinctive hump', 'Pendulous ears', 'Docile nature'],
      origin: 'Gujarat, India',
      confidence: 92,
      image: '/images/breeds/gir.svg'
    },
    {
      id: 'sahiwal',
      name: 'Sahiwal',
      type: 'cattle',
      colors: ['brown', 'red'],
      size: 'medium',
      horns: 'short',
      hump: 'small',
      region: 'north',
      milkYield: 18,
      weight: 400,
      characteristics: ['Heat tolerant', 'High milk production', 'Good temperament'],
      origin: 'Punjab, India',
      confidence: 85,
      image: '/images/breeds/sahiwal.svg'
    },
    {
      id: 'murrah',
      name: 'Murrah',
      type: 'buffalo',
      colors: ['black'],
      size: 'large',
      horns: 'curved',
      hump: 'none',
      region: 'central',
      milkYield: 20,
      weight: 550,
      characteristics: ['High milk production', 'Good temperament', 'Commercial breed'],
      origin: 'Haryana, India',
      confidence: 88,
      image: '/images/breeds/murrah.svg'
    },
    {
      id: 'jersey',
      name: 'Jersey',
      type: 'cattle',
      colors: ['brown', 'gray'],
      size: 'medium',
      horns: 'short',
      hump: 'none',
      region: 'foreign',
      milkYield: 25,
      weight: 350,
      characteristics: ['High butterfat content', 'Efficient feed conversion', 'Adaptable'],
      origin: 'Jersey Island',
      confidence: 78,
      image: '/images/breeds/holstein.svg'
    }
  ];

  const handleCriteriaChange = (category, value, isChecked) => {
    setSearchCriteria(prev => ({
      ...prev,
      [category]: isChecked 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleRangeChange = (category, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const performSearch = () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = breedDatabase.filter(breed => {
        // Color matching
        if (searchCriteria.colors.length > 0 && 
            !searchCriteria.colors.some(color => breed.colors.includes(color))) {
          return false;
        }
        
        // Size matching
        if (searchCriteria.sizes.length > 0 && 
            !searchCriteria.sizes.includes(breed.size)) {
          return false;
        }
        
        // Horns matching
        if (searchCriteria.horns.length > 0 && 
            !searchCriteria.horns.includes(breed.horns)) {
          return false;
        }
        
        // Hump matching
        if (searchCriteria.hump.length > 0 && 
            !searchCriteria.hump.includes(breed.hump)) {
          return false;
        }
        
        // Region matching
        if (searchCriteria.regions.length > 0 && 
            !searchCriteria.regions.includes(breed.region)) {
          return false;
        }
        
        // Milk yield range
        if (breed.milkYield < searchCriteria.milkYield[0] || 
            breed.milkYield > searchCriteria.milkYield[1]) {
          return false;
        }
        
        // Weight range
        if (breed.weight < searchCriteria.weight[0] || 
            breed.weight > searchCriteria.weight[1]) {
          return false;
        }
        
        return true;
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const resetSearch = () => {
    setSearchCriteria({
      colors: [],
      sizes: [],
      horns: [],
      hump: [],
      regions: [],
      milkYield: [0, 30],
      weight: [200, 800]
    });
    setSearchResults([]);
  };

  const handleBreedSelect = (breed) => {
    if (onBreedSelect) {
      onBreedSelect(breed);
    }
  };

  const SearchOption = ({ category, options, selectedValues, onChange }) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        {t(`visualSearch.${category}`)}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${option.id}`}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={(checked) => onChange(category, option.id, checked)}
            />
            <label
              htmlFor={`${category}-${option.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </div>
              {option.description && (
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const RangeSlider = ({ category, label, min, max, step, value, onChange, unit }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
          {label}
        </h3>
        <span className="text-sm text-gray-600">
          {value[0]}-{value[1]} {unit}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) => onChange(category, newValue)}
        max={max}
        min={min}
        step={step}
        className="w-full"
      />
    </div>
  );

  const BreedCard = ({ breed }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{breed.name}</h3>
              <Badge className="bg-green-100 text-green-800">
                {breed.confidence}% {t('visualSearch.match')}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{breed.origin}</span>
              <Scale className="h-4 w-4" />
              <span>{breed.weight} kg</span>
              <Zap className="h-4 w-4" />
              <span>{breed.milkYield} L/day</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {breed.characteristics.slice(0, 2).map((char, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {char}
                </Badge>
              ))}
            </div>
            
            <Button
              size="sm"
              onClick={() => handleBreedSelect(breed)}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('visualSearch.viewDetails')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">{t('visualSearch.title')}</h1>
        </div>
        <p className="text-gray-600">{t('visualSearch.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('visualSearch.searchFilters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SearchOption
                category="colors"
                options={searchOptions.colors}
                selectedValues={searchCriteria.colors}
                onChange={handleCriteriaChange}
              />
              
              <SearchOption
                category="sizes"
                options={searchOptions.sizes}
                selectedValues={searchCriteria.sizes}
                onChange={handleCriteriaChange}
              />
              
              <SearchOption
                category="horns"
                options={searchOptions.horns}
                selectedValues={searchCriteria.horns}
                onChange={handleCriteriaChange}
              />
              
              <SearchOption
                category="hump"
                options={searchOptions.hump}
                selectedValues={searchCriteria.hump}
                onChange={handleCriteriaChange}
              />
              
              <SearchOption
                category="regions"
                options={searchOptions.regions}
                selectedValues={searchCriteria.regions}
                onChange={handleCriteriaChange}
              />
              
              <RangeSlider
                category="milkYield"
                label={t('visualSearch.milkYield')}
                min={0}
                max={30}
                step={1}
                value={searchCriteria.milkYield}
                onChange={handleRangeChange}
                unit="L/day"
              />
              
              <RangeSlider
                category="weight"
                label={t('visualSearch.weight')}
                min={200}
                max={800}
                step={50}
                value={searchCriteria.weight}
                onChange={handleRangeChange}
                unit="kg"
              />
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={performSearch} 
                  disabled={isSearching}
                  className="flex-1"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t('visualSearch.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('visualSearch.search')}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {t('visualSearch.searchResults')}
                </span>
                {searchResults.length > 0 && (
                  <Badge variant="secondary">
                    {searchResults.length} {t('visualSearch.breedsFound')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('visualSearch.noResults')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('visualSearch.noResultsDesc')}
                  </p>
                  <Button variant="outline" onClick={resetSearch}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('visualSearch.resetFilters')}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((breed) => (
                    <BreedCard key={breed.id} breed={breed} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              {t('visualSearch.helpTitle')}
            </h3>
            <p className="text-sm text-blue-800 mb-2">
              {t('visualSearch.helpDescription')}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4 mr-1" />
                {t('visualSearch.usePhotoIdentification')}
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                {t('visualSearch.browseAllBreeds')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;
