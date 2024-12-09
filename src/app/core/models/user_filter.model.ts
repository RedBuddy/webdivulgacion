export interface User_filter {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string | null;
  university?: string;
  faculty?: string;
  department?: string;
  publications_count: number;
}
