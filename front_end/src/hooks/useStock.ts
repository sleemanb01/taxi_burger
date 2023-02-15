import { useState } from "react";
import { IStock } from "../types/interfaces";
import { StocksWActions } from "../types/types";

export const useStocks = (): StocksWActions => {
  const [values, setValues] = useState<IStock[]>([]);
  const [displayArray, setDisplayArray] = useState<string[]>([]);

  const clickHandler = (id: string) => {
    const alreadyExists = displayArray.includes(id);

    if (alreadyExists) {
      setDisplayArray((prev) => prev.filter((e) => e !== id));
      return;
    }

    setDisplayArray((prev) => [...prev, id]);

    const element = document.getElementById(`${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return { values, setValues, displayArray, clickHandler };
};
