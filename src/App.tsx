import { useLayoutEffect, useState } from 'react'
import './App.css'
import { AsyncSelect } from './components/ui/async-select';
import { ThemeToggle } from './components/ui/theme-toggle';
import type { GeocodingCity, GeocodingMappedCity } from './types/open-weather';

function App() {
  const [cityId, setCityId] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return stored ? stored === 'dark' : prefersDark;
  });

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

  const fetchCity = async (query: string = '') => {
    if (!query.trim().length) {
      return [];
    }

    try {
      const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);

      if (!response.ok) {
        console.error('OpenWeatherMap API error:', response.status);
        return [];
      }

      const data = await response.json();
      return data.map((city: GeocodingCity) => ({
        id: `${city.lat},${city.lon}`,
        name: [city.name, city.state, city.country].filter(Boolean).join(', '),
        lat: city.lat,
        lon: city.lon,
      }));
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex items-center justify-between p-4">
        <h1 className="app-title pr-2">Weather Dashboard</h1>
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>
      <div className="p-4 mt-8">
        <AsyncSelect
          fetcher={fetchCity}
          renderOption={(item: GeocodingMappedCity) => <div>{item.name}</div>}
          getOptionValue={(item: GeocodingMappedCity) => item.id}
          getDisplayValue={(item: GeocodingMappedCity) => <div className='truncate'>{item.name}</div>}
          label='City'
          value={cityId}
          onChange={setCityId}
          width={300}
        />
      </div>
    </div>
  )
}

export default App
