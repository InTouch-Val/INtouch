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

export enum Status {
  Success = "success",
  Init = "init",
  Loading = "loading",
  Error = "error",
}


export enum TypeLanguage {
  All = 'all',
  En = 'en',
  Es = 'es',
  Fr = 'fr',
  De = 'de',
  It = 'it'
}

export enum AssignmentTab  {
  library = "library",
  favorites = "favorites",
  myList = "my-list"
}


export enum TypeOrder {
  All = 'all',
  AddDate = 'add_date',
  DecDate = '-add_date',
  Popularity = 'average_grade',
  NoPopularity = '-average_grade'
}

export enum TypeFilter {
  All = 'all',
  Lesson = 'lesson',
  Exercise = 'exercise',
  Essay = 'essay',
  Metaphor = 'metaphor',
  Study = 'study',
  Quiz = 'quiz',
  Methodology = 'methodology',
  Metaphors = 'metaphors'
}
