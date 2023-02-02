import * as React from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";

import "../../styles/styles.css";

const values = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

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

interface Props {
  initValue: number;
  lowValue: number;
  onChange: (value: number) => void;
}

export default function VerticalSlider({
  initValue,
  lowValue,
  onChange,
}: Props) {
  return (
    <Stack spacing={1} direction="row" className="slider-height">
      <Slider
        sx={{ color: "#000" }}
        orientation="vertical"
        getAriaValueText={(value, _) => value.toString()}
        defaultValue={initValue}
        max={20}
        step={1}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Stack>
  );
}
