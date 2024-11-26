import Shepherd, { StepOptions, PopperPlacement } from "shepherd.js";
import { User } from "../../../authContext";
import welcomeIcon from "../../assets/welcome-icon.svg";
import "../../custom-shepherd-styles.scss";
import "./assignmentsStyles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyAssignmentsTexts.json";

<<<<<<< HEAD
const getAssignmentsSteps = (
  currentUser: User | null,
  isMobileWidth: boolean = false,
): StepOptions[] => [
=======
const getAssignmentsSteps = (currentUser: User | null): StepOptions[] => [
>>>>>>> master
  {
    id: "welcome",
    text: `
    <div><img src="${welcomeIcon}" alt="${onboardingTexts.welcome.imageAlt}" class="welcome-icon"/></div>
    <div class="welcome-message">${onboardingTexts.welcome.greeting}${currentUser ? `, ${currentUser.first_name}` : onboardingTexts.welcome.greetingFallback}!</div>
    <div>${onboardingTexts.welcome.welcomeMessage}</div>
  `,
    classes: "welcome",
    buttons: [
      {
        text: "Let’s start!",
        action: () => Shepherd.activeTour?.next(),
      },
    ],
  },
  {
    id: "library",
    text: onboardingTexts.library.description,
    attachTo: {
      element: ".tabs #onboarding-library",
      on: "bottom" as PopperPlacement,
    },
    classes: "library",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "favorites",
    text: onboardingTexts.favorites.description,
    attachTo: {
      element: ".tabs #onboarding-favorites",
      on: "bottom" as PopperPlacement,
    },
    classes: "favorites",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "my-tasks",
    text: onboardingTexts.myTasks.description,
    attachTo: {
      element: ".tabs #onboarding-my-tasks",
      on: "bottom" as PopperPlacement,
    },
    classes: "my-tasks",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "add-assignment",
    text: onboardingTexts.addAssignment.description,
    attachTo: {
      element: ".assignments-page #onboarding-add-assignment",
<<<<<<< HEAD
      on: isMobileWidth ? "bottom-end" : ("left" as PopperPlacement),
=======
      on: "left" as PopperPlacement,
>>>>>>> master
    },
    classes: "add-assignment",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "all-assignment-intro",
    text: onboardingTexts.allAssignmentIntro.description,
    attachTo: {
      element: ".onboarding-psy-step",
      on: "top" as PopperPlacement,
    },
    classes: "all-assignment-intro",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "add-favourite",
    text: onboardingTexts.addFavourite.description,
    attachTo: {
      element: ".assignment-grid .first-assignment .favorite-button",
<<<<<<< HEAD
      on: isMobileWidth ? "bottom-end" : ("right-start" as PopperPlacement),
=======
      on: "right-start" as PopperPlacement,
>>>>>>> master
    },
    classes: "add-favourite",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "share-assignment",
    text: onboardingTexts.shareAssignment.description,
    attachTo: {
      element:
        ".assignment-grid .first-assignment .assignment-actions__share-with-client",
      on: "top-start" as PopperPlacement,
    },
    classes: "share-assignment-onboarding",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "shared-times",
    text: onboardingTexts.sharedTimes.description,
    attachTo: {
      element:
        ".assignment-grid .first-assignment .assignment-actions__statistics.assignment-actions__statistics_shares",
      on: "top-start" as PopperPlacement,
    },
    classes: "shared-times",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "assignment-rating",
    text: onboardingTexts.assignmentRating.description,
    attachTo: {
      element:
        ".assignment-grid .first-assignment .assignment-actions__statistics_grades",
      on: "top-start" as PopperPlacement,
    },
    classes: "assignment-rating",
    buttons: [
      {
        text: "OK",
        action: () => Shepherd.activeTour?.complete(),
        classes: "shepherd-complete-button",
      },
    ],
  },
];

export default getAssignmentsSteps;
