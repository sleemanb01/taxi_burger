import TextField from "@mui/material/TextField";
import { IStock } from "../../typing/interfaces";
import { StyledAutocomplete } from "../../styles/styledAutoComplete";

import "../../styles/styles.css";

export default function AutoComplete({
  options,
  clickHandler,
}: {
  options: IStock[];
  clickHandler: Function;
}) {
  const onChangeHandler = (value: unknown) => {
    if (!value) {
      return;
    }
    clickHandler((value as IStock).categoryId);
  };

  const TXT_SEARCH = "חיפוש";

  return (
    <StyledAutocomplete
      disablePortal
      id="combo-box-demo"
      className="search-width"
      options={options}
      getOptionLabel={(option) => (option as IStock).name}
      onChange={(_, value) => onChangeHandler(value)}
      sx={{ maxWidth: 600, paddingBlock: "0.6rem" }}
      renderInput={(params) => <TextField {...params} label={TXT_SEARCH} />}
    />
  );
}
