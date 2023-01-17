import React, { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { useNavigate } from "react-router-dom";
import { EValidatorType } from "../../../typing/enums";
import {
  ERROR_TEXT_REQUIRED,
  ENDPOINT_STOCKS,
  ERROR_IMAGE,
  ERROR_NUMBER,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./StockForm.css";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

function NewStock() {
  const [formState, inputHandler] = useForm(
    reducerFormStateInitVal.inputs,
    reducerFormStateInitVal.isValid
  );
  const nav = useNavigate();

  const user = useContext(AuthContext).user!;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    const formData = new FormData();
    formData.append("name", formState.inputs.name!.value);
    formData.append("quantity", formState.inputs.quantity!.value);
    formData.append("image", formState.inputs.image!.value);

    try {
      await sendRequest(ENDPOINT_STOCKS, "POST", formData, {
        Authorization: "Barer " + user.token,
      });

      nav("/");
    } catch (err) {}
  };

  if (!user.isAdmin) {
    nav("/");
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="stock-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="name"
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <Input
          id="quantity"
          element="input"
          label="quantity"
          validators={[EValidatorType.MIN, EValidatorType.MAX]}
          errorText={ERROR_NUMBER}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText={ERROR_IMAGE}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD STOCK
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewStock;
