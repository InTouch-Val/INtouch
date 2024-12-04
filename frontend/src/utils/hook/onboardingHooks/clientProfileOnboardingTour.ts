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
>>>>>>> 964b4b468a904674618da8015bccc1d1f5cea286
};

// For manual testing, run in console: window.launchClientProfileOnboardingTour()
window.launchClientProfileOnboardingTour = () => {
  window.launchOnboardingTour(
    "clientProfileOnboardingTourShown",
    getClientProfileSteps,
  );
};

export default useClientProfileOnboardingTour;
