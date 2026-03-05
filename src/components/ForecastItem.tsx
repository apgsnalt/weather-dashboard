import { useState } from 'react';
import { cn } from "@/lib/utils";
import { CloudRain, CloudSun, Sun } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { WeatherDataWithPhase } from '@/types/open-weather';
import { ABSOLUTE_ZERO } from '@/assets/const';
import { capitalCase } from 'change-case';


const ForecastItem = ({ weatherData }: { weatherData: WeatherDataWithPhase}) => {
  const [ openDetail, setOpenDetail ] = useState(false);

  const time = new Date(weatherData.dt * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  const temperature = Math.round(weatherData.main?.temp + ABSOLUTE_ZERO);
  const description = weatherData.weather?.[0].description ?? '';

  return(
    <>
      <div
        className={cn("flex flex-col items-center gap-1 p-3 text-sm border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 w-full max-w-md mx-auto cursor-pointer")}
        onClick={() => setOpenDetail(true)}
      >
        <span className="font-medium text-muted-foreground">{capitalCase(weatherData.dayPhase)} • {time}</span>
        <span className="text-2xl font-bold text-foreground">{temperature} °C</span>
        <span className="capitalize text-xs text-muted-foreground text-center">
          {/rain|snow/.test(description)
          ? <CloudRain className="size-8" />
          : /clear/.test(description)
            ? <Sun className="size-8" />
            : <CloudSun className="size-8" />}
        </span>
      </div>

      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather details</DialogTitle>
            <DialogDescription>
              Detailed weather information for {new Date(weatherData.dt_txt).toLocaleDateString()} at {time}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
              {temperature}°
            </span>
            <div>
              <div className="font-medium">{capitalCase(weatherData.weather[0].description)}</div>
              <p className="text-xs">Clouds: {weatherData.clouds.all}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="text-xs space-y-0.5">
              <span className="text-muted-foreground">Humidity</span>
              <p className="text-sm">{weatherData.main.humidity}%</p>
            </div>
            <div className="text-xs space-y-0.5">
              <span className="text-muted-foreground">Wind</span>
              <p className="text-sm">{weatherData.wind.speed.toFixed(1)} m/s</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  ); 
}

export default ForecastItem;