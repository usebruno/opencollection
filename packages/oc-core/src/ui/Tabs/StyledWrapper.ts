import styled from '@emotion/styled';

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .tabs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    flex-shrink: 0;
    
    .tab {
      border: none;
      border-bottom: solid 2px transparent;
      margin-right: 1rem;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      position: relative;
      background: none;
      padding-bottom: 6px;

      &:focus,
      &:active,
      &:focus-within,
      &:focus-visible,
      &:target {
        outline: none !important;
        box-shadow: none !important;
      }

      &:hover:not(.active) {
        color: var(--text-primary);
      }

      &.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .content-indicator {
        margin-left: 2px;
        font-size: 0.7em;
        color: var(--text-tertiary);
        font-weight: normal;
      }
    }
  }

  .tabs-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .tab-content {
    flex: 1;
    overflow: auto;
    min-height: 0;
  }
`;