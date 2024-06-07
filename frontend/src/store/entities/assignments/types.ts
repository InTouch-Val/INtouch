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
  is_public: boolean;
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
