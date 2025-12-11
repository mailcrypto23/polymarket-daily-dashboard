export function applyTheme(name) {
  const root = document.documentElement;

  if (name === 'premium-glossy') {
    root.style.setProperty('--bg', '#07102a');
    root.style.setProperty('--text', '#eaf0ff');
    root.style.setProperty('--card', 'rgba(255,255,255,0.03)');
    root.style.setProperty('--accent', '#7c3aed');
    root.style.setProperty('--premium-mode', '1');
  } 
  else if (name === 'glossy-dark') {
    root.style.setProperty('--bg', '#071029');
    root.style.setProperty('--text', '#e6eef8');
    root.style.setProperty('--card', 'rgba(255,255,255,0.03)');
    root.style.setProperty('--accent', '#7c3aed');
    root.style.setProperty('--premium-mode', '0');
  }
  else if (name === 'modern-light') {
    root.style.setProperty('--bg', '#f6f7fb');
    root.style.setProperty('--text', '#0b1220');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--accent', '#7c3aed');
    root.style.setProperty('--premium-mode', '0');
  }

  root.setAttribute('data-theme', name);
}
