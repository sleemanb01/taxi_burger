export interface IUser {
  _id?: string;
  name?: string;
  code: string;
  email?: string;
  password?: string;
  image?: string;
  isAdmin?: boolean;
}

export interface IStock {
  _id?: string;
  categoryId: ICategory["_id"];
  name: string;
  quantity: number;
  inUse: boolean;
  image: string;
  minQuantity: number;
}

export interface ILack {
  _id?: string;
  name: string;
  quantity: number;
  image: string;
}

export interface ICategory {
  _id?: string;
  name: string;
}

export interface IUsage {
  stockId: IStock["_id"];
  quantity: number;
}

export interface IShift {
  _id?: string;
  date: Date;
  meat: number;
  bread: number;
  usages: IUsage[];
}

export interface IClickOutsideProps {
  children: React.ReactNode;
  wrapperId?: string; // Id of our outside wrapper where we will listen for click
  listen: boolean; // Toggle to listen for click
  onClickOutside: () => void; //
}
