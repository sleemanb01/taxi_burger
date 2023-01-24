import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { ICategory, IStock } from "../../../typing/interfaces";
import { reducerInputState } from "../../../typing/types";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  ENDPOINT_STOCKS,
  DEFAULT_HEADERS,
  ERROR_IMAGE,
  BACKEND_API_URL,
  BACKEND_URL,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CategoryList from "../components/CategoryList";

import "./StockForm.css";

function UpdateStock() {
  const user = useContext(AuthContext).user;
  const stockId = useParams().stockId;
  const nav = useNavigate();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedStock, setLoaddedStock] = useState<IStock | null>(null);
  const [selected, setSelected] = useState<string | undefined>(stockId);

  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateInitVal.inputs,
    true
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const resData = await sendRequest(
          ENDPOINT_STOCKS + "/" + stockId,
          "GET",
          null,
          {
            Authorization: "Barer " + user?.token,
          }
        );
        const stock = resData.stock;

        setLoaddedStock(stock);

        setFormData(
          {
            name: {
              value: stock.name,
              isValid: true,
            },
            image: {
              value: stock.image,
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

    const formData = new FormData();
    formData.append("categoryId", selected!);
    formData.append("name", formState.inputs.name!.value);
    formData.append("quantity", loadedStock!.quantity.toString());
    formData.append("inUse", loadedStock!.inUse.toString());
    formData.append("image", formState.inputs.image!.value);

    try {
      await sendRequest(ENDPOINT_STOCKS + "/" + stockId, "PATCH", formData, {
        Authorization: "Barer " + user?.token,
      });
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
          <CategoryList setSelected={setSelected} selected={selected} />
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
          <ImageUpload
            center
            id="image"
            image={BACKEND_URL + loadedStock.image}
            onInput={inputHandler}
            errorText={ERROR_IMAGE}
          />
          <Button type="submit" disabled={!!!selected || !formState.isValid}>
            UPDATE STOCK
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateStock;
