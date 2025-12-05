import React, {useState} from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import ThemeSwitcher from './components/layout/ThemeSwitcher'
import { ThemeProvider } from './styles/theme-engine'

export default function App(){
  return (
    <ThemeProvider>
      <div className='app-root' style={{display:'flex',minHeight:'100vh'}}>
        <Sidebar />
        <div style={{flex:1,padding:20}}>
          <Topbar />
          <ThemeSwitcher />
          <Dashboard />
        </div>
      </div>
    </ThemeProvider>
  )
}
