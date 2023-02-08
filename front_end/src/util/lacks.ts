import { IStock } from "../typing/interfaces";

export const calcLacks = (stocks: IStock[]) => {
  let lacks: IStock[] = [];

  stocks.forEach((el) => {
    if (el.quantity < el.minQuantity) {
      lacks = [...lacks, el];
    }
  });

  return lacks;
};
