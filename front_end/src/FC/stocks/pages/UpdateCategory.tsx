import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateCategoriesInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { ICategory } from "../../../typing/interfaces";
import { reducerInputState } from "../../../typing/types";
import {
  ENDPOINT_CATEGORIES,
  ERROR_TEXT_REQUIRED,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./StockForm.css";

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

  const TXT_UPDATE = "עדכן קטגוריה";

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
            {TXT_UPDATE}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateCategory;
