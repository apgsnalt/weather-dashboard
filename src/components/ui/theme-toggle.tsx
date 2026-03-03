import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';

interface ThemeToggleProps {
  onThemeChange?: (isDark: boolean) => void;
}

export function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = stored ? stored === 'dark' : prefersDark;
  const [isDark, setIsDark] = useState<boolean | null>(shouldBeDark);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    onThemeChange?.(newIsDark);
  };

  if (isDark === null) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="cursor-pointer"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
