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
  maxQuantity: number;
}

export interface ICategory {
  _id?: string;
  name: string;
}

export interface IClickOutsideProps {
  children: React.ReactNode;
  wrapperId?: string; // Id of our outside wrapper where we will listen for click
  listen: boolean; // Toggle to listen for click
  onClickOutside: () => void; //
}
