import useOnboardingTour from "./useOnboardingTour";
import getAssignmentConstructorSteps from "../../../service/onboarding/steps/assignmentConstructorSteps/assignmentConstructorSteps";

const useConstructorOnboardingTour = () => {
<<<<<<< HEAD
  const isMobileWidth = useMobileWidth();

  useOnboardingTour("constructorOnboardingTourShown", () =>
    getAssignmentConstructorSteps(isMobileWidth),
=======
  useOnboardingTour(
    "constructorOnboardingTourShown",
    getAssignmentConstructorSteps,
>>>>>>> master
  );
};

//for manual testing run in console: window.launchConstructorOnboardingTour()
window.launchConstructorOnboardingTour = () => {
  window.launchOnboardingTour(
    "constructorOnboardingTourShown",
    getAssignmentConstructorSteps,
  );
};

export default useConstructorOnboardingTour;
