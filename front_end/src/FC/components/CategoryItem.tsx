import React from "react";
import { ICategory } from "../../types/interfaces";
import { StocksWActions } from "../../types/types";

import "../../styles/css/CategoryItem.css";
import { StockItem } from "./StockItem";
import List from "./util/UIElements/List";

function CategoryItem({
  item,
  stocksWActions,
}: {
  item: ICategory;
  stocksWActions: StocksWActions;
}) {
  const { displayArray, values, setValues, clickHandler } = stocksWActions;

  const isVisible = displayArray.includes(item._id!);
  const clickedStyle = isVisible ? "visible" : "";
  const classes = `category-content__item ${clickedStyle}`;
  return (
    <React.Fragment>
      <div
        className={classes}
        onClick={() => clickHandler(item._id!)}
        id={item._id}
      >
        <p>{item.name}</p>
      </div>
      {isVisible && (
        <List
          renderItem={StockItem}
          keyExtractor={({ _id }) => _id}
          data={values.filter((e) => e.categoryId === item._id)}
          props={{ setStocks: { setValues } }}
        />
      )}
    </React.Fragment>
  );
}

export default CategoryItem;
