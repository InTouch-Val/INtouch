import Shepherd, { StepOptions, PopperPlacement } from "shepherd.js";
import { User } from "../authContext";

const getAssignmentsSteps = (currentUser: User | null): StepOptions[] => [
  {
    id: "welcome",
    text: `
    <div> <img style="width: 100px; height: 100px; margin-bottom: 20px;"/></div>
      <div style="margin-bottom: 30px;">Hi ${currentUser ? currentUser.first_name : "there"}!</div>
      <div>Welcome to INtouch!</div>
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
    text: "Library contains all published assignments made by you or your colleagues",
    attachTo: {
      element: ".tabs #onboarding_library",
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
    text: "You will find the assignments you bookmarked here in Favorites",
    attachTo: {
      element: ".tabs #onboarding_favorites",
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
    text: "You will find your drafts and your published assignments in My tasks",
    attachTo: {
      element: ".tabs #onboarding_my_tasks",
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
    text: "You can add your first assignment here",
    attachTo: {
      element: ".assignments-page #onboarding_add_assignment",
      on: "left" as PopperPlacement,
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
    text: "Let's have a closer look at the assignments in the library",
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
    text: "To add an assignment to Favorites, click on the bookmark icon",
    attachTo: {
      element: ".assignment-grid .first-assignment .favorite-button",
      on: "right-start" as PopperPlacement,
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
    text: "Use this icon to share the assignment with your client",
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
    text: "This number shows how many times the assignment was shared",
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
    text: "Clients can rate the assignments they get. An average rating is shown here. ",
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
