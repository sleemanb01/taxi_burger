import { createContext, useCallback, useState } from "react";
import { IShift } from "../types/interfaces";
import { ShiftCtx } from "../types/types";

export const ShiftContext = createContext<ShiftCtx>({
  shift: null,
  setShift: () => {},
});

export const ShiftContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [shift, setTheShift] = useState<IShift | null>(null);

  const setShift = useCallback((shift: IShift | null) => {
    setTheShift(shift);
  }, []);

  const value: ShiftCtx = {
    shift,
    setShift,
  };

  return (
    <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>
  );
};
