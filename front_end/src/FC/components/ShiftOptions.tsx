import React from "react";
import { DatePicker } from "./DatePicker";
import Button from "@mui/material/Button";
import { IShift } from "../../typing/interfaces";
type PickFuncType = (shift: IShift | null) => void;

export function ShiftOptions({ pickHandler }: { pickHandler: PickFuncType }) {
  const TXT_VIEW = "צפייה בנתונים";

  const clickHandler = () => {
    pickHandler(null);
  };

  return (
    <React.Fragment>
      <DatePicker />
      {/* <Button variant="text" color="error" onClick={() => clickHandler(false)}>
        {TXT_YESTERDAY_SHIFT}
      </Button> */}
      <Button variant="text" color="info" onClick={clickHandler}>
        {TXT_VIEW}
      </Button>
      {/* </Stack> */}
    </React.Fragment>
  );
}
