import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IStock } from "../../typing/interfaces";
import Fab from "@mui/material/Fab";
import { Box, DialogTitle, Slider, Stack } from "@mui/material";
import { partialStock } from "../../typing/types";
import Input from "@mui/material/Input";

import "../../styles/styles.css";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  onChange: (value: partialStock) => void;
  stock: IStock;
}
const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 5,
    label: "5",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 15,
    label: "15",
  },
  {
    value: 20,
    label: "20",
  },
];

export function SimpleDialog({
  open,
  onClose,
  onChange,
  stock,
}: SimpleDialogProps) {
  const [editedQuantity, setEditedQuantity] = useState(stock.quantity);
  const [editlowQuantity, setEditLowQuantity] = useState(stock.lowQuantity);
  const [isEdit, setIsEdit] = useState(false);

  const quantityChangeHandler = (value: number) => {
    if (value !== stock.quantity) {
      setEditedQuantity(value);
    }
  };

  const lowQuantityChangeHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawValue = e.currentTarget.value;
    if (!isNaN(parseInt(rawValue))) {
      const value = parseInt(e.currentTarget.value);
      if (value !== stock.lowQuantity) {
        setEditLowQuantity(value);
      }
      setIsEdit(false);
    }
  };

  const closeHanler = () => {
    if (
      stock.quantity !== editedQuantity ||
      stock.lowQuantity !== editlowQuantity
    ) {
      const editedStock: partialStock = {
        quantity: editedQuantity,
        lowQuantity: editlowQuantity,
        inUse: stock.inUse,
      };
      onChange(editedStock);
    }
    onClose();
  };

  const singleClickHandler = (_: React.MouseEvent<HTMLElement>) => {};

  const doubleClickHandler = () => {
    setIsEdit((prev) => !prev);
  };

  const TXT_QUANTITY = "כמות";
  let timer: ReturnType<typeof setTimeout>;
  let firing = false;

  let firingFunc = singleClickHandler;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (firing) {
      firingFunc = doubleClickHandler;
      return;
    }

    firing = true;
    timer = setTimeout(function () {
      firingFunc(event);

      firingFunc = () => singleClickHandler(event);
      firing = false;
    }, 250);
    console.log(timer);
  };

  return (
    <Dialog onClose={closeHanler} open={open}>
      <DialogTitle sx={{ textAlign: "center" }}>
        {TXT_QUANTITY + " " + stock.name}
      </DialogTitle>
      <Box className="dir-column">
        <Stack spacing={1} direction="row" className="slider-height">
          <Slider
            className="slider-height"
            orientation="vertical"
            getAriaValueText={(value, _) => value.toString()}
            key={`slider-${stock.quantity}`}
            defaultValue={stock.quantity}
            onChangeCommitted={(_, val) => quantityChangeHandler(val as number)}
            max={20}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Stack>
        <Fab color="error" aria-label="add" onClick={clickHandler}>
          <Input
            className="align-center"
            type="number"
            onBlur={lowQuantityChangeHandler}
            disabled={!isEdit}
            defaultValue={stock.lowQuantity}
          />
        </Fab>
      </Box>
    </Dialog>
  );
}
