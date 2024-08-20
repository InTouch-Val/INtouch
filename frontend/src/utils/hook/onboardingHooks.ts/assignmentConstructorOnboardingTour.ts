import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import getAssignmentConstructorSteps from "../../../service/onboarding/steps/assignmentConstructorSteps/assignmentConstructorSteps";
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useConstructorOnboardingTour = () => {

  useEffect(() => {
    const tourFlag = localStorage.getItem("constructorOnboardingTourShown");

    if (!tourFlag) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "shadow-md bg-purple-dark shepherd-theme-custom",
          scrollTo: false,
        },
      });

      const steps = getAssignmentConstructorSteps();
      steps.forEach((step) => tour.addStep(step));

      tour.start();

      tour.on("complete", () => {
        localStorage.setItem("constructorOnboardingTourShown", "true");
      });

      tour.on("cancel", () => {
        localStorage.setItem("constructorOnboardingTourShown", "true");
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
// localStorage.removeItem("constructorOnboardingTourShown"); 

//hook for testing in browser. Usage: run "window.launchConstructorOnboardingTour()" in console to launch onboarding tour
window.launchConstructorOnboardingTour = () => {
  localStorage.removeItem("constructorOnboardingTourShown");

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-theme-custom",
      scrollTo: false,
    },
  });

  const steps = getAssignmentConstructorSteps();
  steps.forEach((step) => tour.addStep(step));

  tour.start();
};

export default useConstructorOnboardingTour;
