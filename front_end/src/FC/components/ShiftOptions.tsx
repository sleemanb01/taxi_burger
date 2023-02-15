import React from "react";
import { DatePicker } from "../assest/UIElements/DatePicker";
import Button from "@mui/material/Button";
import { HandlerFuncType } from "../../types/types";
import { TXT_VIEW } from "../../util/txt";

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
