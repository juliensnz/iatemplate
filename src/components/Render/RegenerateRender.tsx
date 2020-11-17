import {Restart20} from '@carbon/icons-react';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {Render, useGenerateRender} from '../../hooks/useRenders';
import {IconButton} from '../UI';

const RegenerateIcon = styled(Restart20)<{isLoading: boolean}>`
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  ${props => (props.isLoading ? 'animation: rotating 1s ease-in-out infinite' : '')}
`;

const RegenerateRender = ({render}: {render: Render}) => {
  const [isLoading, setIsLoading] = useState(false);
  const generateRender = useGenerateRender();

  const regenerateRender = useCallback(async () => {
    setIsLoading(true);
    generateRender(render);
    setTimeout(() => setIsLoading(false), 1000);
  }, [render, generateRender]);

  return (
    <IconButton onClick={regenerateRender}>
      <RegenerateIcon isLoading={isLoading} />
    </IconButton>
  );
};

export {RegenerateRender};
