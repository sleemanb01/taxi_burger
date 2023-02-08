import { createContext, useCallback, useState } from "react";
import { IShift } from "../typing/interfaces";
import { ShiftCtx } from "../typing/types";

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

  //   const setShift = (shift: IShift | undefined) => {
  //     setTheShift(shift);
  //   };

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
