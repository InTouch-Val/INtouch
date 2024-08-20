import { User } from "../service/authContext";

declare global {
  interface Window {
    launchOnboardingTour: () => void;
    launchClientProfileOnboardingTour: () => void;
    launchClientsOnboardingTour: () => void;
    launchConstructorOnboardingTour: () => void;
    currentUser: User | null;
  }
}