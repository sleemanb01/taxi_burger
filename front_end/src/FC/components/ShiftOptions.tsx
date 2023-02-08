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
      <Button variant="text" color="info" onClick={closeStepperHandler}>
        {TXT_VIEW}
      </Button>
    </React.Fragment>
  );
}
