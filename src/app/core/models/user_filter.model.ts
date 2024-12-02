export interface User_filter {
  first_name: string;
  last_name: string;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string | null;
  user_disciplines: string[];
  publications_count: number;
}
