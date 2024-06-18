export interface Block {
  id: number;
  type: string;
  content?: any;
  description?: string;
  choices?: string[];
  title?: string;
  choice_replies?: { reply: string; checked: boolean }[];
  minValue?: number;
  maxValue?: number;
  leftPole?: string;
  rightPole?: string;
  image?: string | null;
}

export interface AssignmentData {
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
  blocks: Block[];
  author: number;
  author_name: string;
  user: number;
  visible: boolean;
  grade: string | null;
  review: string;
  assignment_root: number;
}

export interface BlocksState {
  blocks: Block[];
}

export type AddBlockAction = {
  type: "ADD_BLOCK";
  payload: { type: string };
};

export type RemoveBlockAction = {
  type: "REMOVE_BLOCK";
  payload: { blockId: number };
};

export type UpdateBlockAction = {
  type: "UPDATE_BLOCK";
  payload: {
    blockId: number;
    newContent?: any;
    newChoices?: string[];
    newTitle?: string;
    newMinValue?: number;
    newMaxValue?: number;
    newLeftPole?: string;
    newRightPole?: string;
    newImage?: string | null;
  };
};

export interface UpdateFormPayload {
  title?: string;
  description?: string;
  type?: string;
  language?: string;
  selectedImage?: File | null;
  successMessage?: boolean;
  successMessageText?: string;
  selectedImageForBlock?: { file: File | null; url: string | null };
  isChangeView?: boolean;
  isError?: boolean;
}

export interface FormState {
  title: string;
  description: string;
  type: string;
  language: string;
  selectedImage: File | null;
  successMessage: boolean;
  successMessageText: string;
  selectedImageForBlock: {
    file: File | null;
    url: string | null;
  };
  isChangeView: boolean;
  isError: boolean;
}

export type BlocksActions =
  | AddBlockAction
  | RemoveBlockAction
  | UpdateBlockAction;
