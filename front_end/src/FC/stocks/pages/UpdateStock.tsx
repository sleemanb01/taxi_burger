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
  ERROR_TEXT_REQUIRED,
  ENDPOINT_STOCKS,
  ERROR_IMAGE,
  ENDPOINT_STOCKS_WIMAGE,
  ENDPOINT_GET_STOCK,
} from "../../../util/Constants";
import {
  stockPatchInfo,
  stockPatchInfoWithoutImage,
} from "../../../util/stock-update";
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
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateInitVal.inputs,
    true
  );

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const resData = await sendRequest(
          ENDPOINT_GET_STOCK + "/" + stockId,
          "GET",
          null,
          {
            Authorization: "Barer " + user?.token,
          }
        );
        const stock: IStock = resData.stock;

        setSelected(stock.categoryId);
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
  }, [sendRequest, stockId, user?.token, setFormData]);

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

    let reqBody, reqHeaders, endPoint;

    const currImage = formState.inputs.image!.value;
    if (currImage === loadedStock?.image) {
      let { body, headers } = stockPatchInfoWithoutImage(
        { name: formState.inputs.name!.value, categoryId: selected! },
        user!.token
      );
      reqBody = body;
      reqHeaders = headers;
      endPoint = ENDPOINT_STOCKS + "/" + stockId;
    } else {
      const formData = new FormData();
      formData.append("name", formState.inputs.name!.value);
      formData.append("categoryId", selected!);
      formData.append("image", formState.inputs.image!.value);

      let { body, headers } = stockPatchInfo(formData, user!.token);
      reqBody = body;
      reqHeaders = headers;
      endPoint = ENDPOINT_STOCKS_WIMAGE + "/" + stockId;
    }

    try {
      await sendRequest(endPoint, "PATCH", reqBody, reqHeaders);
      nav("/" + user!.id + "/stocks");
    } catch (err) {}
  };

  const TXT_UPDATE = "עדכן מלאי";
  const TXT_NAME = "שם";

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
            label={TXT_NAME}
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
            image={loadedStock.image}
            onInput={inputHandler}
            errorText={ERROR_IMAGE}
          />
          <Button type="submit" disabled={!!!selected || !formState.isValid}>
            {TXT_UPDATE}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateStock;
