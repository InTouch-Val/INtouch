import { User } from "../service/authContext";

declare global {
  interface Window {
    launchOnboardingTour: () => void;
    currentUser: User | null;
  }
}