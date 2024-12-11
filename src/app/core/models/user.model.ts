export interface IUser {
  id?: number;
  username?: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  registration_date?: Date;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string | null;
  verified?: boolean;
  role_id?: number;
  status?: 'active' | 'inactive';
}

export interface IUser_data {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  registration_date: Date;
  profile_img?: {
    type: string;
    data: number[];
  };
  profile_img_url?: string | null;
  verified: boolean;
  role_id: number;
  status: 'active' | 'inactive';
}