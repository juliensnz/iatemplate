import {useState, useEffect, useCallback} from 'react';
import {Preferences} from '../context/PreferenceContext';
import {Render} from './useRenders';
const {ipcRenderer} = window.require('electron');

type Template = {
  name: string;
  path: string;
  fields: string[];
};

const useTemplates = (
  preferences: Preferences
): [
  Template[],
  Template | undefined,
  (newCurrentTemplate: string) => void,
  () => void,
  (updatedTemplate: Template) => void,
  (render: Render) => void
] => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | undefined>(undefined);

  const getTemplates = useCallback(async (path: string) => {
    const updatedTemplates = await ipcRenderer.invoke('templates:get', path);

    setTemplates(updatedTemplates);
    if (
      undefined === currentTemplate ||
      undefined === updatedTemplates.find((updatedTemplate: Template) => updatedTemplate.name === currentTemplate.name)
    ) {
      setCurrentTemplate(updatedTemplates[0]);
    }
  }, []);

  const writeTemplate = useCallback(async (template: Template) => {
    await ipcRenderer.invoke('templates:write', template);
  }, []);

  const updateTemplates = useCallback(() => preferences.logoDirectory && getTemplates(preferences.logoDirectory), [
    preferences,
  ]);

  const generateRender = useCallback(async (render: Render) => {
    return await ipcRenderer.invoke('templates:generate', render);
  }, []);

  const setCurrentTemplateByName = useCallback(
    (name: string) => {
      setCurrentTemplate(templates.find((template: Template) => name === template.name));
    },
    [setCurrentTemplate, templates]
  );

  useEffect(() => {
    if (undefined !== preferences.logoDirectory) {
      getTemplates(preferences.logoDirectory);
    }
  }, [preferences.logoDirectory, getTemplates]);

  return [templates, currentTemplate, setCurrentTemplateByName, updateTemplates, writeTemplate, generateRender];
};

export {useTemplates};
export type {Template};
