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
>>>>>>> 964b4b468a904674618da8015bccc1d1f5cea286
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
