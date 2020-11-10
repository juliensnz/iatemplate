import {Renew20} from '@carbon/icons-react';
import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {IconButton} from './UI';

const RefreshIcon = styled(Renew20)<{isLoading: boolean}>`
  @keyframes rotating {
    from {
      transform: rotate(1080deg);
    }
    to {
      transform: rotate(0deg);
    }
  }

  ${props => (props.isLoading ? 'animation: rotating 2s ease-in-out infinite' : '')}
`;

const RefreshState = ({onRefresh}: {onRefresh: () => Promise<void>}) => {
  const [isLoading, setIsLoading] = useState(false);
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await onRefresh();
    setTimeout(() => setIsLoading(false), 2000);
  }, [onRefresh]);

  useEffect(() => {
    const interval = setInterval(refresh, 10 * 1000);

    return () => clearInterval(interval);
  }, [refresh, onRefresh]);

  return (
    <IconButton onClick={refresh}>
      <RefreshIcon isLoading={isLoading} />
    </IconButton>
  );
};

export {RefreshState};
