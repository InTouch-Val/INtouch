import Shepherd, { PopperPlacement } from "shepherd.js";
import "../../custom-shepherd-styles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyAssignmentConstructorTexts.json";

<<<<<<< HEAD
const getAssignmentConstructorSteps = (
  isMobileWidth: boolean = false,
): StepOptions[] => [
=======
const getAssignmentConstructorSteps = () => [
>>>>>>> master
  {
    id: "constructorFillIn",
    text: onboardingTexts.constructorFillIn.description,
    attachTo: {
      element: ".assignments-page #onboarding-constructorFillIn",
      on: "top-start" as PopperPlacement,
    },
    classes: "constructorFillIn",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "constructorQuestionTypes",
    text: onboardingTexts.constructorQuestionTypes.description,
    attachTo: {
      element: ".assignments-page #onboarding-constructorQuestionTypes",
      on: "top" as PopperPlacement,
    },
    classes: "constructorQuestionTypes",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "constructorPreview",
    text: onboardingTexts.constructorPreview.description,
    attachTo: {
      element: ".headerAssignment #onboarding-constructorPreview",
<<<<<<< HEAD
      on: isMobileWidth ? "bottom" : ("left" as PopperPlacement),
=======
      on: "left" as PopperPlacement,
>>>>>>> master
    },
    classes: "constructorPreview",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "constructorDraft",
    text: onboardingTexts.constructorDraft.description,
    attachTo: {
      element: ".assignments-page #onboarding-constructorDraft",
      on: "top-start" as PopperPlacement,
    },
    classes: "constructorDraft",
    buttons: [
      {
        text: "",
        action: () => Shepherd.activeTour?.next(),
        classes: "shepherd-button-icon",
      },
    ],
  },

  {
    id: "constructorPublish",
    text: onboardingTexts.constructorPublish.description,
    attachTo: {
      element: ".assignments-page #onboarding-constructorPublish",
      on: "top-start" as PopperPlacement,
    },
    classes: "constructorPublish",
    buttons: [
      {
        text: "OK",
        action: () => Shepherd.activeTour?.complete(),
        classes: "shepherd-complete-button",
      },
    ],
  },
];

export default getAssignmentConstructorSteps;
