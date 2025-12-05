import React, {createContext, useContext, useState, useEffect} from 'react'
const ThemeContext = createContext()
export function ThemeProvider({children}){
  const [theme,setTheme] = useState(localStorage.getItem('pm_theme')||'glossy-dark')
  useEffect(()=>{ localStorage.setItem('pm_theme',theme) },[theme])
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme',theme)
  },[theme])
  return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>
}
export function useTheme(){ return useContext(ThemeContext) }
