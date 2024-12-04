import useOnboardingTour from "./useOnboardingTour";
import getAssignmentsSteps from "../../../service/onboarding/steps/assignmentsSteps/assignmentsSteps";
import { useAuth } from "../../../service/authContext";

const useAssignmentsOnboardingTour = () => {
  const { currentUser } = useAuth();

  useOnboardingTour("onboardingTourShown", () =>
<<<<<<< HEAD
    getAssignmentsSteps(currentUser, isMobileWidth),
=======
    getAssignmentsSteps(currentUser),
>>>>>>> 964b4b468a904674618da8015bccc1d1f5cea286
  );
};

//for manual testing run in console: window.launchAssignmentsOnboardingTour()
window.launchAssignmentsOnboardingTour = () => {
  window.launchOnboardingTour("onboardingTourShown", () =>
    getAssignmentsSteps(window.currentUser),
  );
};

export default useAssignmentsOnboardingTour;
