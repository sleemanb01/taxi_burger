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

export function SimpleDialog({
  open,
  onClose,
  onChange,
  stock,
}: SimpleDialogProps) {
  const [editedQuantity, setEditedQuantity] = useState(stock.quantity);
  const [editMinQuantity, setEditMinQuantity] = useState(stock.minQuantity);
  const [editMaxQuantity, setEditMaxQuantity] = useState(stock.maxQuantity);
  const [isEdit, setIsEdit] = useState(false);

  const halfQuantity = editMaxQuantity / 2;

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: halfQuantity,
      label: halfQuantity.toString(),
    },
    {
      value: editMaxQuantity,
      label: editMaxQuantity.toString(),
    },
  ];

  const quantityChangeHandler = (value: number) => {
    if (value !== stock.quantity) {
      setEditedQuantity(value);
    }
  };

  const minMaxChangeHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    isLow: boolean
  ) => {
    const rawValue = e.currentTarget.value;
    if (!isNaN(parseInt(rawValue))) {
      const value = parseInt(e.currentTarget.value);
      if (isLow) {
        if (value !== stock.minQuantity) {
          setEditMinQuantity(value);
        }
      } else {
        if (value !== stock.maxQuantity) {
          setEditMaxQuantity(value);
        }
      }
      setIsEdit(false);
    }
  };

  const closeHanler = () => {
    if (
      stock.quantity !== editedQuantity ||
      stock.minQuantity !== editMinQuantity ||
      stock.maxQuantity !== editMaxQuantity
    ) {
      const editedStock: partialStock = {
        quantity: editedQuantity,
        minQuantity: editMinQuantity,
        maxQuantity: editMaxQuantity,
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
    if (!isEdit) {
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
    }
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
            max={editMaxQuantity}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Stack>
        <Stack spacing={4}>
          <Fab color="primary" aria-label="add" onClick={clickHandler}>
            <Input
              type="number"
              className="align-center"
              onBlur={(event) => minMaxChangeHandler(event, false)}
              disabled={!isEdit}
              defaultValue={editMaxQuantity}
            />
          </Fab>

          <Fab color="error" aria-label="add" onClick={clickHandler}>
            <Input
              className="align-center"
              type="number"
              onBlur={(event) => minMaxChangeHandler(event, true)}
              disabled={!isEdit}
              defaultValue={editMinQuantity}
            />
          </Fab>
        </Stack>
      </Box>
    </Dialog>
  );
}
