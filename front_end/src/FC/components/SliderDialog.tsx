import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IStock } from "../../types/interfaces";
import Fab from "@mui/material/Fab";
import { Box, DialogTitle, Slider, Stack, Typography } from "@mui/material";
import { partialStock } from "../../types/types";
import Input from "@mui/material/Input";
import AddIcon from "@mui/icons-material/Add";

import "../../styles/css/global.css";
import {
  TXT_ADD_QUANTITY,
  TXT_LOW_QUANTITY,
  TXT_QUANTITY,
} from "../../util/txt";

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
  const [isAdd, setIsAdd] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(stock.quantity);
  const [editMinQuantity, setEditMinQuantity] = useState(stock.minQuantity);
  const [isEdit, setIsEdit] = useState(false);

  const halfQuantity = Math.round(stock.quantity / 2);

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
      value: stock.quantity,
      label: stock.quantity.toString(),
    },
  ];

  const quantityChangeHandler = (value: number) => {
    if (value !== stock.quantity) {
      setEditedQuantity(value);
    }
  };

  const openAddHandler = () => {
    setIsAdd(true);
  };

  const closeAddHandler = () => {
    setIsAdd(false);
  };

  const addInputHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawValue = e.currentTarget.value;
    if (!isNaN(parseInt(rawValue))) {
      const value = parseInt(e.currentTarget.value);
      setEditedQuantity(value + editedQuantity);
    }
    closeAddHandler();
  };

  const minMaxChangeHandler = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawValue = e.currentTarget.value;
    if (!isNaN(parseInt(rawValue))) {
      const value = parseInt(e.currentTarget.value);
      if (value !== stock.minQuantity) {
        setEditMinQuantity(value);
      }

      setIsEdit(false);
    }
  };

  const closeHanler = () => {
    if (
      stock.quantity !== editedQuantity ||
      stock.minQuantity !== editMinQuantity
    ) {
      const editedStock: partialStock = {
        quantity: editedQuantity,
        minQuantity: editMinQuantity,
      };
      onChange(editedStock);
    }
    onClose();
  };

  const singleClickHandler = (_: React.MouseEvent<HTMLElement>) => {};

  const doubleClickHandler = () => {
    setIsEdit((prev) => !prev);
  };

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
            max={stock.quantity}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Stack>
        <Stack spacing={4} sx={{ alignItems: "center" }}>
          <Typography fontSize={"0.7rem"}>{TXT_ADD_QUANTITY}</Typography>
          <Fab color="primary" aria-label="add" onClick={openAddHandler}>
            {isAdd ? (
              <Input
                className="align-center"
                type="number"
                onBlur={(event) => addInputHandler(event)}
              />
            ) : (
              <AddIcon />
            )}
          </Fab>
          <Typography fontSize={"0.7rem"}>{TXT_LOW_QUANTITY}</Typography>
          <Fab color="error" aria-label="add" onClick={clickHandler}>
            <Input
              className="align-center"
              type="number"
              onBlur={(event) => minMaxChangeHandler(event)}
              disabled={!isEdit}
              defaultValue={editMinQuantity}
            />
          </Fab>
        </Stack>
      </Box>
    </Dialog>
  );
}
