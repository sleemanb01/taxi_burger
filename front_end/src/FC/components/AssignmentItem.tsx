import Typography from "@mui/material/Typography";
import { IAssignement } from "../../types/interfaces";
import React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import "../../styles/css/global.css";
import { useNavigate } from "react-router-dom";

export default function AssignmentItem({ item }: { item: IAssignement }) {
  const nav = useNavigate();
  const [editAssignment, setEditAssignment] = React.useState(false);

  const clickHandler = () => {
    setEditAssignment((prev) => !prev);
  };

  const assignmentEditHandler = () => {
    // go to edit
    nav(`/assignments/${item._id}`);
  };

  const assignmentCompleteHandler = () => {
    // delete assignment
    console.log("complete clicked");
  };

  const imageClickHandler = () => {
    // show large image
    console.log("image clicked");
  };

  return (
    <Paper elevation={3} sx={{ m: 1, p: 1 }} onClick={clickHandler}>
      <div className="max-width__item">
        {item.image && (
          <img
            onClick={imageClickHandler}
            className="squareAvatar"
            alt={item.name + "img"}
            src={item.image}
          />
        )}
        <div>
          <Typography variant="h5">{item.name}</Typography>
          <Typography variant="body2">{item.description}</Typography>
        </div>
        {editAssignment && (
          <div className="options-overlay">
            <IconButton aria-label="edit" onClick={assignmentEditHandler}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="success"
              color="success"
              onClick={assignmentCompleteHandler}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </div>
        )}
      </div>
    </Paper>
  );
}
