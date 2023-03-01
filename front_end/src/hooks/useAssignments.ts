import React from "react";
import { useEffect, useState } from "react";
import { IAssignement } from "../types/interfaces";
import { AssignmentsWActions } from "../types/types";
import { ENDPOINT_ASSIGNMENTS } from "../util/constants";
import { AuthContext } from "./auth-context";

export const useAssignments = (
  sendRequest: (
    url: string,
    method?: string,
    body?: BodyInit | null,
    headers?: {}
  ) => Promise<any>
): AssignmentsWActions => {
  const [values, setValues] = useState<IAssignement[]>([]);
  const { user } = React.useContext(AuthContext);

  // const { sendRequest } = useHttpClient();

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

  const deleteHandler = async (deletedId: string) => {
    try {
      await sendRequest(
        ENDPOINT_ASSIGNMENTS + "/" + deletedId,
        "DELETE",
        null,
        {
          Authorization: "Barer " + user?.token,
        }
      );
    } catch (err) {}
    setValues((prev) => prev.filter((e) => e._id !== deletedId));
  };

  return { values, setValues, editHandler, deleteHandler };
};
