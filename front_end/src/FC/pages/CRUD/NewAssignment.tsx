import { Button } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../types/enums";
import { ENDPOINT_ASSIGNMENTS } from "../../../util/constants";
import {
  ERROR_IMAGE,
  ERROR_TEXT_REQUIRED,
  TXT_ADD_ASSIGNMENT,
  TXT_DESCRIPTION,
  TXT_NAME,
} from "../../../util/txt";
import { ErrorModal } from "../../components/util/UIElements/ErrorModal";
import { ImageUpload } from "../../components/util/UIElements/ImageUpload";
import { Input } from "../../components/util/UIElements/Input";
import LoadingSpinner from "../../components/util/UIElements/LoadingSpinner";

import "../../../styles/css/Form.css";
import { upload, uploadWImage } from "../../../util/stock-update";

function NewAssignment() {
  const [image, setImage] = React.useState("");
  const [formState, inputHandler] = useForm(
    {
      name: reducerInputStateInitVal,
      description: reducerInputStateInitVal,
    },
    false
  );

  const nav = useNavigate();
  const user = useContext(AuthContext).user!;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const handleImageInput = (_: string, value: string, fileIsValid: boolean) => {
    if (fileIsValid) {
      console.log(value);

      setImage(value);
    }
  };

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    let reqBody, reqHeaders;
    if (!image) {
      let { body, headers } = upload(
        {
          name: formState.inputs.name!.value,
          description: formState.inputs.description!.value,
        },
        user!.token
      );
      reqBody = body;
      reqHeaders = headers;
    } else {
      console.log("dispatch from from data");

      const formData = new FormData();
      formData.append("name", formState.inputs.name!.value);
      formData.append("description", formState.inputs.description!.value);
      formData.append("image", image);

      let { body, headers } = uploadWImage(formData, user!.token);
      reqBody = body;
      reqHeaders = headers;
    }

    try {
      await sendRequest(ENDPOINT_ASSIGNMENTS, "POST", reqBody, reqHeaders);

      nav("/assignments");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="stock-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label={TXT_NAME}
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textArea"
          label={TXT_DESCRIPTION}
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id="image"
          onInput={handleImageInput}
          errorText={ERROR_IMAGE}
        />

        <Button type="submit" disabled={!formState.isValid}>
          {TXT_ADD_ASSIGNMENT}
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewAssignment;
