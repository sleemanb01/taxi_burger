import React from "react";

interface Props {
  renderItem: (item: any) => React.ReactNode;
  keyExtractor: (item: any) => string;
  data: Array<any>;
}

function List({ renderItem, keyExtractor, data }: Props) {
  if (data.length === 0) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <li className="list">
      {data.map((item) => (
        <li key={keyExtractor(item)} className="item">
          {renderItem(item)}
        </li>
      ))}
    </li>
  );
}
export default List;
