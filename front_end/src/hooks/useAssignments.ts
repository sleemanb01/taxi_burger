import { useEffect, useState } from "react";
import { IAssignement } from "../types/interfaces";
import { AssignmentsWActions } from "../types/types";
import { ENDPOINT_ASSIGNMENTS } from "../util/constants";
import { useHttpClient } from "./http-hook";

export const useAssignments = (): AssignmentsWActions => {
  const [values, setValues] = useState<IAssignement[]>([]);

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchAssingments = async () => {
      try {
        const responseData = await sendRequest(ENDPOINT_ASSIGNMENTS);
        setValues(responseData.assignments);
      } catch (err) {}
    };
    fetchAssingments();
  }, [sendRequest]);

  const editHandler = (editedAssignment: IAssignement) => {
    const index = values.indexOf(editedAssignment);
    if (index) {
      setValues((prev) => [...prev, (prev[index] = editedAssignment)]);
    }
  };

  const deleteHandler = (deletedId: string) => {
    setValues((prev) => prev.filter(({ _id }) => _id !== deletedId));
  };

  return { values, setValues, editHandler, deleteHandler };
};
