import { EReducerActionType, EValidatorType } from "../typing/enums";
import {
  reducerInputAction,
  reducerFormState,
  reducerInputState,
  reducerFormAction,
} from "../typing/types";
import { VALIDATE } from "../util/validators";

/* ************************************************************************************************** */

export const reducerInputStateInitVal: reducerInputState = {
  value: "",
  isTouched: false,
  isValid: false,
};

export const inputReducer = (
  state: reducerInputState,
  action: reducerInputAction
) => {
  switch (action.type) {
    case EReducerActionType.CHNAGE: {
      let newVal = action.val;

      return {
        ...state,
        value: newVal,
        isValid: VALIDATE(newVal, action.validators as EValidatorType[]),
      };
    }
    case EReducerActionType.TOUCH: {
      return { ...state, isTouched: true };
    }
    default: {
      return state;
    }
  }
};

/* ************************************************************************************************** */

export const reducerFormStateInitVal: reducerFormState = {
  inputs: {
    name: reducerInputStateInitVal,
    categoryId: reducerInputStateInitVal,
    quantity: reducerInputStateInitVal,
    image: reducerInputStateInitVal,
  },
  isValid: false,
};

export const reducerFormStateCategoriesInitVal: reducerFormState = {
  inputs: {
    name: reducerInputStateInitVal,
  },
  isValid: false,
};

export const formReducer = (
  state: reducerFormState,
  action: reducerFormAction
) => {
  switch (action.type) {
    case EReducerActionType.CHNAGE: {
      action.input = action.input as reducerInputState;
      let formIsVlaid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsVlaid = formIsVlaid && action.input.isValid;
        } else {
          formIsVlaid =
            formIsVlaid && (state.inputs[inputId] as reducerInputState).isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId as string]: {
            value: action.input.value,
            isValid: action.input.isValid,
          },
        },
        isValid: formIsVlaid,
      };
    }
    case EReducerActionType.SET: {
      action.input = action.input as reducerFormState;
      return { inputs: action.input.inputs, isValid: action.input.isValid };
    }
    default: {
      return state;
    }
  }
};
