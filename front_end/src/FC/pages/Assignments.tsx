import React from "react";
import List from "../components/util/UIElements/List";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { AssignmentsWActions } from "../../types/types";
import AssignmentItem from "../components/AssignmentItem";

/* ************************************************************************************************** */

function Assignments({
  assignmentsWActions,
}: {
  assignmentsWActions: AssignmentsWActions;
}) {
  const nav = useNavigate();
  const { values } = assignmentsWActions;

  const addClickHandler = () => {
    nav("/assignments/new");
  };

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <List
        renderItem={AssignmentItem}
        data={values}
        keyExtractor={({ _id }) => _id}
      />
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
