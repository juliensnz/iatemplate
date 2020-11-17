import React, {createContext, useCallback, useEffect, useState} from 'react';
import {Progress} from '../../common/model/progress';
import {ProgressView} from '../components/ProgressView';
const {ipcRenderer} = window.require('electron');

const ProgressContext = createContext<{
  progress: Progress | null;
}>({
  progress: null,
});

const useProgress = () => {
  const [progress, setProgress] = useState<Progress | null>(null);

  const updateProgress = useCallback(
    (event: any, updatedProgress: any) => {
      setProgress(updatedProgress);
    },
    [setProgress]
  );

  useEffect(() => {
    ipcRenderer.on('progress:update', updateProgress);

    return () => {
      ipcRenderer.removeListener('progress:update', updateProgress);
    };
  });

  return [progress] as const;
};

const ProgressProvider = ({children}: {children: any}) => {
  const [progress] = useProgress();

  return (
    <ProgressContext.Provider value={{progress}}>
      {children}
      {null !== progress && <ProgressView progress={progress} />}
    </ProgressContext.Provider>
  );
};

export {ProgressContext, useProgress, ProgressProvider};
