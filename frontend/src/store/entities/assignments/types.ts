export type AssignmentsType = {
  id: number;
  title: string;
  text: string;
  update_date: string;
  add_date: string;
  assignment_type: string;
  status: string;
  tags: string;
  language: string;
  share: number;
  image_url: string;
  blocks: any;
  author: number;
  author_name: string;
  user: number;
  visible: boolean;
  grade: string | null;
  review: string;
  assignment_root: number;
};

export type AssignmentsResponseType = {
  results: AssignmentsType[];
  items: number;
  next: string;
  previous: string;
};

export type AssignmentCreateRequestType = {
  id: number;
  title: string;
  text: string;
  update_date: string;
  add_date: string;
  assignment_type: string;
  status: string;
  tags: string;
  language: string;
  share: number;
  image_url: string;
  blocks: any;
  author: number;
  author_name: string;
  user: number;
  visible: boolean;
  grade: string | null;
  review: string;
  assignment_root: number;
};

export type AssignmentUpdateRequestType = {
  uuid: string;
  body: AssignmentCreateRequestType;
};

export type ClientDiary = {
  add_date: string;
  author: number;
  author_name: string;
  clarifying_emotion: string[];
  emotion_type: string; // Raw JSON string
  emotion_type_tags: string;
  event_details: string; // Raw JSON string
  event_details_tags: string;
  id: number;
  physical_sensations: string; // Raw JSON string
  physical_sensations_tags: string;
  primary_emotion: string;
  thoughts_analysis: string; // Raw JSON string
  thoughts_analysis_tags: string;
  visible: boolean;
}

export type ClientDiaryEntry = {
  answer_emotion: any;
  clarifying_emotion: string[];
  emotion_type: string;
  event_details: string;
  physical_sensations: string;
  primary_emotion: string;
  thoughts_analysis: string;
  visible: boolean;
}
