import useOnboardingTour from "./useOnboardingTour";
import getClientProfileSteps from "../../../service/onboarding/steps/clientProfileSteps/clientProfileSteps";
import useMobileWidth from "../useMobileWidth";

const useClientProfileOnboardingTour = () => {

  const isMobileWidth = useMobileWidth();

  useOnboardingTour("clientProfileOnboardingTourShown", () => getClientProfileSteps(isMobileWidth));
};

// For manual testing, run in console: window.launchClientProfileOnboardingTour()
window.launchClientProfileOnboardingTour = () => {
  window.launchOnboardingTour(
    "clientProfileOnboardingTourShown",
    getClientProfileSteps,
  );
};

export default useClientProfileOnboardingTour;
