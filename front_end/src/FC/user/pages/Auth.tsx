import React, { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { reducerInputState, userWToken } from "../../../typing/types";
import {
  DEFAULT_HEADERS,
  ERROR_DESCRIPTION_LENGTH,
  ERROR_IMAGE,
  ERROR_TEXT_REQUIRED,
  ERROR_VALID_EMAIL,
  ENDPOINT_LOGIN,
  ENDPOINT_SIGNUP,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { IUser } from "../../../typing/interfaces";

import "./Auth.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../hooks/http-hook";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

/* ************************************************************************************************** */

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const ctx = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      // email: reducerInputStateInitVal,
      code: reducerInputStateInitVal,
      password: reducerInputStateInitVal,
    },
    false
  );

  /* ************************************************************************************************** */

  const switchModeHandler = () => {
    if (!isLoginMode) {
      formState.inputs.email = formState.inputs.email as reducerInputState;
      formState.inputs.password = formState.inputs
        .password as reducerInputState;
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: reducerInputStateInitVal,
          image: reducerInputStateInitVal,
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    let res: userWToken | undefined;
    let user: IUser = {
      // email: formState.inputs.email!.value,
      code: formState.inputs.code!.value,
      password: formState.inputs.password!.value,
    };

    if (isLoginMode) {
      try {
        res = await sendRequest(
          ENDPOINT_LOGIN,
          "POST",
          JSON.stringify(user),
          DEFAULT_HEADERS
        );

        ctx.login(res!);
      } catch (err) {}
    } else {
      user = {
        ...user,
        email: formState.inputs.email!.value,
        name: formState.inputs.name!.value,
        code: formState.inputs.code!.value,
        image: formState.inputs.image!.value,
      };
      try {
        const formData = new FormData();
        formData.append("email", user.email!);
        formData.append("name", user.name!);
        formData.append("code", user.code!);
        formData.append("password", user.password!);
        formData.append("image", user.image!);

        res = await sendRequest(ENDPOINT_SIGNUP, "POST", formData);

        ctx.login(res!);
      } catch (err) {}
    }
  };

  /* ************************************************************************************************** */

  const TXT_LOGIN_REQUIRED = "נדרשת כניסה!";
  const TXT_SWITCH_TO = "החלף ל ";
  const TXT_LOGIN = "כניסה";
  const TXT_SIGNUP = "הרשמה";
  const TXT_NAME = "שם";
  const TXT_EMAIL = "אימייל";
  const TXT_PASSWORD = "סיסמה";
  const TXT_CODE = "קוד עובד";

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        <>{isLoading && <LoadingSpinner asOverlay />}</>
        <h2>{TXT_LOGIN_REQUIRED}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <React.Fragment>
              <Input
                element="input"
                id="name"
                type="text"
                label={TXT_NAME}
                validators={[EValidatorType.REQUIRE]}
                errorText={ERROR_TEXT_REQUIRED}
                onInput={inputHandler}
              />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText={ERROR_IMAGE}
              />
              <Input
                element="input"
                id="email"
                type="email"
                label={TXT_EMAIL}
                validators={[EValidatorType.EMAIL]}
                errorText={ERROR_VALID_EMAIL}
                onInput={inputHandler}
              />
            </React.Fragment>
          )}
          <Input
            element="input"
            id="code"
            type="text"
            label={TXT_CODE}
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label={TXT_PASSWORD}
            validators={[EValidatorType.MINLENGTH]}
            errorText={ERROR_DESCRIPTION_LENGTH}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? TXT_LOGIN : TXT_SIGNUP}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {`${TXT_SWITCH_TO} ${isLoginMode ? TXT_SIGNUP : TXT_LOGIN}`}
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Auth;
