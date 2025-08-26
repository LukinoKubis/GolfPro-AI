import { Card, CardContent } from '../ui/card';
import { Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  weather?: {
    temperature: number;
    windSpeed: number;
    windDirection: string;
    humidity: number;
  };
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  // Default weather data if none provided
  const defaultWeather = {
    temperature: 72,
    windSpeed: 8,
    windDirection: 'SW',
    humidity: 65
  };

  const weatherData = weather || defaultWeather;

  return (
    <Card className="gradient-card backdrop-blur-sm border-white/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-primary">Course Conditions</h3>
              <p className="text-sm text-muted-foreground">Perfect for a round!</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Thermometer className="w-4 h-4 text-accent" />
                <span>{weatherData.temperature}°F</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wind className="w-4 h-4 text-primary" />
                <span>{weatherData.windSpeed}mph {weatherData.windDirection}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>{weatherData.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}