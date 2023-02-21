import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
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

import {
  TXT_CONFIRM,
  TXT_CONFIRM_DELETE,
  TXT_CANCEL,
  TXT_DELETE,
} from "../../util/txt";
import { SimpleDialog } from "./util/SliderDialog";
import { ErrorModal } from "./util/UIElements/ErrorModal";
import LoadingSpinner from "./util/UIElements/LoadingSpinner";
import { BasicModal } from "./util/UIElements/Modal";

/* ************************************************************************************************** */

export function StockItem({
  item,
  setStocks,
}: {
  item: IStock;
  setStocks: Dispatch<SetStateAction<IStock[]>>;
}) {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const { shift } = useContext(ShiftContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [currStock, setCurrStock] = useState<IStock>(item);
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
          ENDPOINT_STOCKS_PARTIAL + "/" + item._id + "/" + shift?._id,
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
      (item.quantity !== currStock.quantity ||
        item.minQuantity !== currStock.minQuantity) &&
      shift
    ) {
      updateStockHandler();
    }
  }, [sendRequest, currStock, item._id, item, user?.token, shift, shift?._id]);

  /* ************************************************************************************************** */

  let touchStartX = 0;
  let touchEndX = 0;
  const swipeDist = 100;

  /* ************************************************************************************************** */

  const stockDeletedHandler = (deletedstockId: string) => {
    setStocks((prevstocks) =>
      prevstocks.filter((p) => p._id !== deletedstockId)
    );
  };

  const openConfirmHandler = () => {
    setIsConfirmVisible(true);
  };

  const closeConfirmHandler = () => {
    setIsConfirmVisible(false);
  };

  const confirmDeleteHandler = async () => {
    closeConfirmHandler();

    try {
      await sendRequest(ENDPOINT_STOCKS + "/" + item._id, "DELETE", null, {
        Authorization: "Barer " + user?.token,
      });
      stockDeletedHandler(item._id!);
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
    nav(`/stocks/${item._id}`);
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
    setCurrStock(item);
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
      <Card
        sx={{ m: 3, width: 100 }}
        onClick={clickHandler}
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
      >
        <CardMedia
          sx={{ height: 100 }}
          image={item.image}
          title="stock preview"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            {item.name}
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
    </React.Fragment>
  );
}
