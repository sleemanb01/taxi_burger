import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { getCurrDay } from "../../util/time";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";

export function DatePicker() {
  const [value, setValue] = useState<Dayjs | null>(dayjs(getCurrDay()));

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
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
