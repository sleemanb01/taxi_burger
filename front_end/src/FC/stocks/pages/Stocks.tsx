import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http-hook";
import { IStock } from "../../../typing/interfaces";
import { ENDPOINT_STOCKS } from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { StocksList } from "../components/StocksList";

function Stocks() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stocks, setStocks] = useState<IStock[]>([]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await sendRequest(ENDPOINT_STOCKS);

        setStocks(res.stocks);
      } catch (err) {}
    };

    fetchStocks();
  }, [sendRequest, userId]);

  const stockDeletedHandler = (deletedstockId: string) => {
    setStocks((prevstocks) =>
      prevstocks.filter((p) => p._id !== deletedstockId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <StocksList stocks={stocks} onDeletestock={stockDeletedHandler} />
    </React.Fragment>
  );
}

export default Stocks;
