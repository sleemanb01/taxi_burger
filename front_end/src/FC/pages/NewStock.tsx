import React, { useContext, useState } from "react";
import { AuthContext } from "../../hooks/auth-context";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { reducerInputStateInitVal } from "../../hooks/useReducer";
import { useNavigate, useParams } from "react-router-dom";
import { EValidatorType } from "../../types/enums";
import { ENDPOINT_STOCKS } from "../../util/constants";
import { Input } from "../assest/UIElements/Input";
import Button from "@mui/material/Button";
import LoadingSpinner from "../assest/LoadingSpinner";
import { ImageUpload } from "../assest/UIElements/ImageUpload";
import CategoryList from "./CategoryList";

import "../../styles/css/StockForm.css";
import { ErrorModal } from "../assest/UIElements/ErrorModal";
import {
  TXT_NAME,
  TXT_QUANTITY,
  TXT_ADD,
  ERROR_IMAGE,
  ERROR_NUMBER,
  ERROR_TEXT_REQUIRED,
} from "../../util/txt";

function NewStock() {
  const [formState, inputHandler] = useForm(
    {
      name: reducerInputStateInitVal,
      quantity: reducerInputStateInitVal,
      image: reducerInputStateInitVal,
    },
    false
  );
  const nav = useNavigate();
  const user = useContext(AuthContext).user!;

  const [selected, setSelected] = useState<string | undefined>(
    useParams().categoryId
  );

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    const DEFAULT_MIN_QUANTITY = 1;
    const DEFAULT_MAX_QUANTITY = 20;

    const formData = new FormData();
    formData.append("name", formState.inputs.name!.value);
    formData.append("quantity", formState.inputs.quantity!.value);
    formData.append("categoryId", selected!);
    formData.append("image", formState.inputs.image!.value);
    formData.append("minQuantity", DEFAULT_MIN_QUANTITY.toString());
    formData.append("maxQuantity", DEFAULT_MAX_QUANTITY.toString());

    try {
      await sendRequest(ENDPOINT_STOCKS, "POST", formData, {
        Authorization: "Barer " + user.token,
      });

      nav("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="stock-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <CategoryList setSelected={setSelected} selected={selected} />
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
          id="quantity"
          element="input"
          label={TXT_QUANTITY}
          validators={[EValidatorType.MIN, EValidatorType.MAX]}
          errorText={ERROR_NUMBER}
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText={ERROR_IMAGE}
        />

        <Button type="submit" disabled={!!!selected || !formState.isValid}>
          {TXT_ADD}
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewStock;
