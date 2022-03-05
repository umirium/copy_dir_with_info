import { render } from 'react-dom';
import App from './App';

// extend Window object for IPC connection
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        mkdir: (dirpath: string, files: string[]) => boolean;
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
