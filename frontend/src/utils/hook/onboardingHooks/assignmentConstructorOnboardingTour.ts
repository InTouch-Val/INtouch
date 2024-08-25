import useOnboardingTour from "./useOnboardingTour";
import getAssignmentConstructorSteps from "../../../service/onboarding/steps/assignmentConstructorSteps/assignmentConstructorSteps";

const useConstructorOnboardingTour = () => {
  useOnboardingTour(
    "constructorOnboardingTourShown",
    getAssignmentConstructorSteps
  );
};

//for manual testing run in console: window.launchConstructorOnboardingTour()
window.launchConstructorOnboardingTour = () => {
  window.launchOnboardingTour("constructorOnboardingTourShown", getAssignmentConstructorSteps);
};

export default useConstructorOnboardingTour;
