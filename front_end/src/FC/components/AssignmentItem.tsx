import Typography from "@mui/material/Typography";
import { IAssignement } from "../../types/interfaces";
import React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import "../../styles/css/global.css";
import { useNavigate } from "react-router-dom";
import ImagePreview from "./util/UIElements/ImagePreview";
import { BasicModal } from "./util/UIElements/Modal";
import {
  TXT_CANCEL,
  TXT_CONFIRM,
  TXT_CONFIRMED,
  TXT_MISSION_ACCOMPLISHED,
} from "../../util/txt";
import Button from "@mui/material/Button";
import { AssignmentsWActions } from "../../types/types";

export default function AssignmentItem({
  item,
  deleteHandler,
}: {
  item: IAssignement;
  deleteHandler: AssignmentsWActions["deleteHandler"];
}) {
  const nav = useNavigate();
  // const { user } = React.useContext(AuthContext);
  const [editAssignment, setEditAssignment] = React.useState(false);
  const [isImagePreview, setIsImagePreview] = React.useState(false);
  const [confirmDelete, setIsConfirm] = React.useState(false);

  const clickHandler = () => {
    setEditAssignment((prev) => !prev);
  };

  const assignmentEditHandler = () => {
    nav(`/assignments/${item._id}`);
  };

  const confirmDeleteHandler = async () => {
    // closeConfirm();

    deleteHandler(item._id!);
  };

  const openConfirm = () => {
    setIsConfirm(true);
  };

  const closeConfirm = () => {
    setIsConfirm(false);
  };

  const imageCloseHandler = () => {
    setIsImagePreview(false);
  };

  const imageOpenHandler = () => {
    setIsImagePreview(true);
  };

  return (
    <Paper elevation={3} sx={{ m: 1, p: 1 }} onClick={clickHandler}>
      <div className="max-width__item">
        {confirmDelete && (
          <BasicModal
            show={confirmDelete}
            header={TXT_CONFIRM}
            onCancel={closeConfirm}
            content={TXT_MISSION_ACCOMPLISHED}
            footer={
              <React.Fragment>
                <Button color="secondary" onClick={closeConfirm}>
                  {TXT_CANCEL}
                </Button>
                <Button color="success" onClick={confirmDeleteHandler}>
                  {TXT_CONFIRMED}
                </Button>
              </React.Fragment>
            }
          />
        )}
        {item.image && (
          <React.Fragment>
            <ImagePreview
              open={isImagePreview}
              closeHandler={imageCloseHandler}
              img={item.image}
            />
            <img
              onClick={imageOpenHandler}
              className="squareAvatar"
              alt={item.name + "img"}
              src={item.image}
            />
          </React.Fragment>
        )}
        <div className="assignment-txt">
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
              onClick={openConfirm}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          </div>
        )}
      </div>
    </Paper>
  );
}
