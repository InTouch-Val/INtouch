//@ts-nocheck

import React from "react";

export const useObserve = (ref, isTotal = false, callback, isSuccess) => {
  const observer = React.useRef();
  React.useLayoutEffect(() => {
    if(!ref) return;
    const cb = (entries, observer) => {
      if (entries[0].isIntersecting) {
        callback();
        if (isTotal) {
          observer.current.disconnect();
        }
      }
    };

    if (!isTotal && !isSuccess) {
      observer.current = new IntersectionObserver(cb);
      observer.current.observe(ref.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref, isTotal, callback]);
};