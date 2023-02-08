import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { getCurrDay } from "../../util/time";
import TextField from "@mui/material/TextField";

export function DatePicker() {
  const [value, setValue] = useState<Date | null>(new Date(getCurrDay()));

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="תאריך"
        inputFormat="MM/DD/YYYY"
        value={value}
        onChange={(val) => handleChange(val)}
        renderInput={(params) => <TextField {...params} />}
        disabled={true}
      />
    </LocalizationProvider>
  );
}
