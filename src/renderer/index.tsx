import { render } from 'react-dom';
import App from './App';

// extend Window object for IPC connection
declare global {
  interface Window {
    electron: {
      shell: {
        mkdir: (dirname: string) => boolean;
      };
    };
  }
}

render(<App />, document.getElementById('root'));
