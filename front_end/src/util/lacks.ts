import { ILack, IStock } from "../typing/interfaces";

export const calcLacks = (stocks: IStock[]) => {
  let lacks: ILack[] = [];

  stocks.forEach((el) => {
    if (el.quantity < el.minQuantity) {
      const lack: ILack = {
        _id: el._id,
        name: el.name,
        quantity: el.minQuantity,
        image: el.image,
      };
      lacks = [...lacks, lack];
    }
  });

  return lacks;
};
