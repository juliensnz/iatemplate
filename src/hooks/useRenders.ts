import {useState, useMemo, useEffect, useCallback, useContext} from 'react';
import {Preferences} from '../context/PreferenceContext';
import {Template} from '../../common/model/template';
import {ElectronContext} from '../context/ElectronContext';

const {ipcRenderer} = window.require('electron');

type Render = {
  identifier: string;
  name: string;
  template: string;
  data: {[key: string]: string};
};

const useRenders = (preferences: Preferences, currentTemplate: Template | undefined): [Render[]] => {
  const [renders, setRenders] = useState([]);

  const getRenders = useMemo(
    () => async (templateName: string, path: string) => {
      const updatedRenders = await ipcRenderer.invoke('render:get', {
        templateName,
        path,
      });

      setRenders(updatedRenders);
    },
    []
  );

  useEffect(() => {
    if (undefined !== currentTemplate && undefined !== preferences.logoDirectory) {
      getRenders(currentTemplate.name, preferences.logoDirectory);
    }
  }, [currentTemplate, preferences, getRenders]);

  return [renders];
};

const useGenerateRender = () => {
  const {send} = useContext(ElectronContext);

  return useCallback(
    async (render: Render) => {
      await send('render:generate', {render});
    },
    [send]
  );
};

export {useRenders, useGenerateRender};
export type {Render};
