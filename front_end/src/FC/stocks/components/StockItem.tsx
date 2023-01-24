import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { IStock } from "../../../typing/interfaces";

import "./StockItem.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";

import { BACKEND_URL, ENDPOINT_STOCKS } from "../../../util/Constants";
import { useNavigate } from "react-router-dom";

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

  const [value, setValue] = useState(stock.quantity);
  const [editStock, setEditStock] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);

  let clicks = 0;

  /* ************************************************************************************************** */

  const openConfirmHandler = () => {
    setIsConfirmVisible(true);
  };

  const closeConfirmHandler = () => {
    setIsConfirmVisible(false);
  };

  // const openEditHandler = () => {
  //   setIsEdit(true);
  // };

  // const closeEditHandler = () => {
  //   setIsEdit(false);
  // };

  const confirmDeleteHandler = async () => {
    closeConfirmHandler();

    try {
      await sendRequest(ENDPOINT_STOCKS + "/" + stock._id, "DELETE", null, {
        Authorization: "Barer " + user?.token,
      });
      onDelete(stock._id);
    } catch (err) {}
  };

  const clickHandler = () => {
    if (user?.isAdmin) {
      clicks++;
      if (clicks === 2) {
        clicks = 0;
        doubleClickHandler();
      }
    }

    // openEditHandler();
  };

  const doubleClickHandler = () => {
    if (user?.isAdmin) {
      setEditStock((prev) => !prev);
    }
  };

  // const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const valueNumber = parseInt(e.target.value);
  //   setValue(valueNumber);
  // };

  /* ************************************************************************************************** */

  const style = { backgroundColor: stock.inUse ? "yellow" : "" };

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
      <li className="list-item" onClick={clickHandler}>
        {stock.image && (
          <img className="item-img" src={BACKEND_URL + stock.image} />
        )}
        <div>
          <p>{stock.name}</p>
          <span className="colored-circle" style={style} />
        </div>
        <h2>{value}</h2>
        {/* <Modal show={isEdit} onCancel={closeEditHandler}>
          <div>
            <input
              type="range"
              name="temp"
              min={1}
              max={20}
              step={1}
              value={stock.quantity}
              onChange={inputChangeHandler}
            />
          </div>
        </Modal> */}
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
