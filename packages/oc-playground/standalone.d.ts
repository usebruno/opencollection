declare global {
  interface Window {
    OpenCollectionPlayground: {
      render: (container: HTMLElement, props) => void;
      unmount: (container: HTMLElement) => void;
    };
  }
}

export const OpenCollectionPlayground: {
  render: (container: HTMLElement, props) => void;
  unmount: (container: HTMLElement) => void;
};

export default OpenCollectionPlayground; 