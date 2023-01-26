import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UIElements/Modal";
import { IStock } from "../../../typing/interfaces";

import "./StockItem.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";

import { BACKEND_URL, ENDPOINT_STOCKS } from "../../../util/Constants";

/* ************************************************************************************************** */

export function StockItem({
  stock,
  onDelete,
}: {
  stock: IStock;
  onDelete: Function;
}) {
  // const nav = useNavigate();
  const user = useContext(AuthContext).user;
  const { error, sendRequest, clearError } = useHttpClient();

  const [currStock, setCurrStock] = useState(stock);
  const [editStock, setEditStock] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  let timer: ReturnType<typeof setTimeout>;
  let firing = false;
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

  const editHandler = () => {
    setEditStock((prev) => !prev);
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

  const singleClickHandler = () => {
    console.log("single");
  };

  const doubleClickHandler = () => {
    setCurrStock((prev) => ({ ...prev, inUse: !prev.inUse }));
  };

  let firingFunc = singleClickHandler;

  const clickHandler = () => {
    if (firing) {
      firingFunc = doubleClickHandler;
      return;
    }

    firing = true;
    timer = setTimeout(function () {
      firingFunc();

      firingFunc = singleClickHandler;
      firing = false;
    }, 250);
    console.log(timer);
  };

  const swipeHandler = () => {
    editHandler();
  };

  const touchStartHandler = (event: React.TouchEvent) => {
    touchEndX = event.touches[0].clientX;
  };

  const touchMoveHandler = (event: React.TouchEvent) => {
    touchStartX = event.touches[0].clientX;
    if (user?.isAdmin && touchStartX - touchEndX > swipeDist) {
      swipeHandler();
    }
  };

  /* ************************************************************************************************** */

  const style = { backgroundColor: currStock.inUse ? "yellow" : "" };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={isConfirmVisible}
        onCancel={closeConfirmHandler}
        header="Are you sure?"
        footerClass="item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this!</p>
      </Modal>
      <li
        className="list-item"
        onClick={clickHandler}
        onTouchStart={touchStartHandler}
        onTouchMove={touchMoveHandler}
      >
        {stock.image && (
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
          <div className="item__actions">
            <Button to={`/stocks/${stock._id}`}>EDIT</Button>
            <Button danger={true} onClick={openConfirmHandler}>
              DELETE
            </Button>
          </div>
        )}
      </li>
    </React.Fragment>
  );
}
