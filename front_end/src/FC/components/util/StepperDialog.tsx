import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { ShiftOptions } from "./ShiftOptions";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { IShift } from "../../../types/interfaces";
import { HandlerFuncType } from "../../../types/types";
import { MIN, MAX_MEAT } from "../../../util/constants";
import { getCurrDay } from "../../../util/time";
import {
  TXT_DATE,
  TXT_MEAT_QUANTITY,
  TXT_BREAD_QUANTITY,
  TXT_NEW_SHIFT,
  TXT_BACK,
  TXT_FINISH,
  TXT_NEXT,
} from "../../../util/txt";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  setShift,
  closeStepperHandler,
}: {
  open: boolean;
  setShift: Function;
  closeStepperHandler: HandlerFuncType;
}) {
  const steps = [TXT_DATE, TXT_MEAT_QUANTITY, TXT_BREAD_QUANTITY];

  const [activeStep, setActiveStep] = useState(0);
  const [bread, setBread] = useState(0);
  const [meat, setMeat] = useState(0);

  useEffect(() => {
    if (activeStep === steps.length) {
      const newShift: IShift = {
        date: new Date(getCurrDay()),
        bread,
        meat,
        usages: [],
      };
      setShift(newShift);
    }
  }, [activeStep, setShift, bread, meat, steps.length]);

  const validateNumber = (val: string) => {
    if (!isNaN(parseInt(val))) {
      const value = parseInt(val);
      if (value > MIN && value < MAX_MEAT) {
        return value;
      }
    }
    return null;
  };

  const breadQuantityHandler = (val: string) => {
    const validNumber = validateNumber(val);
    if (validNumber) {
      setBread(validNumber);
    }
  };

  const meatQuantityHandler = (val: string) => {
    const validNumber = validateNumber(val);
    if (validNumber) {
      setMeat(validNumber);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{TXT_NEW_SHIFT}</DialogTitle>
        <Box sx={{ width: "70vw", m: "1rem" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Stack
            spacing={2}
            direction="column"
            sx={{ mt: "2rem", alignItems: "center" }}
          >
            {activeStep === 0 && (
              <ShiftOptions closeStepperHandler={closeStepperHandler} />
            )}
            {activeStep === 1 && (
              <TextField
                id="outlined-number"
                label={TXT_MEAT_QUANTITY}
                placeholder={meat.toString()}
                type="number"
                onChange={(e) => meatQuantityHandler(e.currentTarget.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            {activeStep === 2 && (
              <TextField
                id="outlined-number"
                label={TXT_BREAD_QUANTITY}
                placeholder={bread.toString()}
                type="number"
                onChange={(e) => breadQuantityHandler(e.currentTarget.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Stack>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {TXT_BACK}
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? TXT_FINISH : TXT_NEXT}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
