import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import getAssignmentsSteps from "../../../service/onboarding/assignmentsSteps";
import { useAuth } from "../../../service/authContext";
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useAssignmentsOnboardingTour = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    window.currentUser = currentUser;
    const tourFlag = localStorage.getItem("onboardingTourShown");

    if (!tourFlag) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "shadow-md bg-purple-dark shepherd-theme-custom",
          scrollTo: false,
        },
      });

      const steps = getAssignmentsSteps(currentUser);
      steps.forEach((step) => tour.addStep(step));

      tour.start();

      tour.on("complete", () => {
        localStorage.setItem("onboardingTourShown", "true");
      });

      tour.on("cancel", () => {
        localStorage.setItem("onboardingTourShown", "true");
      });

      return () => {
        if (tour) {
          tour.complete();
        }
      };
    }
  }, [currentUser]);
};

// uncomment for local testing
// localStorage.removeItem("onboardingTourShown"); 

//hook for testing in browser. Usage: run "window.launchOnboardingTour();" in console to launch onboarding tour
window.launchOnboardingTour = () => {
  localStorage.removeItem("onboardingTourShown");

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-theme-custom",
      scrollTo: false,
    },
  });

  const steps = getAssignmentsSteps(window.currentUser);
  steps.forEach((step) => tour.addStep(step));

  tour.start();
};

export default useAssignmentsOnboardingTour;
