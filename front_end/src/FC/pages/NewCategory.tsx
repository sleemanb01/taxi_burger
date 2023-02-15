import { Button } from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/auth-context";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { reducerFormStateCategoriesInitVal } from "../../hooks/useReducer";
import { EValidatorType } from "../../types/enums";
import { ICategory } from "../../types/interfaces";
import { DEFAULT_HEADERS, ENDPOINT_CATEGORIES } from "../../util/constants";
import LoadingSpinner from "../assest/LoadingSpinner";
import { Input } from "../assest/UIElements/Input";

import "../../styles/css/StockForm.css";
import { ErrorModal } from "../assest/UIElements/ErrorModal";
import { ERROR_TEXT_REQUIRED, TXT_ADD } from "../../util/txt";

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
