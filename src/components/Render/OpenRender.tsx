import {Launch20} from '@carbon/icons-react';
import React, {useCallback, useContext} from 'react';
import {Render} from '../../../common/model/render';
import {ElectronContext} from '../../context/ElectronContext';
import {IconButton} from '../UI';

const OpenRender = ({render}: {render: Render}) => {
  const {invoke} = useContext(ElectronContext);
  const onOpen = useCallback(() => {
    invoke('render:open', render);
  }, [render, invoke]);

  return (
    <IconButton onClick={onOpen}>
      <Launch20 />
    </IconButton>
  );
};

export {OpenRender};
