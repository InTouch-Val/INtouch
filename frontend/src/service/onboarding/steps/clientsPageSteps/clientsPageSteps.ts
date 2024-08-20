import Shepherd, { PopperPlacement } from "shepherd.js";
import "../../custom-shepherd-styles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyClientsTexts.json";
import "./clientsPageStyles.scss";


const getClientsPageSteps = () => [
  {
    id: "clientsName",
    text: onboardingTexts.clientsName.description,
    attachTo: {
      element: ".clients-list #clients-name-onboarding",
      on: "bottom-start" as PopperPlacement,
    },
    classes: "clientsName",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },
  {
    id: "clientsStatus",
    text: onboardingTexts.clientsStatus.description,
    attachTo: {
      element: ".clients-list #clients-status-onboarding",
      on: "bottom" as PopperPlacement,
    },
    classes: "clientsStatus",
    buttons: [
      {
        text: "OK",
        action: () => Shepherd.activeTour?.complete(),
        classes: "shepherd-complete-button",
      },
    ],
  },
];

export default getClientsPageSteps;
