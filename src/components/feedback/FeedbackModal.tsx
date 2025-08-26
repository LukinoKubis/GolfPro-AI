import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Star, Send, MessageSquare, TrendingUp, X, 
  ThumbsUp, Heart, Lightbulb
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [joinProgram, setJoinProgram] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'round' | 'general'>('round');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { submitFeedback } = useAppContext();

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      submitFeedback(rating, comment);
      toast.success('Thank you for your feedback! 🙏');
      setIsSubmitting(false);
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setJoinProgram(false);
    setFeedbackType('round');
    onClose();
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return { label: 'Poor', color: 'text-red-400', emoji: '😞' };
      case 2: return { label: 'Fair', color: 'text-orange-400', emoji: '😐' };
      case 3: return { label: 'Good', color: 'text-yellow-400', emoji: '🙂' };
      case 4: return { label: 'Very Good', color: 'text-blue-400', emoji: '😊' };
      case 5: return { label: 'Excellent', color: 'text-green-400', emoji: '🤩' };
      default: return { label: '', color: '', emoji: '' };
    }
  };

  const currentRating = getRatingLabel(rating);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="gradient-card backdrop-blur-md border-white/20 max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-primary flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Share Your Feedback</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            Help us improve your golfing experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feedback Type Toggle */}
          <div className="flex items-center justify-center space-x-2 p-1 bg-muted/50 rounded-lg">
            <Button
              variant={feedbackType === 'round' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFeedbackType('round')}
              className={feedbackType === 'round' ? 'gradient-bg text-primary-foreground' : ''}
            >
              Last Round
            </Button>
            <Button
              variant={feedbackType === 'general' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFeedbackType('general')}
              className={feedbackType === 'general' ? 'gradient-bg text-primary-foreground' : ''}
            >
              App Experience
            </Button>
          </div>

          {/* Rating Section */}
          <div className="text-center space-y-4">
            <div>
              <h3 className="font-medium text-primary mb-2">
                {feedbackType === 'round' 
                  ? 'How was your last round?' 
                  : 'How would you rate the app?'
                }
              </h3>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`w-8 h-8 transition-all hover:scale-110 ${
                      star <= rating 
                        ? 'text-yellow-400' 
                        : 'text-muted-foreground hover:text-yellow-400/50'
                    }`}
                  >
                    <Star 
                      className="w-8 h-8" 
                      fill={star <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className={`font-medium ${currentRating.color}`}>
                    {currentRating.label}
                  </span>
                  <span className="text-lg">{currentRating.emoji}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary block">
              Tell us more (optional)
            </label>
            <Textarea
              placeholder={
                feedbackType === 'round' 
                  ? "How did the round go? Any standout moments or challenges?"
                  : "What features do you love? What could be improved?"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-background/50 border-white/20 backdrop-blur-sm resize-none min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </div>
          </div>

          {/* Quick Feedback Options */}
          {rating > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-primary">Quick feedback:</p>
              <div className="flex flex-wrap gap-2">
                {rating >= 4 ? [
                  { icon: ThumbsUp, label: "Love the features!" },
                  { icon: TrendingUp, label: "Great progress tracking" },
                  { icon: Heart, label: "Amazing user experience" }
                ] : [
                  { icon: Lightbulb, label: "Needs improvement" },
                  { icon: MessageSquare, label: "More features needed" },
                  { icon: TrendingUp, label: "Performance issues" }
                ].map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-background/30 border-white/20 hover:bg-background/50 text-xs h-8"
                      onClick={() => setComment(prev => prev ? `${prev} ${option.label}` : option.label)}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* App Improvement Program */}
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Join App Improvement Program
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Help us improve by sharing anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={joinProgram}
                  onCheckedChange={setJoinProgram}
                />
              </div>
              
              {joinProgram && (
                <div className="mt-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Beta Tester
                    </Badge>
                    <span className="text-sm text-primary">
                      Get early access to new features!
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            className="w-full gradient-bg text-primary-foreground"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            Your feedback helps improve the app for everyone. No personal data is collected.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}