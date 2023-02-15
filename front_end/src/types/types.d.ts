import { EReducerActionType, EValidatorType } from "./enums";
import { ICategory, IShift, IStock, IUser } from "./interfaces";

export type AuthCtx = {
  user: userWToken | undefined;
  updateUser: (user: userWToken) => void;
  login: (user: userWToken) => void;
  logout: () => void;
};

export type ShiftCtx = {
  shift: IShift | null;
  setShift: (shift: IShift | null) => void;
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
  name: string;
  token: string;
  tokenExpiration: Date;
};

export type StocksWCategories = {
  stocks: IStock[];
  categories: ICategory[];
};

export type partialStock = {
  quantity: IStock["quantity"];
  minQuantity: IStock["minQuantity"];
};

export type HandlerFuncType = () => void;

export type StocksWActions = {
  values: IStock[];
  setValues: Dispatch<SetStateAction<IStock[]>>;
  displayArray: string[];
  clickHandler: (id: string) => void;
};
