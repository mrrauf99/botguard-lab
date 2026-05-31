import './styles/global.css';
import './styles/components.css';
import App from './App';

const root = document.getElementById('root');
if (root) {
  // Simple rendering for now - components are JavaScript functions
  const html = App();
  if (html) {
    root.innerHTML = html;
  } else {
    root.innerHTML = '<h1>Bot Detection Platform</h1>';
  }
}
