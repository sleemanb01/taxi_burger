import React, { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { BasicModal } from "../assest/UIElements/Modal";
import { AuthContext } from "../../hooks/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { ShiftContext } from "../../hooks/shift-context";
import { IStock } from "../../types/interfaces";
import { partialStock } from "../../types/types";
import {
  ENDPOINT_STOCKS_PARTIAL,
  DEFAULT_HEADERS,
  ENDPOINT_STOCKS,
} from "../../util/constants";
import LoadingSpinner from "../assest/LoadingSpinner";
import { SimpleDialog } from "./SliderDialog";

import "../../styles/css/StockItem.css";
import { ErrorModal } from "../assest/UIElements/ErrorModal";
import {
  TXT_CONFIRM,
  TXT_CONFIRM_DELETE,
  TXT_CANCEL,
  TXT_DELETE,
} from "../../util/txt";

/* ************************************************************************************************** */

export function StockItem({
  stock,
  onDelete,
}: {
  stock: IStock;
  onDelete: Function;
}) {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const { shift } = useContext(ShiftContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [currStock, setCurrStock] = useState<IStock>(stock);
  const [quantityEdit, setQuantityEdit] = useState(false);
  const [editStock, setEditStock] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  useEffect(() => {
    const updateStockHandler = async () => {
      const partial: partialStock = {
        quantity: currStock.quantity,
        minQuantity: currStock.minQuantity,
      };

      try {
        await sendRequest(
          ENDPOINT_STOCKS_PARTIAL + "/" + stock._id + "/" + shift?._id,
          "PATCH",
          JSON.stringify(partial),
          {
            ...DEFAULT_HEADERS,
            Authorization: "Barer " + user?.token,
          }
        );
      } catch (err) {}
    };
    if (
      (stock.quantity !== currStock.quantity ||
        stock.minQuantity !== currStock.minQuantity) &&
      shift
    ) {
      updateStockHandler();
    }
  }, [
    sendRequest,
    currStock,
    stock._id,
    stock,
    user?.token,
    shift,
    shift?._id,
  ]);

  /* ************************************************************************************************** */

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeDist = 100;

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
  };

  const quantityChangeHandler = (edited: partialStock) => {
    setCurrStock((prev) => ({ ...prev, ...edited }));
  };

  const openEditHandler = () => {
    setEditStock(true);
  };

  const closeEditHandler = () => {
    setEditStock(false);
  };

  const stockEditHandler = () => {
    nav(`/stocks/${stock._id}`);
  };

  const clickHandler = (_: React.MouseEvent<HTMLElement>) => {
    if (editStock) {
      closeEditHandler();
    } else {
      openQuantityEditHandler();
    }
  };
  const touchStartHandler = (event: React.TouchEvent) => {
    touchEndX = event.touches[0].clientX;
  };

  const touchMoveHandler = (event: React.TouchEvent) => {
    touchStartX = event.touches[0].clientX;
    if (touchStartX - touchEndX > swipeDist) {
      openEditHandler();
    }
  };

  const errorHandler = () => {
    clearError();
    setCurrStock(stock);
  };

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <BasicModal
        show={isConfirmVisible}
        onCancel={closeConfirmHandler}
        header={TXT_CONFIRM}
        content={TXT_CONFIRM_DELETE}
        footer={
          <React.Fragment>
            <Button color="secondary" onClick={closeConfirmHandler}>
              {TXT_CANCEL}
            </Button>
            <Button color="error" onClick={confirmDeleteHandler}>
              {TXT_DELETE}
            </Button>
          </React.Fragment>
        }
      />

      <SimpleDialog
        open={quantityEdit}
        onClose={closeQuantityEditHandler}
        onChange={quantityChangeHandler}
        stock={currStock}
      />
      <li
        className="list-item"
        onClick={clickHandler}
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
      >
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
              {currStock.quantity}
            </Typography>
          </CardContent>
          {editStock && (
            <CardActions>
              <IconButton aria-label="edit" onClick={stockEditHandler}>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={openConfirmHandler}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          )}
        </Card>
      </li>
    </React.Fragment>
  );
}