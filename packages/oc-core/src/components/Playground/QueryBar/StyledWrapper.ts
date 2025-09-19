import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  background-color: rgb(243, 243, 243);
  border-top-left-radius: var(--oc-radius);
  border-bottom-left-radius: var(--oc-radius);
  border-top-right-radius: var(--oc-radius);
  border-bottom-right-radius: var(--oc-radius);

  select {
    background-color: transparent;
    outline: none;
  }

  input {
    outline: none;
    background-color: transparent;
    color: var(--oc-text-primary);
    border-radius: 0;
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