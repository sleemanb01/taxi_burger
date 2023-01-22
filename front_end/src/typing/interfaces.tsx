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
  categoryId:ICategory['_id'];
  name: string;
  quantity: number;
  inUse:boolean;
}

export interface ICategory {
  _id?: string;
  name: string;
}
