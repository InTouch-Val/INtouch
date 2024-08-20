import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import getClientsPageSteps from "../../../service/onboarding/steps/clientsPageSteps/clientsPageSteps";
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useClientsPageOnboardingTour = (hasClients: boolean) => {
  useEffect(() => {
    if (hasClients) {
      const tourFlag = localStorage.getItem("clientsOnboardingTourShown");

      if (!tourFlag) {
        const tour = new Shepherd.Tour({
          useModalOverlay: true,
          defaultStepOptions: {
            classes: "shadow-md bg-purple-dark shepherd-theme-custom",
            scrollTo: false,
          },
        });

        const steps = getClientsPageSteps();
        steps.forEach((step) => tour.addStep(step));

        tour.start();

        tour.on("complete", () => {
          localStorage.setItem("clientsOnboardingTourShown", "true");
        });

        tour.on("cancel", () => {
          localStorage.setItem("clientsOnboardingTourShown", "true");
        });

        return () => {
          if (tour) {
            tour.complete();
          }
        };
      }
    }
  }, [hasClients]);
};

// uncomment for local testing
// localStorage.removeItem("clientsOnboardingTourShown");

//hook for testing in browser. Usage: run "window.launchClientsOnboardingTour()" in console to launch onboarding tour
window.launchClientsOnboardingTour = () => {
  localStorage.removeItem("clientsOnboardingTourShown");

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: "shadow-md bg-purple-dark shepherd-theme-custom",
      scrollTo: false,
    },
  });

  const steps = getClientsPageSteps();
  steps.forEach((step) => tour.addStep(step));

  tour.start();
};

export default useClientsPageOnboardingTour;
