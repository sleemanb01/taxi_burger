import Card from "../../shared/components/UIElements/Card";
import { IStock } from "../../../typing/interfaces";
import { StockItem } from "./StockItem";

import "./StocksList.css";

import { Button } from "../../shared/components/FormElements/Button";

export function StocksList({
  stocks,
  onDeletestock,
}: {
  stocks: IStock[];
  onDeletestock: Function;
}) {
  if (stocks.length === 0) {
    return (
      <div className="stock-list">
        <Card>
          <h2>No stocks found. Maybe create one?</h2>
          <Button to="/stocks/new">Add STOCK</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="stock-list">
      {stocks.map((curr) => (
        <StockItem
          key={curr._id!.toString()}
          stock={curr}
          onDelete={onDeletestock}
        />
      ))}
    </ul>
  );
}
