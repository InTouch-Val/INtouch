export const menuActive = [
  {
    id: 1,
    text: "All clients",
    status: "All clients",
  },
  {
    id: 2,
    text: "Active",
    status: "true",
  },
  {
    id: 3,
    text: "Not active",
    status: "false",
  },
];

export const menuDate = [
  { id: 1, text: `Date ▼`, status: "Date up" },
  { id: 2, text: "Date ▲", status: "Date down" },
];

export const minMobWidth = 320;
export const maxMobWidth = 480;
export const maxLengthTitle = 50;
export const maxLengthDescription = 300;

export const maxTextLegthBig = 3000;

export enum Status {
  Success = "success",
  Init = "init",
  Loading = "loading",
  Error = "error",
}

export enum TypeLanguage {
  All = "all",
  En = "en",
  Es = "es",
  Fr = "fr",
  De = "de",
  It = "it",
}

export enum AssignmentTab {
  library = "library",
  favorites = "favorites",
  myList = "my-list",
}

export enum TypeIssue {
  all = "all",
  Anxiety = "Anxiety",
  Depression = "Depression",
  RelationshipIssues = "Relationship lssues",
  Stress = "Stress",
  SelfEsteem = "Self-Esteem",
  TraumaAndPTSR = "Trauma and PTSR",
  Addiction = "Addiction",
  GriefAndLoss = "Grief and Loss ",
  LifeTransitions = "Life Transitions",
  IdentityAndPurpose = "Identity and Purpose",
  Other = "Other",
}

export enum TypeOrder {
  All = "all",
  AddDate = "add_date",
  DecDate = "-add_date",
  Popularity = "share",
  NoPopularity = "-share",
  AverageGrade = "average grade",
  NoAverageGrade = "-average_grade",
}

export enum TypeFilter {
  All = "all",
  Lesson = "lesson",
  Exercise = "exercise",
  Essay = "essay",
  Metaphor = "metaphor",
  Study = "study",
  Quiz = "quiz",
  Methodology = "methodology",
  Article = "article",
}

export enum BlockType {
  Text = "text",
  Range = "range",
  Question = "question",
  Image = "image",
  Open = "open",
}

export const DIARY_MAX_LENGTH = 1000;
