import { Dispatch, SetStateAction } from "react";
import { IStock } from "../../types/interfaces";
import { StockItem } from "./StockItem";

import "../../styles/css/StocksList.css";

export function StocksList({
  stocks,
  setStocks,
}: {
  stocks: IStock[];
  setStocks: Dispatch<SetStateAction<IStock[]>>;
}) {
  const stockDeletedHandler = (deletedstockId: string) => {
    setStocks((prevstocks) =>
      prevstocks.filter((p) => p._id !== deletedstockId)
    );
  };
  return (
    <ul className="stock-list">
      {stocks.map((curr) => (
        <StockItem
          key={curr._id!.toString()}
          stock={curr}
          onDelete={stockDeletedHandler}
        />
      ))}
    </ul>
  );
}
