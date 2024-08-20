import Shepherd, { PopperPlacement } from "shepherd.js";
import "../../custom-shepherd-styles.scss";
import onboardingTexts from "../../onboardingTextsSteps/psyAssignmentConstructorTexts.json";
import "./assignmentConstructorStyles.scss";

const getAssignmentConstructorSteps = () => [
  {
    id: "constructorFillIn",
    text: onboardingTexts.constructorFillIn.description,
    attachTo: {
      element: ".assignments-page #constructor-onboarding",
      on: "top" as PopperPlacement,
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
      element: ".assignments-page #constructor-types-onboarding",
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
      element: ".headerAssignment #constructor-onboarding-preview",
      on: "left" as PopperPlacement,
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
      element: ".assignments-page #constructor-draft-onboarding",
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
      element: ".assignments-page #constructor-publish-onboarding",
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
