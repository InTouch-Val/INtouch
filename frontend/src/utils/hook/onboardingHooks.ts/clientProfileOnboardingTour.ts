import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import getClientProfileSteps from "../../../service/onboarding/steps/clientProfileSteps/clientProfileSteps";
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useClientProfileOnboardingTour = () => {
  useEffect(() => {
    const tourFlag = localStorage.getItem("clientProfileOnboardingTourShown");

    if (!tourFlag) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "shadow-md bg-purple-dark shepherd-theme-custom",
          scrollTo: false,
        },
      });

      const steps = getClientProfileSteps();
      steps.forEach((step) => tour.addStep(step));

      tour.start();

      tour.on("complete", () => {
        localStorage.setItem("clientProfileOnboardingTourShown", "true");
      });

      tour.on("cancel", () => {
        localStorage.setItem("clientProfileOnboardingTourShown", "true");
      });

      return () => {
        if (tour) {
          tour.complete();
        }
      };
    }
  }, []);
};

// uncomment for local testing
// localStorage.removeItem("clientProfileOnboardingTourShown");

//hook for testing in browser. Usage: run "window.launchClientProfileOnboardingTour()" in console to launch onboarding tour
window.launchClientProfileOnboardingTour = () => {
  localStorage.removeItem("clientProfileOnboardingTourShown");

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-theme-custom",
      scrollTo: false,
    },
  });

  const steps = getClientProfileSteps();
  steps.forEach((step) => tour.addStep(step));

  tour.start();
};

export default useClientProfileOnboardingTour;
