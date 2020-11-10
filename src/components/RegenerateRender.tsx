import {Restart20} from '@carbon/icons-react';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {IconButton} from './UI';

const RegenerateIcon = styled(Restart20)<{isLoading: boolean}>`
  @keyframes rotating {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  ${props => (props.isLoading ? 'animation: rotating 1s ease-in-out infinite' : '')}
`;

const RegenerateRender = ({onRegenerate}: {onRegenerate: () => void}) => {
  const [isLoading, setIsLoading] = useState(false);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    onRegenerate();
    setTimeout(() => setIsLoading(false), 1000);
  }, [onRegenerate]);

  return (
    <IconButton onClick={refresh}>
      <RegenerateIcon isLoading={isLoading} />
    </IconButton>
  );
};

export {RegenerateRender};
