import { Box, Slider } from "@mui/material";

export function NumberSlider({
  onChange,
  defaultValue,
}: {
  onChange: Function;
  defaultValue: number;
}) {
  const values = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const marks = [
    {
      value: 0,
      label: "0",
    },

    {
      value: 10,
      label: "10",
    },
    {
      value: 20,
      label: "20",
    },
  ];

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Custom marks"
        max={20}
        onChangeCommitted={(_, val) => onChange(val)}
        defaultValue={defaultValue}
        aria-valuetext={values.toString()}
        step={1}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}
