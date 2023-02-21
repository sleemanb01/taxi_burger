import { Card, Button } from "@mui/material";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateCategoriesInitVal } from "../../../hooks/useReducer";

import { EValidatorType } from "../../../types/enums";
import { ICategory } from "../../../types/interfaces";
import { reducerInputState } from "../../../types/types";
import { ENDPOINT_CATEGORIES } from "../../../util/constants";
import { ERROR_TEXT_REQUIRED, TXT_UPDATE_STOCK } from "../../../util/txt";
import { ErrorModal } from "../../components/util/UIElements/ErrorModal";
import { Input } from "../../components/util/UIElements/Input";
import LoadingSpinner from "../../components/util/UIElements/LoadingSpinner";

import "../../../styles/css/Form.css";

function UpdateCategory() {
  const user = useContext(AuthContext).user;
  const nav = useNavigate();
  const stockId = useParams().categoryId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCategory, setLoadedCategory] = useState<ICategory[]>([]);
  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateCategoriesInitVal.inputs,
    true
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const resData = await sendRequest(ENDPOINT_CATEGORIES + "/" + stockId);
        const stock = resData.stock;
        setLoadedCategory(stock);

        setFormData(
          {
            name: {
              value: stock.title,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchStock();
  }, [sendRequest, stockId, setFormData]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const stock = {
      ...loadedCategory,
      name: formState.inputs.name!.value,
    };
    try {
      await sendRequest(ENDPOINT_CATEGORIES, "PATCH", JSON.stringify(stock), {
        "Content-Type": "application/json",
        Authorization: "Barer " + user?.token,
      });
      nav("/" + user!.id + "/stocks");
    } catch (err) {}
  };

  if (!loadedCategory && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the category!</h2>
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
      {!isLoading && (
        <form className="stock-form" onSubmit={submitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
            initValue={
              (formState.inputs.name as reducerInputState).value as string
            }
            initialIsValid={
              (formState.inputs.name as reducerInputState).isValid
            }
          />
          <Button type="submit" disabled={!formState.isValid}>
            {TXT_UPDATE_STOCK}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateCategory;
