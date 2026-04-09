import { MoonStar, SunMedium } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
