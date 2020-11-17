import {useState, useEffect, useCallback} from 'react';
import {Preferences} from '../context/PreferenceContext';
import {Template} from '../../common/model/template';

const {ipcRenderer} = window.require('electron');

const useTemplates = (preferences: Preferences) => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | undefined>(undefined);

  const getTemplates = useCallback(
    async (path: string): Promise<void> => {
      const updatedTemplates = await ipcRenderer.invoke('template:get', path);

      setTemplates(updatedTemplates);
      if (
        undefined === currentTemplate ||
        undefined ===
          updatedTemplates.find((updatedTemplate: Template) => updatedTemplate.name === currentTemplate.name)
      ) {
        setCurrentTemplate(updatedTemplates[0]);
      }
    },
    [currentTemplate]
  );

  const updateTemplates = useCallback(async (): Promise<void> => {
    if (!preferences.logoDirectory) return;

    await getTemplates(preferences.logoDirectory);
  }, [preferences, getTemplates]);

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

  return [templates, currentTemplate, setCurrentTemplateByName, updateTemplates] as const;
};

export {useTemplates};
