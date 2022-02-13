const { contextBridge, ipcRenderer } = require('electron');

const validChannels = ['ipc-example', 'mkdir', 'cpdir'];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    mkdir(dirpath, files) {
      return ipcRenderer.send('mkdir', dirpath, files);
    },
    cpdir(source, distination) {
      ipcRenderer.send('cpdir', source, distination);
    },
    on(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
