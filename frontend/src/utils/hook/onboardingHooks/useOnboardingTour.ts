import { useEffect } from "react";
import Shepherd, { StepOptions } from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../../service/onboarding/custom-shepherd-styles.scss";
import useMobileWidth from "../useMobileWidth";

const useOnboardingTour = (
  tourKey: string, // The key for localStorage
  getSteps: () => StepOptions[],
  condition: boolean = true,
) => {
  const isMobileWidth = useMobileWidth();
  useEffect(() => {
    if (condition && !isMobileWidth) {
      const tourFlag = localStorage.getItem(tourKey);

      if (!tourFlag) {
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: "shadow-md bg-purple-dark shepherd-theme-custom",
            scrollTo: false,
          },
        });

        const steps = getSteps();
        steps.forEach((step) => tour.addStep(step));

        tour.start();

        tour.on("complete", () => {
          localStorage.setItem(tourKey, "true");
        });

        tour.on("cancel", () => {
          localStorage.setItem(tourKey, "true");
        });

        return () => {
          if (tour) {
            tour.complete();
          }
        };
      }
    }
  }, [tourKey, getSteps, condition, isMobileWidth]);
};

//hook for testing in browser. Check usage in comments for each page scenario
window.launchOnboardingTour = (
  tourKey: string,
  getSteps: () => StepOptions[],
) => {
  localStorage.removeItem(tourKey);

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-theme-custom",
      scrollTo: false,
    },
  });

  const steps = getSteps();
  steps.forEach((step) => tour.addStep(step));

  tour.start();
};

export default useOnboardingTour;
