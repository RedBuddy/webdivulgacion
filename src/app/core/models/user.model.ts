export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  orcid?: string;
  registration_date?: Date;
  profile_img?: Blob; // Actualizado a Blob
  verified?: boolean;
  role_id?: number;
  status?: 'active' | 'inactive';
}

// Ejemplo de uso
const user2: IUser = {
  // id is auto-incrementable and should not be manually assigned
  username: 'jane_doe',
  email: 'jane@example.com',
  password: 'password123',
  first_name: 'Jane',
  last_name: 'Doe',
  orcid: '0000-0001-2345-6789',
  registration_date: new Date(),
  profile_img: new Blob(), // Ejemplo de Blob
  verified: true,
  role_id: 1,
  status: 'active'
};

//Ejemplo de cuerpo de solicitud
const user1: IUser = {
  username: 'john_doe',
  email: 'john.doe@example.com',
  password: 'securepassword123',
  first_name: 'John',
  last_name: 'Doe',
  orcid: '0000-0002-1825-0097',
  profile_img: new Blob(), // Ejemplo de Blob
  role_id: 2,
  status: 'active'
};