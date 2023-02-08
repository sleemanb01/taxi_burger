import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { ILack } from "../../typing/interfaces";

export default function AlignItemsList({ lacks }: { lacks: ILack[] }) {
  const TXT_EVERYTHING_IS_GOOD = "הכל בסדר";
  const TXT_LEFT = "נשאר רק";

  const singleElement = (lack: ILack) => {
    return (
      <React.Fragment key={lack._id}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={lack.name + "img"} src={lack.image} />
          </ListItemAvatar>
          <ListItemText
            primary={lack.name}
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="error"
              >
                {TXT_LEFT + " " + lack.quantity}
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
