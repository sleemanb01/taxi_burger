import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AssignmentItem from "../components/AssignmentItem";
import { useAssignments } from "../../hooks/useAssignments";
import { ErrorModal } from "../components/util/UIElements/ErrorModal";
import LoadingSpinner from "../components/util/UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";

/* ************************************************************************************************** */

function Assignments() {
  const nav = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { values, deleteHandler } = useAssignments(sendRequest);

  const addClickHandler = () => {
    nav("/assignments/new");
  };

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {values.map((i) => (
        <AssignmentItem item={i} deleteHandler={deleteHandler} />
      ))}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(4),
          right: (theme) => theme.spacing(4),
        }}
        onClick={addClickHandler}
      >
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}

export default Assignments;
