import useOnboardingTour from "./useOnboardingTour";
import getClientProfileSteps from "../../../service/onboarding/steps/clientProfileSteps/clientProfileSteps";

const useClientProfileOnboardingTour = () => {
  useOnboardingTour(
    "clientProfileOnboardingTourShown",
    getClientProfileSteps
  );
};

// For manual testing, run in console: window.launchClientProfileOnboardingTour()
window.launchClientProfileOnboardingTour = () => {
  window.launchOnboardingTour("clientProfileOnboardingTourShown", getClientProfileSteps);
};

export default useClientProfileOnboardingTour;
