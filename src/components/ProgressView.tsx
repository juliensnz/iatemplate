import React from 'react';
import styled from 'styled-components';
import {Progress} from '../../common/model/progress';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10;
`;

const ProgressBar = styled.div`
  width: 60vw;
  height: 30px;
  border-radius: 30px;
  border: 1px solid white;
  overflow: hidden;
  margin: 10px;
`;
const Bar = styled.div<{value: number}>`
  width: ${props => props.value * 100}%;
  background: white;
  height: 100%;
  transition: width 1s ease-out;
`;
const Step = styled.div`
  color: white;
`;

const ProgressView = ({progress}: {progress: Progress}) => {
  if (!progress.isRunning) return null;

  return (
    <Container>
      <ProgressBar>
        <Bar value={progress.current / progress.total} />
      </ProgressBar>
      <Step>{progress.currentStep}</Step>
    </Container>
  );
};

export {ProgressView};
