import { useState } from "react";
import { IAssignement } from "../types/interfaces";
import { AssignmentsWActions } from "../types/types";

export const useAssignments = (): AssignmentsWActions => {
  const [values, setValues] = useState<IAssignement[]>([]);

  return { values, setValues };
};
