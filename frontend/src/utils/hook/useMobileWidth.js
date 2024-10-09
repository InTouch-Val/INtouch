import { useState, useEffect } from "react";
import { maxMobWidth, minMobWidth } from "../constants.ts";

function useMobileWidth() {
  const [isMobileWidth, setIsMobileWidth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= minMobWidth && width <= maxMobWidth) {
        setIsMobileWidth(true);
      } else {
        setIsMobileWidth(false);
      }
    };

    // Sets the initial state based on the current window size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobileWidth;
}

export default useMobileWidth;
