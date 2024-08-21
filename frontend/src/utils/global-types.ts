import {
  RawDraftContentBlock,
  RawDraftContentState,
  ContentState,
} from "draft-js";

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
};

export type ClientDiaryEntry = {
  answer_emotion: any;
  clarifying_emotion: string[];
  emotion_type: string;
  event_details: string;
  physical_sensations: string;
  primary_emotion: string;
  thoughts_analysis: string;
  visible: boolean;
};

interface DiaryTextBlockEntry {
  description: string;
  question: string;
  type: "open";
}

export interface CharacterInfo {
  style: string[];
  entity: string | null;
}

interface ExtendedRawDraftContentBlock extends RawDraftContentBlock {
  characterList?: CharacterInfo[];
}

export interface ExtendedRawDraftContentState
  extends Omit<RawDraftContentState, "blocks"> {
  blocks: ExtendedRawDraftContentBlock[];
}

interface ChoiceReply {
  reply: string;
  checked: boolean;
  id: number;
}

interface AssignmentClientBlock {
  choice_replies: ChoiceReply[];
  description: string;
  end_range: number;
  id: number;
  image: string | null;
  initialDescription: string;
  left_pole: string;
  question: string;
  reply: string;
  right_pole: string;
  start_range: number;
  type: "open";
}

interface AssignmentConstructor {
  choice_replies: ChoiceReply[];
  choices: string[];
  content: ContentState;
  description: string;
  id: number;
  image: string | null;
  leftPole: string;
  maxValue: number;
  minValue: number;
  rightPole: string;
  title: string;
  type: "range";
}

export type Block =
  | AssignmentClientBlock
  | DiaryTextBlockEntry
  | AssignmentConstructor;

export interface ClientAssignmentCard {
  id: number;
  title: string;
  text: string;
  update_date: string;
  add_date: string;
  assignment_root: string | null;
  assignment_type: string;
  author: number;
  author_name: string;
  blocks: AssignmentClientBlock[];
  grade: number;
  image_url: string;
  language: string;
  review: string;
  share: number;
  status: string;
  tags: string;
  visible: boolean;
  user: number;
}
