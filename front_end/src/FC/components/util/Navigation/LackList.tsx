import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ILack, IStock } from "../../../../types/interfaces";
import {
  TXT_LEFT_ONLY,
  TXT_LEFT,
  TXT_EVERYTHING_IS_GOOD,
} from "../../../../util/txt";

export default function AlignItemsList({
  lacks,
  clickHandler,
  closeHandler,
}: {
  lacks: ILack[];
  clickHandler: Function;
  closeHandler: Function;
}) {
  const itemClickHandler = (stock: IStock) => {
    clickHandler(stock.categoryId);
    closeHandler();
  };

  const singleElement = (lack: ILack) => {
    const stock = lack.stock;
    return (
      <React.Fragment key={stock._id}>
        <ListItem
          alignItems="flex-start"
          onClick={() => itemClickHandler(stock)}
        >
          <ListItemAvatar>
            <Avatar alt={stock.name + "img"} src={stock.image} />
          </ListItemAvatar>
          <ListItemText
            primary={stock.name}
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color={lack.isCritical ? "error" : "warning.main"}
              >
                {(lack.isCritical ? TXT_LEFT_ONLY : TXT_LEFT) +
                  " " +
                  stock.quantity}
              </Typography>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  };

  if (lacks.length === 0) {
    return <p>{TXT_EVERYTHING_IS_GOOD}</p>;
  }

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {lacks.map((el) => singleElement(el))}
    </List>
  );
}
