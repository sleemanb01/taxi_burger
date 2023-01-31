import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UIElements/Modal";
import { IStock } from "../../../typing/interfaces";

import "./StockItem.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";

import {
  DEFAULT_HEADERS,
  ENDPOINT_STOCKS,
  ENDPOINT_STOCKS_PARTIAL,
} from "../../../util/Constants";
import { NumberSlider } from "../../shared/components/FormElements/NumberSlider";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

/* ************************************************************************************************** */

export function StockItem({
  stock,
  onDelete,
}: {
  stock: IStock;
  onDelete: Function;
}) {
  interface partialStock {
    quantity: IStock["quantity"];
    inUse: IStock["inUse"];
  }
  const user = useContext(AuthContext).user;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const editRef = useRef<HTMLInputElement | null>(null);

  const initValue: partialStock = {
    quantity: stock.quantity,
    inUse: stock.inUse,
  };

  const [sliderValue, setSliderValue] = useState(stock.quantity);
  const [currStock, setCurrStock] = useState<partialStock>(initValue);
  const [quantityEdit, setQuantityEdit] = useState(false);
  const [editStock, setEditStock] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  useEffect(() => {
    const updateStockHandler = async () => {
      try {
        await sendRequest(
          ENDPOINT_STOCKS_PARTIAL + "/" + stock._id,
          "PATCH",
          JSON.stringify(currStock),
          {
            ...DEFAULT_HEADERS,
            Authorization: "Barer " + user?.token,
          }
        );
      } catch (err) {}
    };
    if (
      stock.quantity !== currStock.quantity ||
      stock.inUse !== currStock.inUse
    ) {
      updateStockHandler();
    }
  }, [sendRequest, currStock, stock._id, stock, user?.token]);

  /* ************************************************************************************************** */

  let timer: ReturnType<typeof setTimeout>;
  let firing = false;
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeDist = 100;

  const style = { backgroundColor: currStock.inUse ? "yellow" : "" };

  /* ************************************************************************************************** */

  const openConfirmHandler = () => {
    setIsConfirmVisible(true);
  };

  const closeConfirmHandler = () => {
    setIsConfirmVisible(false);
  };

  const confirmDeleteHandler = async () => {
    closeConfirmHandler();

    try {
      await sendRequest(ENDPOINT_STOCKS + "/" + stock._id, "DELETE", null, {
        Authorization: "Barer " + user?.token,
      });
      onDelete(stock._id);
    } catch (err) {}
  };

  const openQuantityEditHandler = () => {
    setQuantityEdit(true);
  };

  const closeQuantityEditHandler = () => {
    setQuantityEdit(false);
    if (sliderValue !== currStock.quantity) {
      setCurrStock((prev) => ({ ...prev, quantity: sliderValue }));
    }
  };

  const quantityChangeHandler = (value: number) => {
    setSliderValue(value);
  };

  const openEditHandler = () => {
    setEditStock(true);
  };

  const closeEditHandler = () => {
    setEditStock(false);
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLElement>) => {
    if (editRef.current && !editRef.current.contains(event.target as Node)) {
      closeEditHandler();
    }
  };

  const singleClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (editStock) {
      handleClickOutside(event);
    } else {
      openQuantityEditHandler();
    }
  };

  const doubleClickHandler = () => {
    setCurrStock((prev) => ({ ...prev, inUse: !prev.inUse }));
  };

  let firingFunc = singleClickHandler;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (firing) {
      firingFunc = doubleClickHandler;
      return;
    }

    firing = true;
    timer = setTimeout(function () {
      firingFunc(event);

      firingFunc = () => singleClickHandler(event);
      firing = false;
    }, 250);
    console.log(timer);
  };

  const touchStartHandler = (event: React.TouchEvent) => {
    touchEndX = event.touches[0].clientX;
  };

  const touchMoveHandler = (event: React.TouchEvent) => {
    touchStartX = event.touches[0].clientX;
    if (user?.isAdmin && touchStartX - touchEndX > swipeDist) {
      openEditHandler();
    }
  };

  const errorHandler = () => {
    clearError();
    setCurrStock(stock);
  };

  /* ************************************************************************************************** */

  const TXT_CANCEL = "ביטול";
  const TXT_EDIT = "ערוך";
  const TXT_DELETE = "מחק";
  const TXT_CONFIRM_DELETE = "אתה בטוח שאתה קוצה למחוק";
  const TXT_CONFIRM = "אתה בטוח";
  const TXT_QUANTITY = "כמות";

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <Modal
        show={isConfirmVisible}
        onCancel={closeConfirmHandler}
        header={TXT_CONFIRM}
        footerClass="item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmHandler}>
              {TXT_CANCEL}
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              {TXT_DELETE}
            </Button>
          </React.Fragment>
        }
      >
        <p>{TXT_CONFIRM_DELETE}</p>
      </Modal>
      <Modal
        show={quantityEdit}
        onCancel={closeQuantityEditHandler}
        header={`${stock.name} ${TXT_QUANTITY}`}
      >
        <NumberSlider
          defaultValue={stock.quantity}
          onChange={quantityChangeHandler}
        />
      </Modal>
      <li
        className="list-item"
        onClick={clickHandler}
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
      >
        {/* {stock.image && (
          <img
            className="item-img"
            src={BACKEND_URL + stock.image}
            alt="item"
          />
        )}
        <div className="item-info">
          <p>{stock.name}</p>
          <div className="colored-circle" style={style} />
        </div>
        <h2>{currStock.quantity}</h2>
        {editStock && (
          <div className="item__actions" ref={editRef}>
            <Button to={`/stocks/${stock._id}`}>{TXT_EDIT}</Button>
            <Button danger={true} onClick={openConfirmHandler}>
              {TXT_DELETE}
            </Button>
          </div>
        )} */}
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={stock.image}
            title="stock preview"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {stock.name}
            </Typography>
            <Typography variant="h5" component="div" align="center">
              {stock.quantity}
            </Typography>
          </CardContent>
          {editStock && (
            <CardActions>
              <Button to={`/stocks/${stock._id}`}>{TXT_EDIT}</Button>
              <Button danger={true} onClick={openConfirmHandler}>
                {TXT_DELETE}
              </Button>
            </CardActions>
          )}
        </Card>
      </li>
    </React.Fragment>
  );
}
