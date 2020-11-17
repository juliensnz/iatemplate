import {Copy20} from '@carbon/icons-react';
import React, {useCallback, useContext} from 'react';
import {Template} from '../../../common/model/template';
import {ElectronContext} from '../../context/ElectronContext';
import {IconButton} from '../UI';

const DuplicateTemplate = ({template}: {template: Template | undefined}) => {
  const {invoke} = useContext(ElectronContext);
  const onDuplicate = useCallback(() => {
    if (undefined === template) return;

    const newName = prompt('What will be the new name for the duplicated template?', '');
    if ('' === newName) return;

    invoke('template:duplicate', {previousName: template.name, newName});
  }, [template, invoke]);

  return (
    <IconButton onClick={onDuplicate} title="Duplicate template">
      <Copy20 color="white" />
    </IconButton>
  );
};

export {DuplicateTemplate};
