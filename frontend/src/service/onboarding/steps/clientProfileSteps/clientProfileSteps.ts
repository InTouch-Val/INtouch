import Shepherd, { PopperPlacement } from "shepherd.js";
import "../../custom-shepherd-styles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyClientsProfileTexts.json";

const getClientProfileSteps = () => [
  {
    id: "clientProfile",
    text: onboardingTexts.clientProfile.description,
    attachTo: {
      element: ".client-detail-page #client-profile-onboarding",
      on: "right" as PopperPlacement,
    },
    classes: "clientProfile",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "clientAssignments",
    text: onboardingTexts.clientAssignments.description,
    attachTo: {
      element: ".client-detail-page #client-assignments-onboarding",
      on: "bottom" as PopperPlacement,
    },
    classes: "clientAssignments",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "clientDiary",
    text: onboardingTexts.clientDiary.description,
    attachTo: {
      element: ".client-detail-page #client-diary-onboarding",
      on: "bottom-start" as PopperPlacement,
    },
    classes: "clientDiary",
    buttons: [
      {
        text: "OK",
        action: () => Shepherd.activeTour?.complete(),
        classes: "shepherd-complete-button",
      },
    ],
  },
];

export default getClientProfileSteps;
