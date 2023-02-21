import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../../types/interfaces";
import { TXT_CATEGORY, TXT_SELECT } from "../../../util/txt";

export default function CategorySelect({
  setSelected,
  selected,
}: {
  setSelected: Function;
  selected?: string;
}) {
  const nav = useNavigate();

  const [categories, setCategories] = React.useState<ICategory[]>([]);
  React.useLayoutEffect(() => {
    const categories = localStorage.getItem("categories");

    if (categories) {
      setCategories(JSON.parse(categories));
    }
  }, []);

  const handleChange = (e: SelectChangeEvent) => {
    e.preventDefault();

    if (e.target.value === "newCategory") {
      nav("/category/new");
    }

    setSelected(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, mt: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{TXT_CATEGORY}</InputLabel>
        <Select
          id="categories"
          label={TXT_CATEGORY}
          value={selected ? selected : ""}
          onChange={handleChange}
        >
          <MenuItem value={""} disabled>
            {TXT_SELECT}
          </MenuItem>
          {categories.map((category) => (
            <MenuItem value={category._id} key={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
