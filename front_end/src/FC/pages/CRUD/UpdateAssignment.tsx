import { Card, Button } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../types/enums";
import { IAssignement } from "../../../types/interfaces";
import { DEFAULT_HEADERS, ENDPOINT_ASSIGNMENTS } from "../../../util/constants";
import { upload, uploadWImage } from "../../../util/stock-update";
import {
  TXT_NAME,
  ERROR_TEXT_REQUIRED,
  ERROR_IMAGE,
  TXT_UPDATE_CATEGORY,
  TXT_DESCRIPTION,
} from "../../../util/txt";
import { ErrorModal } from "../../components/util/UIElements/ErrorModal";
import { Input } from "../../components/util/UIElements/Input";
import LoadingSpinner from "../../components/util/UIElements/LoadingSpinner";

import "../../../styles/css/Form.css";

function UpdateStock() {
  const user = useContext(AuthContext).user;
  const assignmentId = useParams().assignmentId;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedAssignment, setLoadedAssignment] = useState<IAssignement | null>(
    null
  );

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: reducerInputStateInitVal,
      description: reducerInputStateInitVal,
    },
    false
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const resData = await sendRequest(
          ENDPOINT_ASSIGNMENTS + "/" + assignmentId,
          "GET",
          null,
          {
            ...DEFAULT_HEADERS,
            Authorization: "Barer " + user?.token,
          }
        );
        const assignment: IAssignement = resData.assignment;

        setLoadedAssignment(assignment);

        setFormData(
          {
            name: {
              value: assignment.name,
              isValid: true,
            },
            description: {
              value: assignment.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchStock();
  }, [sendRequest, assignmentId, user?.token, setFormData]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const assignment = {
      ...loadedAssignment,
      name: formState.inputs.name!.value,
      description: formState.inputs.description!.value,
    };

    try {
      await sendRequest(
        ENDPOINT_ASSIGNMENTS + "/" + assignmentId,
        "PATCH",
        JSON.stringify(assignment),
        {
          ...DEFAULT_HEADERS,
          Authorization: "Barer " + user?.token,
        }
      );
      // nav("/assignments");
    } catch (err) {}
  };

  if (!loadedAssignment && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the stock!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedAssignment && (
        <form className="stock-form" onSubmit={submitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label={TXT_NAME}
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
            initValue={formState.inputs.name!.value}
            initialIsValid={formState.inputs.name!.isValid}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label={TXT_DESCRIPTION}
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
            initValue={formState.inputs.description!.value}
            initialIsValid={formState.inputs.description!.isValid}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            variant="contained"
          >
            {TXT_UPDATE_CATEGORY}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateStock;
