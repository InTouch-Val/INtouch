import useOnboardingTour from "./useOnboardingTour";
import getAssignmentsSteps from "../../../service/onboarding/steps/assignmentsSteps/assignmentsSteps";
import { useAuth } from "../../../service/authContext";

const useAssignmentsOnboardingTour = () => {
  const { currentUser } = useAuth();

  useOnboardingTour("onboardingTourShown", () =>
    getAssignmentsSteps(currentUser, isMobileWidth),
  );
};

//for manual testing run in console: window.launchAssignmentsOnboardingTour()
window.launchAssignmentsOnboardingTour = () => {
  window.launchOnboardingTour("onboardingTourShown", () =>
    getAssignmentsSteps(window.currentUser),
    getAssignmentsSteps(window.currentUser),
  );
};

export default useAssignmentsOnboardingTour;
