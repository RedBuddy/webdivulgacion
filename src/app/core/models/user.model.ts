export interface IUser {
  id?: number;
  username?: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  registration_date?: Date;
  profile_img?: Blob; // Actualizado a Blob
  verified?: boolean;
  role_id?: number;
  status?: 'active' | 'inactive';
}
