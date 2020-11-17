import {Settings20} from '@carbon/icons-react';
import React, {useCallback, useContext} from 'react';
import {ElectronContext} from '../context/ElectronContext';
import {IconButton} from './UI';

const ChangeTemplateDirectory = () => {
  const {invoke} = useContext(ElectronContext);
  const changeTemplateDirectory = useCallback(async () => {
    invoke('preferences:directory:update', {});
  }, []);

  return (
    <IconButton onClick={changeTemplateDirectory}>
      <Settings20 />
    </IconButton>
  );
};

export {ChangeTemplateDirectory};
