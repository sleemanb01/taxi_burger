import React from "react";
import { DatePicker } from "./DatePicker";
import Button from "@mui/material/Button";
import { HandlerFuncType } from "../../typing/types";

export function ShiftOptions({
  closeStepperHandler,
}: {
  closeStepperHandler: HandlerFuncType;
}) {
  const TXT_VIEW = "צפייה בנתונים";

  return (
    <React.Fragment>
      <DatePicker />
      {/* <Button variant="text" color="error" onClick={() => clickHandler(false)}>
        {TXT_YESTERDAY_SHIFT}
      </Button> */}
      <Button variant="text" color="info" onClick={closeStepperHandler}>
        {TXT_VIEW}
      </Button>
      {/* </Stack> */}
    </React.Fragment>
  );
}
