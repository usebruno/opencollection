import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  background-color: var(--input-bg);
  border-top-left-radius: var(--oc-radius);
  border-bottom-left-radius: var(--oc-radius);
  border-top-right-radius: var(--oc-radius);
  border-bottom-right-radius: var(--oc-radius);
  border: 1px solid var(--border-color);

  select {
    background-color: transparent;
    outline: none;
    color: var(--text-primary);
  }

  input {
    outline: none;
    background-color: transparent;
    color: var(--text-primary);
    border-radius: 0;
    
    &::placeholder {
      color: var(--text-secondary);
    }
  }

  button.send {
    background-color: var(--primary-color);
    border-top-right-radius: var(--oc-radius);
    border-bottom-right-radius: var(--oc-radius);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 13px;
    text-transform: uppercase;
  }
`;