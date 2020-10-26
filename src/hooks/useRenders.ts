import {useState, useMemo, useEffect} from 'react';
import {Preferences} from '../context/PreferenceContext';
import {Template} from './useTemplates';
const { ipcRenderer } = window.require('electron');

type Render = {
  name: string;
  path: string
}

const useRenders = (preferences: Preferences, currentTemplate: Template|undefined): [
  Render[]
] => {
  const [renders, setRenders] = useState([]);

  const getRenders = useMemo(() => async (templateName: string, path: string) => {
    const updatedRenders = (await ipcRenderer.invoke('renders:get', {
      templateName,
      path
    }));

    setRenders(updatedRenders)
  }, [])

  useEffect(() => {
    if (undefined !== currentTemplate && undefined !== preferences.logoDirectory) {
      getRenders(currentTemplate.name, preferences.logoDirectory)
    }
  }, [currentTemplate, preferences, getRenders]);

  return [renders];
}

export {useRenders}
export type {Render}
