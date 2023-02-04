import React, { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { useNavigate, useParams } from "react-router-dom";
import { EValidatorType } from "../../../typing/enums";
import {
  ERROR_TEXT_REQUIRED,
  ENDPOINT_STOCKS,
  ERROR_NUMBER,
  ERROR_IMAGE,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./StockForm.css";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";
import CategoryList from "../components/CategoryList";

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
  const [inUse, setInUse] = useState(false);

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
    formData.append("inUse", inUse.toString());
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

  if (!user.isAdmin) {
    nav("/");
  }

  const checkHandler = () => {
    setInUse((prev) => !prev);
  };

  const TXT_ADD = "הוסף מלאי";
  const TXT_NAME = "שם";
  const TXT_QUANTITY = "כמות";
  const TXT_INUSE = "בשימוש";

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
        <label htmlFor="inUse">
          <input
            className="checkBox"
            type="checkbox"
            id="inUse"
            checked={inUse}
            onChange={checkHandler}
          />
          {TXT_INUSE}
        </label>

        <Button type="submit" disabled={!!!selected || !formState.isValid}>
          {TXT_ADD}
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewStock;
