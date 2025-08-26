import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Camera, Upload, Video, X } from 'lucide-react';
import { GOLF_CLUBS, RECORDING_TIPS } from '../../constants/golf';
import { toast } from 'sonner@2.0.3';

interface RecordingSetupProps {
  onStart: (club: string) => void;
}

export function RecordingSetup({ onStart }: RecordingSetupProps) {
  const [selectedClub, setSelectedClub] = useState('7-Iron');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video file must be smaller than 50MB');
        return;
      }

      setUploadedVideo(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      toast.success('Video uploaded successfully!');
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeVideo = () => {
    if (uploadedVideo) {
      toast.success('Starting video analysis...');
      onStart(selectedClub);
    }
  };

  const handleStartRecording = () => {
    toast.success('Starting live recording...');
    onStart(selectedClub);
  };

  // Define tips based on upload state
  const tips = uploadedVideo ? [
    'Ensure the video shows your full swing from setup to follow-through',
    'Side view (down-the-line) provides the best analysis results',
    'Good lighting and stable camera position improve accuracy',
    'Video should be at least 3 seconds long'
  ] : RECORDING_TIPS;

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-primary">Setup Your Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-primary mb-2 block">Select Club</label>
          <Select value={selectedClub} onValueChange={setSelectedClub}>
            <SelectTrigger className="bg-background/50 border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="gradient-card border-white/20">
              {GOLF_CLUBS.map((club) => (
                <SelectItem key={club} value={club}>
                  {club}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Video Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium text-primary">Upload Video (Optional)</label>
          </div>
          
          {!uploadedVideo ? (
            <div 
              className="border-2 border-dashed border-accent/30 rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload a swing video
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, AVI up to 50MB
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative bg-background/30 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{uploadedVideo.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveVideo}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {videoPreview && (
                <div className="relative rounded-lg overflow-hidden bg-background/50">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-40 object-cover"
                    onError={() => {
                      toast.error('Error loading video preview');
                      handleRemoveVideo();
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
          <h4 className="font-medium text-primary mb-2">
            {uploadedVideo ? 'Video Analysis Tips' : 'Recording Tips'}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {tips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-3">
          {uploadedVideo ? (
            <>
              <Button 
                className="flex-1 gradient-bg text-primary-foreground"
                onClick={handleAnalyzeVideo}
                size="lg"
              >
                <Video className="w-5 h-5 mr-2" />
                Analyze Video
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Different
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="flex-1 gradient-bg text-primary-foreground"
                onClick={handleStartRecording}
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Record Live
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Video
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}