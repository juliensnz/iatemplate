import {createContext} from 'react';
const {ipcRenderer} = window.require('electron');

type Electron = {
  invoke: (command: string, options: any) => Promise<any>;
  send: (command: string, options: any) => Promise<any>;
  on: (command: string, callback: (event: any, args: any) => void) => void;
  removeAllListeners: (command: string) => void;
};

const ElectronContext = createContext<Electron>(ipcRenderer);

export {ElectronContext};
export type {Electron};
