import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'}
    >
      <div className={`theme-toggle-icon ${theme === 'dark' ? 'sun-visible' : 'moon-visible'}`}>
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
