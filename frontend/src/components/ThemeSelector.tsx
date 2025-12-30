import React, { useState, useEffect, useRef } from 'react';
import { FaPalette, FaTimes } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
// @ts-ignore
import { getThemeNames, customThemeColors } from '../config/themes.ts';

interface ThemeOption {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    base: string;
  };
  isDark: boolean;
}

const ThemeSelector: React.FC = () => {
  const { currentTheme, setCurrentTheme, isDarkTheme } = useStateContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredThemes, setFilteredThemes] = useState<ThemeOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dark themes list
  const darkThemesList = [
    'dark', 'halloween', 'synthwave', 'forest', 'aqua', 'black', 'luxury', 
    'dracula', 'business', 'night', 'coffee', 'darkpetals', 'embers', 
    'turtlepowered', 'velvet', 'sunset', 'rosey', 'darkstrawberry', 
    'springgarden', 'storm', 'tron', 'electricity', 'christmastree', 
    'darkenedlime', 'pumpkin', 'darkandstormynight', 'luke', 'conscripted', 
    'citrus', 'wookiehere'
  ];

  // Extract theme colors from config
  const getThemeColors = (themeName: string): ThemeOption['colors'] => {
    // Check if it's a custom theme
    if (customThemeColors[themeName]) {
      const theme = customThemeColors[themeName];
      return {
        primary: theme.primary || '#000000',
        secondary: theme.secondary || '#000000',
        base: theme['base-100'] || '#ffffff',
      };
    }

    // Default colors for DaisyUI built-in themes (approximate)
    const defaults: Record<string, ThemeOption['colors']> = {
      light: { primary: '#570df8', secondary: '#f000b8', base: '#ffffff' },
      dark: { primary: '#661ae6', secondary: '#d926aa', base: '#1d232a' },
      cupcake: { primary: '#65c3c8', secondary: '#ef9fbc', base: '#faf7f5' },
      bumblebee: { primary: '#e0a82e', secondary: '#f9d72f', base: '#ffffff' },
      emerald: { primary: '#66cc8a', secondary: '#377cfb', base: '#ffffff' },
      corporate: { primary: '#4b6bfb', secondary: '#7b92b2', base: '#ffffff' },
      synthwave: { primary: '#e779c1', secondary: '#58c7f3', base: '#1a103d' },
      retro: { primary: '#ef9995', secondary: '#a4cbb4', base: '#e4d8b4' },
      cyberpunk: { primary: '#ff7598', secondary: '#75d1f0', base: '#ffffff' },
      valentine: { primary: '#e96d7b', secondary: '#a991f7', base: '#f8dce5' },
      halloween: { primary: '#f28c18', secondary: '#6d3a9c', base: '#1f1f1f' },
      garden: { primary: '#5c7f67', secondary: '#ecf4e7', base: '#e9e7e7' },
      forest: { primary: '#1eb854', secondary: '#1db88e', base: '#171212' },
      aqua: { primary: '#09ecf3', secondary: '#966fb3', base: '#283d3b' },
      lofi: { primary: '#0d0d0d', secondary: '#1a1a1a', base: '#ffffff' },
      pastel: { primary: '#d1c1d7', secondary: '#f9dcc4', base: '#ffffff' },
      fantasy: { primary: '#6e0b75', secondary: '#007ebd', base: '#ffffff' },
      wireframe: { primary: '#b8b8b8', secondary: '#b8b8b8', base: '#ffffff' },
      black: { primary: '#373737', secondary: '#373737', base: '#000000' },
      luxury: { primary: '#ffffff', secondary: '#152747', base: '#09090b' },
      dracula: { primary: '#ff79c6', secondary: '#bd93f9', base: '#282a36' },
      cmyk: { primary: '#179299', secondary: '#e900ff', base: '#ffffff' },
      autumn: { primary: '#8c0327', secondary: '#d85251', base: '#f3f4f6' },
      business: { primary: '#1c4e80', secondary: '#7c909a', base: '#ffffff' },
      acid: { primary: '#ff00f4', secondary: '#ff7400', base: '#fafafa' },
      lemonade: { primary: '#519903', secondary: '#e9e92e', base: '#ffffff' },
      night: { primary: '#38bdf8', secondary: '#818cf8', base: '#0f1729' },
      coffee: { primary: '#db924b', secondary: '#6f4331', base: '#20161f' },
      winter: { primary: '#047aed', secondary: '#463aa2', base: '#ffffff' },
    };

    return defaults[themeName] || { primary: '#000000', secondary: '#000000', base: '#ffffff' };
  };

  // Build theme options
  useEffect(() => {
    const themes = getThemeNames();
    const options: ThemeOption[] = themes.map(name => ({
      name,
      colors: getThemeColors(name),
      isDark: darkThemesList.includes(name),
    }));

    // Filter based on search
    const filtered = searchTerm
      ? options.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    // Sort: dark themes first, then light
    filtered.sort((a, b) => {
      if (a.isDark && !b.isDark) return -1;
      if (!a.isDark && b.isDark) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredThemes(filtered);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (themeName: string) => {
    setCurrentTheme(themeName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm gap-2 min-w-[160px] justify-start"
      >
        <FaPalette className="text-lg" />
        <span className="flex-1 text-left truncate">{currentTheme}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl border z-50 max-h-[500px] flex flex-col" style={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)/1))', borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}>
          {/* Search input */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))' }}>
            <div className="relative">
              <FaPalette className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                className="input input-bordered input-sm w-full pl-10 pr-10"
                placeholder="Search themes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Theme list with color swatches */}
          <div className="overflow-y-auto flex-1 p-2">
            {/* Dark themes section */}
            {filteredThemes.filter(t => t.isDark).length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                  Dark Themes
                </div>
                {filteredThemes
                  .filter(t => t.isDark)
                  .map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeSelect(theme.name)}
                      className={`w-full p-3 rounded-lg hover:bg-base-200 transition-colors text-left flex items-center gap-3 ${
                        currentTheme === theme.name ? 'bg-base-200 ring-2 ring-primary' : ''
                      }`}
                    >
                      {/* Color swatches */}
                      <div className="flex gap-1">
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.base }}
                          title="Background"
                        />
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                      </div>
                      
                      {/* Theme name */}
                      <span className="flex-1 font-medium capitalize">{theme.name}</span>
                      
                      {/* Current indicator */}
                      {currentTheme === theme.name && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
              </>
            )}

            {/* Light themes section */}
            {filteredThemes.filter(t => !t.isDark).length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-base-content/60 uppercase tracking-wider mt-2">
                  Light Themes
                </div>
                {filteredThemes
                  .filter(t => !t.isDark)
                  .map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeSelect(theme.name)}
                      className={`w-full p-3 rounded-lg hover:bg-base-200 transition-colors text-left flex items-center gap-3 ${
                        currentTheme === theme.name ? 'bg-base-200 ring-2 ring-primary' : ''
                      }`}
                    >
                      {/* Color swatches */}
                      <div className="flex gap-1">
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.base }}
                          title="Background"
                        />
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded border border-base-content/20"
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                      </div>
                      
                      {/* Theme name */}
                      <span className="flex-1 font-medium capitalize">{theme.name}</span>
                      
                      {/* Current indicator */}
                      {currentTheme === theme.name && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
              </>
            )}

            {/* No results */}
            {filteredThemes.length === 0 && (
              <div className="p-8 text-center text-base-content/50">
                No themes found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
