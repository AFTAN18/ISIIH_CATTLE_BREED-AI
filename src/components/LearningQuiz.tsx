import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Star,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BREED_DATABASE } from '@/services/aiService';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'image-identification' | 'true-false';
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
  badge?: string;
}

const LearningQuiz: React.FC = () => {
  const { t } = useTranslation();
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    generateQuiz();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizActive && !showResult) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, showResult, quizStartTime]);

  const generateQuiz = () => {
    const allBreeds = [...BREED_DATABASE.cattle, ...BREED_DATABASE.buffalo];
    const questions: QuizQuestion[] = [];

    // Generate multiple choice questions
    for (let i = 0; i < 8; i++) {
      const breed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
      const wrongBreeds = allBreeds
        .filter(b => b.name !== breed.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [breed.name, ...wrongBreeds.map(b => b.name)]
        .sort(() => 0.5 - Math.random());
      
      questions.push({
        id: `mc-${i}`,
        type: 'multiple-choice',
        question: `Which breed is known for: ${breed.characteristics[0]}?`,
        options,
        correctAnswer: options.indexOf(breed.name),
        explanation: `${breed.name} is characterized by ${breed.characteristics.join(', ')}.`,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
        category: breed.region
      });
    }

    // Generate true/false questions
    for (let i = 0; i < 4; i++) {
      const breed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
      const isTrue = Math.random() > 0.5;
      const characteristic = breed.characteristics[Math.floor(Math.random() * breed.characteristics.length)];
      
      questions.push({
        id: `tf-${i}`,
        type: 'true-false',
        question: `${breed.name} is known for ${characteristic}.`,
        options: ['True', 'False'],
        correctAnswer: isTrue ? 0 : 1,
        explanation: isTrue 
          ? `Correct! ${breed.name} is indeed known for ${characteristic}.`
          : `False! ${breed.name} is not typically known for this characteristic.`,
        difficulty: 'easy',
        category: breed.region
      });
    }

    // Generate image identification questions
    for (let i = 0; i < 3; i++) {
      const breed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
      const wrongBreeds = allBreeds
        .filter(b => b.name !== breed.name && b.region === breed.region)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [breed.name, ...wrongBreeds.map(b => b.name)]
        .sort(() => 0.5 - Math.random());
      
      questions.push({
        id: `img-${i}`,
        type: 'image-identification',
        question: 'Identify the breed shown in this image:',
        imageUrl: `/images/breeds/${breed.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
        options,
        correctAnswer: options.indexOf(breed.name),
        explanation: `This is ${breed.name}, identifiable by ${breed.characteristics.slice(0, 2).join(' and ')}.`,
        difficulty: 'medium',
        category: breed.region
      });
    }

    setCurrentQuiz(questions.sort(() => 0.5 - Math.random()));
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setQuizStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeSpent(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      setUserAnswers(newAnswers);
      
      if (currentQuestionIndex < currentQuiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(newAnswers);
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || null);
    }
  };

  const finishQuiz = (answers: number[]) => {
    const correctAnswers: number[] = [];
    const incorrectAnswers: number[] = [];
    
    answers.forEach((answer, index) => {
      if (answer === currentQuiz[index].correctAnswer) {
        correctAnswers.push(index);
      } else {
        incorrectAnswers.push(index);
      }
    });

    const score = Math.round((correctAnswers.length / currentQuiz.length) * 100);
    let badge = '';
    
    if (score >= 90) badge = 'Expert';
    else if (score >= 80) badge = 'Advanced';
    else if (score >= 70) badge = 'Intermediate';
    else if (score >= 60) badge = 'Beginner';

    const result: QuizResult = {
      score,
      totalQuestions: currentQuiz.length,
      timeSpent,
      correctAnswers,
      incorrectAnswers,
      badge
    };

    setQuizResult(result);
    setShowResult(true);
    setIsQuizActive(false);
  };

  const restartQuiz = () => {
    generateQuiz();
    startQuiz();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = currentQuiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

  if (!isQuizActive && !showResult) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Breed Identification Quiz</CardTitle>
            <CardDescription>Test your knowledge of cattle and buffalo breeds</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-medium">15 Questions</h4>
                <p className="text-sm text-gray-600">Mixed difficulty levels</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <h4 className="font-medium">~10 Minutes</h4>
                <p className="text-sm text-gray-600">Average completion time</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h4 className="font-medium">Earn Badges</h4>
                <p className="text-sm text-gray-600">Based on your score</p>
              </div>
            </div>
            
            <Button onClick={startQuiz} size="lg" className="px-8">
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult && quizResult) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {quizResult.score}%
              </div>
              <p className="text-gray-600">
                {quizResult.correctAnswers.length} out of {quizResult.totalQuestions} correct
              </p>
              {quizResult.badge && (
                <Badge className="mt-2" variant="default">
                  <Star className="w-3 h-3 mr-1" />
                  {quizResult.badge}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-medium">{formatTime(quizResult.timeSpent)}</div>
                <p className="text-sm text-gray-600">Time Spent</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="font-medium">{Math.round((quizResult.correctAnswers.length / quizResult.totalQuestions) * 100)}%</div>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={restartQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => setShowResult(false)}>
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {currentQuiz.length}
            </span>
            <span className="text-sm text-gray-600">
              Time: {formatTime(timeSpent)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{currentQuestion?.difficulty}</Badge>
            <Badge variant="secondary">{currentQuestion?.category}</Badge>
          </div>
          <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image for image-identification questions */}
          {currentQuestion?.type === 'image-identification' && (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Breed Image Placeholder</span>
            </div>
          )}
          
          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === currentQuiz.length - 1 ? 'Finish Quiz' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningQuiz;
