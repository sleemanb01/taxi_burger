import { EReducerActionType, EValidatorType } from "./enums";
import { ICategory, IStock, IUser } from "./interfaces";

export type AuthCtx = {
  isLoggedIn: boolean;
  user: userWToken | undefined;
  login: (user: userWToken) => void;
  updatePerson: (user: userWToken) => void;
  logout: () => void;
};

export type reducerInputState = {
  value: string;
  isTouched?: boolean;
  isValid: boolean;
};

export type reducerFormState = {
  inputs: {
    [id: string]: reducerInputState | undefined;
  };
  isValid: boolean;
};

export type reducerInputAction = {
  val: string;
  type: EReducerActionType;
  validators: EValidatorType[];
};

export type reducerFormAction = {
  type: EReducerActionType;
  input: reducerInputState | reducerFormState;
  inputId?: string;
};

export type userWToken = {
  id: string;
  email: string;
  token: string;
  isAdmin: boolean;
  tokenExpiration: Date;
};

export type StocksWCategories = {
  stocks: IStock[];
  categories: ICategory[];
};

export type partialStock = {
  quantity: IStock["quantity"];
  inUse: IStock["inUse"];
  lowQuantity: IStock["lowQuantity"];
};
