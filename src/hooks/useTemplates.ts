import {useState, useMemo, useEffect, useCallback} from 'react';
import {Preferences} from '../context/PreferenceContext';
const { ipcRenderer } = window.require('electron');

type Template = {
  name: string;
  path: string;
  data: string[]
}

const useTemplates = (preferences: Preferences): [
  Template[],
  Template|undefined,
  (newCurrentTemplate: string) => void,
  () => void,
  (updatedTemplate: Template) => void
] => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template|undefined>(undefined);

  const getTemplates = useCallback(async (path: string) => {
    const updatedTemplates = (await ipcRenderer.invoke('templates:get', path));

    setTemplates(updatedTemplates)
    if (
      undefined === currentTemplate ||
      undefined === updatedTemplates.find(((updatedTemplate: Template) => updatedTemplate.name === currentTemplate.name))
    ) {
      setCurrentTemplate(updatedTemplates[0]);
    }
  }, []);

  const writeTemplate = useCallback(async (template: Template) => {
    (await ipcRenderer.invoke('templates:write', template));
  }, [])

  const updateTemplates = useCallback(
    () => preferences.logoDirectory && getTemplates(preferences.logoDirectory),
    [preferences]
  )

  useEffect(() => {
    if (undefined !== preferences.logoDirectory) {
      getTemplates(preferences.logoDirectory)
    }
  }, [preferences.logoDirectory, getTemplates]);

  return [
    templates,
    currentTemplate,
    (name: string) => {
      setCurrentTemplate(templates.find((template: Template) => name === template.name))
    },
    updateTemplates,
    writeTemplate
  ];
}

export {useTemplates}
export type {Template}
