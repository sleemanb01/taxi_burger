import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { IStock } from "../../../typing/interfaces";

import "./StockItem.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";

import { ENDPOINT_STOCKS } from "../../../util/Constants";
import { useNavigate } from "react-router-dom";

/* ************************************************************************************************** */

export function StockItem({
  stock,
  onDelete,
}: {
  stock: IStock;
  onDelete: Function;
}) {
  const nav = useNavigate();
  const user = useContext(AuthContext).user;
  const { error, sendRequest, clearError } = useHttpClient();
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

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

  const clickHandler = (id: string) => {
    if (user?.isAdmin) {
      openConfirmHandler();
    } else {
      //edit
    }
  };

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
      <li
        className="list-item"
        onClick={() => {
          clickHandler(stock._id!);
        }}
      >
        <React.Fragment>
          <span className="colored-circle" style={style} />
        </React.Fragment>
        <p>{stock.name}</p>
        <h2>{stock.quantity}</h2>
      </li>
    </React.Fragment>
  );
}
