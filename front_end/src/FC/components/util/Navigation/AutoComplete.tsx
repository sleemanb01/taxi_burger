import TextField from "@mui/material/TextField";
import { StyledAutocomplete } from "../../../../styles/styledAutoComplete";
import { IStock } from "../../../../types/interfaces";
import { TXT_SEARCH } from "../../../../util/txt";

import "../../../../styles/css/global.css";

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
    const stock = value as IStock;
    clickHandler(stock.categoryId);
  };

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
