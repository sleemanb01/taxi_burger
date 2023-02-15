import { ILack, IStock } from "../types/interfaces";

export const calcLacks = (stocks: IStock[]) => {
  let lacks: ILack[] = [];

  stocks.forEach((el) => {
    if (el.quantity <= el.minQuantity) {
      const lack: ILack = {
        stock: el,
        isCritical: el.quantity < el.minQuantity,
      };
      lacks = [...lacks, lack];
    }
  });

  let ret: ILack[] = lacks.sort((a, b) => (a.isCritical ? -1 : 1));

  return ret;
};
