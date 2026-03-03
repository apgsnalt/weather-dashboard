import { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import './App.css'
import { AsyncSelect } from './components/ui/async-select';
import { ThemeToggle } from './components/ui/theme-toggle';
import type { GeocodingCity, GeocodingMappedCity, ForecastResponse, WeatherData, WeatherDataWithPhase } from './types/open-weather';

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import ForecastItem from './components/ForecastItem';
import { ABSOLUTE_ZERO, API_BASE_URL, DAY_PHASES } from './assets/const';


function App() {
  const [cityId, setCityId] = useState('');
  const [cities, setCities] = useState<GeocodingMappedCity[]>([]);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return stored ? stored === 'dark' : prefersDark;
  });

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  const city = cities.find(c => c.id === cityId);

  // Determine day phase for each forecast item
  let dayPhaseForecast: Array<WeatherDataWithPhase> = [];
  if (forecast) {
    dayPhaseForecast = forecast.list
    .filter((_, i) => i % 2 === 0)
    .map((item: WeatherData) => {
      const hour = new Date(item.dt * 1000).getHours();
      const phaseHour = Math.floor(hour / 6) * 6;
      const dayPhase = phaseHour.toString().padStart(2, '0') as DayPhases;
      return {
        ...item,
        dayPhase: DAY_PHASES[dayPhase],
      };
    })
  }


  useLayoutEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const fetchCity = useCallback(async (query: string = '') => {
    if (!query.trim().length) {
      return [];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const mappedCities: GeocodingMappedCity[] = data.map((city: GeocodingCity) => ({
        id: `${city.lat},${city.lon}`,
        name: [city.name, city.state, city.country].filter(Boolean).join(', '),
      }));
      setCities(mappedCities);
      return mappedCities;
    } catch (error) {
      toast('Error fetching cities: ' + error);
      return [];
    }
  }, [apiKey]);


  useEffect(() => {
    const fetchForecast = async () => {
      if (isNaN(lat) || isNaN(lon)) {
        toast('Invalid city coordinates');
        return [];
      }

      try {
        const response = await fetch(`${API_BASE_URL}/data/2.5/forecast?cnt=8&lat=${lat}&lon=${lon}&appid=${apiKey}`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        setForecast(data);
      } catch (error) {
        toast('Error fetching forecast: ' + error);
        return [];
      }
    };

    const [ lat, lon ] = cityId.split(',').map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      fetchForecast();
    }
  }, [apiKey, cityId]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex items-center justify-between p-4">
        <h1 className="app-title pr-2">Weather Dashboard</h1>
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>
      <div className="p-4 mt-8 max-w-md mx-auto">
        <AsyncSelect
          fetcher={fetchCity}
          renderOption={(item: GeocodingMappedCity) => <div>{item.name}</div>}
          getOptionValue={(item: GeocodingMappedCity) => item.id}
          getDisplayValue={(item: GeocodingMappedCity) => <div className='truncate'>{item.name}</div>}
          label='City'
          value={cityId}
          onChange={(value: string) => {
            setCityId(value);
            setForecast(null);
          }}
          width={300}
        />
      </div>

      {cityId && (
        !forecast
        ? (
          <div className="p-4 text-sm text-muted-foreground">
            <Spinner className="size-8 mx-auto" />
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-8">Forecast for {city?.name}</h2>
            <div className="grid grid-cols-1 gap-4">
              {dayPhaseForecast.map((item: WeatherDataWithPhase) => (
                <ForecastItem
                  key={item.dt}
                  id={item.dt}
                  time={new Date(item.dt * 1000).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  phase={item.dayPhase}
                  temperature={Math.round(item.main?.temp + ABSOLUTE_ZERO)}
                  description={item.weather?.[0].description ?? ''}
                />
              ))}
            </div>
          </div>
        )
      )}
      <Toaster />
    </div>
  )
}

export default App;
