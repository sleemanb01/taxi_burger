import React from "react";

import "../../../../styles/css/global.css";

interface Props {
  renderItem: (props: any) => React.ReactNode;
  keyExtractor: (item: any) => string;
  data: Array<any>;
  props?: any;
}

function List({ renderItem, keyExtractor, data, props }: Props) {
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
