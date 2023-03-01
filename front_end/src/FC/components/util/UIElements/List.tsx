import React from "react";

import "../../../../styles/css/global.css";
import { ListProps } from "../../../../types/types";

function List({ renderItem, keyExtractor, data, props }: ListProps) {
  if (data.length === 0) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <ul className="list">
      {data.map((item) => {
        return (
          <li key={keyExtractor(item)}>{renderItem({ ...props, item })}</li>
        );
      })}
    </ul>
  );
}
export default List;
