import React from 'react'
import {useTheme} from '../../styles/theme-engine'
export default function ThemeSwitcher(){
  const {theme,setTheme} = useTheme()
  function next(){
    const list=['glossy-dark','glossy-light','modern-dark','modern-light']
    setTheme(list[(list.indexOf(theme)+1)%list.length])
  }
  return <button onClick={next} style={{marginBottom:12}}>Toggle Theme ({theme})</button>
}
