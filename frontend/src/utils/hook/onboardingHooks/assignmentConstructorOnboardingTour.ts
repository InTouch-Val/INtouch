import useOnboardingTour from "./useOnboardingTour";
import getAssignmentConstructorSteps from "../../../service/onboarding/steps/assignmentConstructorSteps/assignmentConstructorSteps";
import useMobileWidth from "../useMobileWidth";

const useConstructorOnboardingTour = () => {
  const isMobileWidth = useMobileWidth();

  useOnboardingTour("constructorOnboardingTourShown", () =>
    getAssignmentConstructorSteps(isMobileWidth)
  );
};


//for manual testing run in console: window.launchConstructorOnboardingTour()
window.launchConstructorOnboardingTour = () => {
  window.launchOnboardingTour(
    "constructorOnboardingTourShown",
    getAssignmentConstructorSteps
  );
};

export default useConstructorOnboardingTour;
