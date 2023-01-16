import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { IStock } from "../../../typing/interfaces";
import { reducerInputState } from "../../../typing/types";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  ENDPOINT_STOCKS,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./StockForm.css";

function UpdateStock() {
  const user = useContext(AuthContext).user;
  const stockId = useParams().stockId;
  const nav = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedStock, setLoaddedStock] = useState<IStock | null>(null);
  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateInitVal.inputs,
    true
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const resData = await sendRequest(ENDPOINT_STOCKS + "/" + stockId);
        const stock = resData.stock;
        setLoaddedStock(stock);

        setFormData(
          {
            title: {
              value: stock.title,
              isValid: true,
            },
            description: {
              value: stock.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchStock();
  }, [sendRequest, stockId, setFormData]);

  if (!loadedStock && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the stock!</h2>
        </Card>
      </div>
    );
  }

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const stock = {
      ...(loadedStock as IStock),
      title: formState.inputs.title!.value,
      description: formState.inputs.description!.value,
    };
    try {
      await sendRequest(
        ENDPOINT_STOCKS + "/" + stockId,
        "PATCH",
        JSON.stringify(stock),
        {
          "Content-Type": "application/json",
          Authorization: "Barer " + user?.token,
        }
      );
      nav("/" + user!.id + "/stocks");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedStock && (
        <form className="stock-form" onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
            initValue={
              (formState.inputs.title as reducerInputState).value as string
            }
            initialIsValid={
              (formState.inputs.title as reducerInputState).isValid
            }
          />
          <Input
            id="description"
            element="textArea"
            label="Description"
            validators={[EValidatorType.MINLENGTH]}
            errorText={ERROR_DESCRIPTION_LENGTH}
            onInput={inputHandler}
            initValue={
              (formState.inputs.description as reducerInputState)
                .value as string
            }
            initialIsValid={
              (formState.inputs.description as reducerInputState).isValid
            }
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE STOCK
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateStock;
