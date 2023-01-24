import React, { useContext, useLayoutEffect, useState } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import {
  reducerFormStateInitVal,
  reducerInputStateInitVal,
} from "../../../hooks/useReducer";
import { useNavigate } from "react-router-dom";
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
import { ICategory } from "../../../typing/interfaces";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

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
  // const categoryId = useParams().categoryId;

  const user = useContext(AuthContext).user!;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [inUse, setInUse] = useState(false);

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

    const formData = new FormData();
    formData.append("name", formState.inputs.name!.value);
    formData.append("quantity", formState.inputs.quantity!.value);
    formData.append("categoryId", selected!);
    formData.append("inUse", inUse.toString());
    formData.append("image", formState.inputs.image!.value);

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

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (e.target.value === "newCategory") {
      nav("/category/new");
    }

    setSelected(e.target.value);
  };

  const checkHandler = () => {
    setInUse((prev) => !prev);
  };

  // console.log(formState.inputs.quantity?.value);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="stock-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <select
          defaultValue={"default"}
          name="categories"
          onChange={selectChangeHandler}
        >
          <option disabled value="default" key="default">
            {" "}
            -- select an option --{" "}
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
          <option key="newCategory" value="newCategory">
            NEW CATEGORY
          </option>
        </select>
        <Input
          id="name"
          element="input"
          type="text"
          label="name"
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <Input
          id="quantity"
          element="input"
          label="quantity"
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
          In use
        </label>

        <Button type="submit" disabled={!!!selected || !formState.isValid}>
          ADD STOCK
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewStock;
