/*
 * -------------------------------------------------------------------------------------------------------------------
 * Copyright (c) 2025 Christian Bannard
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * -------------------------------------------------------------------------------------------------------------------
 * File: c:\localdev\SecurePress\frontend\src\contexts\ContextProvider.tsx
 *  
 * Author: Christian Bannard
 * Created: 2025-12-30
 *  
 * Description: 
 * -------------------------------------------------------------------------------------------------------------------
 * HISTORY:
 * Date      	By	Comments
 * ----------	---	-------------------------------------------------------------------------------------------------
 */

import React, { createContext, useContext, useState, useEffect } from "react";

// @ts-ignore
import { getThemeNames, setTheme as setGlobalTheme } from '../config/themes.ts';

// Sidebar state types
export type SidebarState = 'full' | 'collapsed' | 'hidden';

// State context type definition
interface StateContextType {
  activeMenu: boolean; // Keep for backward compatibility
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarState: SidebarState;
  setSidebarState: React.Dispatch<React.SetStateAction<SidebarState>>;
  isClicked: typeof initialState;
  setIsClicked: React.Dispatch<React.SetStateAction<typeof initialState>>;
  handleClick: (clicked: string) => void;
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentTheme: string;
  setCurrentTheme: (value: string) => void;
  currentMode: string;
  isDarkTheme: boolean;
  themeSettings: boolean;
  setThemeSettings: (value: boolean) => void;
  initialState: typeof initialState;
  fontSize: 'text-sm' | 'text-base' | 'text-lg';
  setFontSize: (value: 'text-sm' | 'text-base' | 'text-lg') => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const initialState = {
    help: false,
    settings: false,
    userProfile: false,
    notification: false,
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarState, setSidebarState] = useState<SidebarState>('full');
    const [activeMenu, setActiveMenu] = useState<boolean>(true); // Keep for backward compatibility
    const [isClicked, setIsClicked] = useState<typeof initialState>(initialState);
    const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
    const [currentTheme, setCurrentTheme] = useState<string>(localStorage.getItem('theme') || 'corporate');
    const [themeSettings, setThemeSettings] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg'>(
        (localStorage.getItem('fontSize') as 'text-sm' | 'text-base' | 'text-lg') || 'text-base'
    );

    // Sync activeMenu with sidebarState for backward compatibility
    useEffect(() => {
        setActiveMenu(sidebarState !== 'hidden');
    }, [sidebarState]);

    useEffect(() => {
        setGlobalTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        document.documentElement.className = fontSize;
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const increaseFontSize = () => {
        if (fontSize === 'text-sm') setFontSize('text-base');
        else if (fontSize === 'text-base') setFontSize('text-lg');
    };

    const decreaseFontSize = () => {
        if (fontSize === 'text-lg') setFontSize('text-base');
        else if (fontSize === 'text-base') setFontSize('text-sm');
    };

    const handleClick = (clicked: string) => {
        setIsClicked({ ...initialState, [clicked]: true });
    }

    // Determine if current theme is dark mode - themes that need white logo
    const isDarkTheme = [
        // DaisyUI built-in dark themes
        'dark',
        'halloween',
        'synthwave',
        'forest',
        'aqua',
        'black',
        'luxury',
        'dracula',
        'business',
        'night',
        'coffee',
        // Custom dark themes
        'darkpetals',
        'embers',
        'turtlepowered',
        'velvet',
        'sunset',
        'rosey',
        'darkstrawberry',
        'springgarden',
        'storm',
        'tron',
        'electricity',
        'christmastree',
        'darkenedlime',
        'pumpkin',
        'darkandstormynight',
        'luke',
        'conscripted',
        'citrus',
        'wookiehere'
    ].includes(currentTheme);
    const currentMode = isDarkTheme ? 'Dark' : 'Light';
    return (
        <StateContext.Provider
            value={{
                activeMenu,
                setActiveMenu,
                sidebarState,
                setSidebarState,
                isClicked,
                setIsClicked,
                handleClick,
                screenSize,
                setScreenSize,
                currentTheme,
                setCurrentTheme,
                currentMode,
                isDarkTheme,
                themeSettings,
                setThemeSettings,
                initialState,
                fontSize,
                setFontSize,
                increaseFontSize,
                decreaseFontSize,
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStateContext must be used within a ContextProvider');
  }
  return context;
};
