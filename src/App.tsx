import { useLayoutEffect, useState } from 'react'
import './App.css'
import { AsyncSelect } from './components/ui/async-select';
import { ThemeToggle } from './components/ui/theme-toggle';

function App() {
  const [value, setValue] = useState("");
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

  const fetchData = async (query?: string) => {
    // Your async data fetch logic here
    return [
      { id: "1", name: "Example" },
      { id: "2", name: "Another Example" }
    ];
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="flex items-center justify-between p-4">
        <h1 className="app-title pr-2">Weather Dashboard</h1>
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>
      <div className="p-4 mt-8">
        <AsyncSelect
          fetcher={fetchData}
          renderOption={(item) => <div>{item.name}</div>}
          getOptionValue={(item) => item.id}
          getDisplayValue={(item) => item.name}
          label="Select"
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  )
}

export default App
