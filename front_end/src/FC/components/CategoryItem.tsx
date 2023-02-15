import React from "react";
import { StocksList } from "./StocksList";
import { ICategory } from "../../types/interfaces";
import { StocksWActions } from "../../types/types";

import "../../styles/css/CategoryItem.css";

function CategoryItem({
  isVisible,
  category,
  stocksWActions,
}: {
  isVisible: boolean;
  category: ICategory;
  stocksWActions: StocksWActions;
}) {
  const { values, setValues, clickHandler } = stocksWActions;
  const clickedStyle = isVisible ? "visible" : "";
  const classes = `category-content__item ${clickedStyle}`;
  return (
    <React.Fragment>
      <div
        className={classes}
        onClick={() => clickHandler(category._id!)}
        id={category._id}
      >
        <p>{category.name}</p>
      </div>
      {isVisible && (
        <StocksList
          stocks={values.filter((e) => e.categoryId === category._id)}
          setStocks={setValues}
        />
      )}
    </React.Fragment>
  );
}

export default CategoryItem;
