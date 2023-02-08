import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { ShiftOptions } from "./ShiftOptions";
import { IShift } from "../../typing/interfaces";
import { getCurrDay } from "../../util/time";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

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
}: {
  open: boolean;
  setShift: Function;
}) {
  const steps = ["תאריך", "כמות בשר", "כמות לחם"];
  const MIN = 0;
  const MAX = 120;

  const [activeStep, setActiveStep] = useState(0);
  const [picked, setPicked] = useState(false);
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
  }, [picked, activeStep, setShift, bread, meat, steps.length]);

  const pickHandler = (shift: IShift | null) => {
    setShift(shift);
    setPicked(true);
  };

  const validateNumber = (val: string) => {
    if (!isNaN(parseInt(val))) {
      const value = parseInt(val);
      if (value > MIN && value < MAX) {
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
        <DialogTitle>{"פתיחת משמרת חדשה"}</DialogTitle>
        <Box sx={{ width: "80vw", m: "1rem" }}>
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
          <Stack spacing={2} direction="column" sx={{ mt: "2rem" }}>
            {activeStep === 0 && <ShiftOptions pickHandler={pickHandler} />}
            {activeStep === 1 && (
              <TextField
                id="outlined-number"
                label="כמות בשר"
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
                label="כמות לחם"
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
              חזור
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "סיים" : "הבא"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
