import { useEffect, useRef } from "react";
import Shepherd, { StepOptions, Tour } from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useOnboardingTour = (
  tourKey: string, // The key for localStorage
  getSteps: () => StepOptions[],
  condition: boolean = true,
) => {
  const tourRef = useRef<Tour | null>(null);

  useEffect(() => {
    if (condition) {
      const tourFlag = localStorage.getItem(tourKey);

      if (!tourFlag && !tourRef.current) {
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: "shadow-md bg-purple-dark shepherd-theme-custom",
            scrollTo: false,
          },
        });

        const steps = getSteps();
        steps.forEach((step) => tour.addStep(step));

        tourRef.current = tour;

        tour.start();

        tour.on("complete", () => {
          localStorage.setItem(tourKey, "true");
        });
      }

      return () => {
        if (tourRef.current) {
          tourRef.current.cancel();
          tourRef.current = null;
        }
      };
    }
  }, [tourKey, getSteps, condition]);
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