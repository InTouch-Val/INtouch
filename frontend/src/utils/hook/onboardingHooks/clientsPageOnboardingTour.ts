import useOnboardingTour from "./useOnboardingTour";
import getClientsPageSteps from "../../../service/onboarding/steps/clientsPageSteps/clientsPageSteps";

const useClientsPageOnboardingTour = (hasClients: boolean) => {
  useOnboardingTour(
    "clientsOnboardingTourShown",
    getClientsPageSteps,
    hasClients,
  );
};

// For manual testing, run in console: window.launchClientsOnboardingTour()
window.launchClientsOnboardingTour = () => {
  window.launchOnboardingTour(
    "clientsOnboardingTourShown",
    getClientsPageSteps,
  );
};

export default useClientsPageOnboardingTour;
