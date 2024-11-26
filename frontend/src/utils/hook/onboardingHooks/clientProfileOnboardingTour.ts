import useOnboardingTour from "./useOnboardingTour";
import getClientProfileSteps from "../../../service/onboarding/steps/clientProfileSteps/clientProfileSteps";

const useClientProfileOnboardingTour = () => {
<<<<<<< HEAD
  const isMobileWidth = useMobileWidth();

  useOnboardingTour("clientProfileOnboardingTourShown", () =>
    getClientProfileSteps(isMobileWidth),
  );
=======
  useOnboardingTour("clientProfileOnboardingTourShown", getClientProfileSteps);
>>>>>>> master
};

// For manual testing, run in console: window.launchClientProfileOnboardingTour()
window.launchClientProfileOnboardingTour = () => {
  window.launchOnboardingTour(
    "clientProfileOnboardingTourShown",
    getClientProfileSteps,
  );
};

export default useClientProfileOnboardingTour;
