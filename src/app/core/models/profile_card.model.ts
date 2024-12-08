export interface UserCard {
  first_name: string;
  last_name: string;
  email: string;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string;
  university?: string;
  faculty?: string;
  orcid?: string;
  google_scholar_link?: string;
  research_gate_link?: string;
}