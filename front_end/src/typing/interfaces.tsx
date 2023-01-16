export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  isAdmin?: boolean;
}

export interface IStock {
  _id?: string;
  name: string;
  quantity: number;
  image: string;
}
