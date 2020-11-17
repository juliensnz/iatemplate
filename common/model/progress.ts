type Progress = {
  current: number;
  total: number;
  error: string | null;
  currentStep: string | null;
  isRunning: boolean;
};

const createProgress = (total: number): Progress => {
  return {current: 0, total, error: '', currentStep: '', isRunning: true};
};

const advanceProgress = (progress: Progress, currentStep: string): Progress => ({
  ...progress,
  current: progress.current + 1,
  currentStep,
});

const finishProgress = (progress: Progress) => ({
  ...progress,
  current: progress.total,
  isRunning: false,
});

const encounterError = (progress: Progress, error: string): Progress => ({
  ...progress,
  error,
  isRunning: false,
});

export {createProgress, advanceProgress, encounterError, finishProgress};
export type {Progress};
