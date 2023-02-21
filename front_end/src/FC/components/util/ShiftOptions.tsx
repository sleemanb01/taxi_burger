import React from "react";
import Button from "@mui/material/Button";
import { HandlerFuncType } from "../../../types/types";
import { TXT_VIEW } from "../../../util/txt";
import { DatePicker } from "./UIElements/DatePicker";

export function ShiftOptions({
  closeStepperHandler,
}: {
  closeStepperHandler: HandlerFuncType;
}) {
  return (
    <React.Fragment>
      <DatePicker />
      <Button variant="text" color="info" onClick={closeStepperHandler}>
        {TXT_VIEW}
      </Button>
    </React.Fragment>
  );
}
