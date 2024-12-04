import Shepherd, { PopperPlacement } from "shepherd.js";
import "../../custom-shepherd-styles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyClientsProfileTexts.json";

<<<<<<< HEAD
const getClientProfileSteps = (
  isMobileWidth: boolean = false,
): StepOptions[] => [
=======
const getClientProfileSteps = () => [
>>>>>>> 964b4b468a904674618da8015bccc1d1f5cea286
  {
    id: "clientProfile",
    text: onboardingTexts.clientProfile.description,
    attachTo: {
      element: ".client-detail-page #client-profile-onboarding",
<<<<<<< HEAD
      on: isMobileWidth ? "bottom-end" : ("right" as PopperPlacement),
=======
      on: "right" as PopperPlacement,
>>>>>>> 964b4b468a904674618da8015bccc1d1f5cea286
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
