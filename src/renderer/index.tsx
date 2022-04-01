import { render } from 'react-dom';
import App from './App';
import '@fontsource/noto-sans-jp/';
import '@fontsource/noto-sans-jp/100.css';
import '@fontsource/noto-sans-jp/300.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-sans-jp/900.css';

// extend Window object for IPC connection
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        cpdir: (source: string, distination: string) => void;

        on: (channel: any, func: any) => void;
        once: (channel: any, func: any) => void;
      };
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
      };
    };
  }
}

render(<App />, document.getElementById('root'));
