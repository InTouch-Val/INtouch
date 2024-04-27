import React from 'react';

export const useObserve = (ref, isTotal = false, callback) => {
  const observer = React.useRef();
  React.useEffect(() => {
    const cb = (entries, observer) => {
      if (entries[0].isIntersecting) {
        callback();
        if (isTotal) {
          observer.current.disconnect();
        }
      }
    };

    if (!isTotal) {
      observer.current = new IntersectionObserver(cb);
      observer.current.observe(ref.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isTotal]);
};
