import {Launch20} from '@carbon/icons-react';
import React, {useCallback, useContext} from 'react';
import {Template} from '../../../common/model/template';
import {ElectronContext} from '../../context/ElectronContext';
import {IconButton} from '../UI';

const OpenTemplate = ({template}: {template: Template | undefined}) => {
  const {invoke} = useContext(ElectronContext);
  const onOpen = useCallback(() => {
    if (undefined === template) return;

    invoke('template:open', {templateName: template.name});
  }, [template, invoke]);

  return (
    <IconButton onClick={onOpen} title="Open in Finder">
      <Launch20 color="white" />
    </IconButton>
  );
};

export {OpenTemplate};
