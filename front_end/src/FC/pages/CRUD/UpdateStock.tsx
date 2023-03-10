import { Card, Button } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../types/enums";
import { IStock } from "../../../types/interfaces";
import {
  ENDPOINT_GET_STOCK,
  ENDPOINT_STOCKS,
  ENDPOINT_STOCKS_WIMAGE,
} from "../../../util/constants";
import { upload, uploadWImage } from "../../../util/stock-update";
import {
  TXT_NAME,
  ERROR_TEXT_REQUIRED,
  ERROR_IMAGE,
  TXT_UPDATE_STOCK,
} from "../../../util/txt";
import CategoryList from "../../components/util/CategorySelect";
import { ErrorModal } from "../../components/util/UIElements/ErrorModal";
import { ImageUpload } from "../../components/util/UIElements/ImageUpload";
import { Input } from "../../components/util/UIElements/Input";
import LoadingSpinner from "../../components/util/UIElements/LoadingSpinner";

import "../../../styles/css/Form.css";

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
        const resData = await sendRequest(ENDPOINT_GET_STOCK + "/" + stockId);
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

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    let reqBody, reqHeaders, endPoint;

    const currImage = formState.inputs.image!.value;
    if (currImage === loadedStock?.image) {
      let { body, headers } = upload(
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

      let { body, headers } = uploadWImage(formData, user!.token);
      reqBody = body;
      reqHeaders = headers;
      endPoint = ENDPOINT_STOCKS_WIMAGE + "/" + stockId;
    }

    try {
      await sendRequest(endPoint, "PATCH", reqBody, reqHeaders);
      nav("/" + user!.id + "/stocks");
    } catch (err) {}
  };

  if (!loadedStock && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the stock!</h2>
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
            initValue={formState.inputs.name!.value}
            initialIsValid={formState.inputs.name!.isValid}
          />
          <ImageUpload
            center
            id="image"
            image={loadedStock.image}
            onInput={inputHandler}
            errorText={ERROR_IMAGE}
          />
          <Button
            type="submit"
            disabled={!!!selected || !formState.isValid}
            variant="contained"
          >
            {TXT_UPDATE_STOCK}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdateStock;
