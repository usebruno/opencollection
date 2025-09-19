import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface MethodProps {
  method: string;
  className?: string;
}

export const Method: React.FC<MethodProps> = ({ method, className = '' }) => {
  const normalizedMethod = method?.toLowerCase() || 'get';
  const displayMethod = method?.toUpperCase() === 'DELETE' ? 'DEL' : method?.toUpperCase() || 'GET';

  return (
    <StyledWrapper className={`${normalizedMethod} ${className}`}>
      {displayMethod}
    </StyledWrapper>
  );
};

export default Method;
