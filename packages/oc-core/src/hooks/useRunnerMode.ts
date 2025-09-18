import { useState } from 'react';

export const useRunnerMode = () => {
  const [isRunnerMode, setIsRunnerMode] = useState(false);

  const toggleRunnerMode = () => {
    setIsRunnerMode(prev => !prev);
  };

  return {
    isRunnerMode,
    setIsRunnerMode,
    toggleRunnerMode
  };
}; 