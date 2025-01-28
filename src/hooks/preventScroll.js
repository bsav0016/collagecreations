import { useEffect } from 'react';

const usePreventScroll = (condition) => {
  useEffect(() => {
    if (condition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [condition]);
};

export default usePreventScroll;