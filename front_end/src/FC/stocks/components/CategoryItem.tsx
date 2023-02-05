import React from "react";
import { ICategory, IStock } from "../../../typing/interfaces";
import { StocksList } from "./StocksList";

import "./CategoryItem.css";

function CategoryItem({
  isVisible,
  category,
  stocks,
  clickHandler,
  deleteHandler,
}: {
  isVisible: boolean;
  category: ICategory;
  stocks: IStock[];
  clickHandler: Function;
  deleteHandler: Function;
}) {
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
          stocks={stocks.filter((e) => e.categoryId === category._id)}
          onDeletestock={deleteHandler}
        />
      )}
    </React.Fragment>
  );
}

export default CategoryItem;
