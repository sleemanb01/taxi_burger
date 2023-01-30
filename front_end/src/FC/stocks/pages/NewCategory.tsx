import React, { useLayoutEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateCategoriesInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { ICategory } from "../../../typing/interfaces";
import {
  DEFAULT_HEADERS,
  ENDPOINT_CATEGORIES,
  ERROR_TEXT_REQUIRED,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./StockForm.css";

function NewCategory() {
  const [formState, inputHandler] = useForm(
    reducerFormStateCategoriesInitVal.inputs,
    reducerFormStateCategoriesInitVal.isValid
  );
  const nav = useNavigate();
  const user = useContext(AuthContext).user!;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useLayoutEffect(() => {
    const categories = localStorage.getItem("categories");
    if (categories) {
      setCategories(JSON.parse(categories));
    }
  }, []);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    const category = {
      name: formState.inputs.name!.value,
    };

    try {
      const res = await sendRequest(
        ENDPOINT_CATEGORIES,
        "POST",
        JSON.stringify(category),
        {
          ...DEFAULT_HEADERS,
          Authorization: "Barer " + user.token,
        }
      );

      const resData: ICategory = res.category;
      const updatedCategories: ICategory[] = [...categories, resData];

      localStorage.setItem("categories", JSON.stringify(updatedCategories));

      nav(`/stocks/new/${resData._id}`);
    } catch (err) {}
  };

  if (!user.isAdmin) {
    nav("/");
  }

  const TXT_ADD = "הוסף מלאי";

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

        <Button type="submit" disabled={!formState.isValid}>
          {TXT_ADD}
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewCategory;
