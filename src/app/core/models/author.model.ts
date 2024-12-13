export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string;
}