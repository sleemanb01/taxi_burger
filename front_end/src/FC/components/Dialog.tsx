import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { IStock } from "../../typing/interfaces";
import Fab from "@mui/material/Fab";
import { Box, DialogTitle, Slider, Stack } from "@mui/material";
import { partialStock } from "../../typing/types";

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

  const quantityChangeHandler = (value: number) => {
    if (value !== stock.quantity) {
      setEditedQuantity(value);
    }
  };

  const lowQuantityChangeHandler = (value: number) => {
    if (value !== stock.lowQuantity) {
      setEditLowQuantity(value);
    }
  };

  const closeHanler = () => {
    const editedStock: partialStock = {
      quantity: editedQuantity,
      lowQuantity: editlowQuantity,
      inUse: stock.inUse,
    };
    onChange(editedStock);
    onClose();
  };

  const TXT_QUANTITY = "כמות";

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
            defaultValue={stock.quantity}
            onChangeCommitted={(_, val) => quantityChangeHandler(val as number)}
            max={20}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Stack>
        <Fab color="error" aria-label="add">
          {stock.lowQuantity}
        </Fab>
      </Box>
    </Dialog>
  );
}
