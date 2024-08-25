import { User } from "../service/authContext";

declare global {
  interface Window {
    launchOnboardingTour: (tourKey: string, getSteps: () => any[]) => void;
    launchConstructorOnboardingTour: () => void;
    launchAssignmentsOnboardingTour: () => void;
    launchClientProfileOnboardingTour: () => void;
    launchClientsOnboardingTour: () => void;
    currentUser: User | null;
  }
}
