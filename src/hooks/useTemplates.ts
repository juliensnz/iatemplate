import {useState, useMemo, useEffect} from 'react';
import {Preferences} from '../context/PreferenceContext';
const { ipcRenderer } = window.require('electron');

type Template = {
  name: string;
  path: string
}

const useTemplates = (preferences: Preferences): [
  Template[],
  Template|undefined,
  (newCurrentTemplate: string) => void,
  () => void
] => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template|undefined>(undefined);

  const getTemplates = useMemo(() => async (path: string) => {
    const updatedTemplates = (await ipcRenderer.invoke('templates:get', path));

    setTemplates(updatedTemplates)
    if (
      undefined === currentTemplate ||
      undefined === updatedTemplates.find(((updatedTemplate: Template) => updatedTemplate.name === currentTemplate.name))
    ) {
      setCurrentTemplate(updatedTemplates[0]);
    }
  }, []);

  useEffect(() => {
    if (undefined !== preferences.logoDirectory) {
      getTemplates(preferences.logoDirectory)
    }
  }, [preferences.logoDirectory, getTemplates]);

  return [templates, currentTemplate, (name: string) => {
    setCurrentTemplate(templates.find((template: Template) => name === template.name))
  }, () => preferences.logoDirectory && getTemplates(preferences.logoDirectory)];
}

export {useTemplates}
export type {Template}
