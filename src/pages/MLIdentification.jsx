import React from 'react';
import MLBreedIdentification from '@/components/MLBreedIdentification.jsx';

const MLIdentification = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI-Powered Breed Identification
          </h1>
          <p className="text-muted-foreground">
            Upload a photo of cattle or buffalo to automatically identify the breed using our AI system
          </p>
        </div>
        
        <MLBreedIdentification />
        
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Upload Image</h3>
              <p className="text-sm text-muted-foreground">
                Take a photo or upload an image of the animal
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes color, size, and visual features
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">
                Receive breed identification with confidence scores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLIdentification;
