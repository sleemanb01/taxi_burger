import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { IStock } from "../../../typing/interfaces";

import "../../user/components/Item.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { BACKEND_URL, ENDPOINT_STOCKS } from "../../../util/Constants";
import Avatar from "../../shared/components/UIElements/Avatar";

/* ************************************************************************************************** */

export function StockItem({
  stock,
  onDelete,
}: {
  stock: IStock;
  onDelete: Function;
}) {
  const user = useContext(AuthContext).user;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

  console.log(user?.isAdmin);

  /* ************************************************************************************************** */

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
      <li className="item">
        <Card className="item__content">
          <div className="item__image">
            {stock.image && (
              <Avatar
                image={BACKEND_URL ? BACKEND_URL + stock.image : ""}
                alt={stock.name + "image"}
              />
            )}
          </div>
          <div className="item__info">
            <h2>{stock.name}</h2>
            <h2>{stock.quantity}</h2>
          </div>
          {/* <div className="item__actions">
            {user && <Button to={`/stocks/${stock._id}`}>EDIT</Button>}
            {user && user.isAdmin && (
              <Button danger={true} onClick={openConfirmHandler}>
                DELETE
              </Button>
            )}
          </div> */}
        </Card>
      </li>
    </React.Fragment>
  );
}
