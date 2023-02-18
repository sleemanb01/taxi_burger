import { useCallback, useContext, useEffect, useState } from "react";
import { ICategory, IStock } from "../types/interfaces";
import { StocksWActions } from "../types/types";
import { ENDPOINT_STOCKS } from "../util/constants";
import { getCurrDay } from "../util/time";
import { useHttpClient } from "./http-hook";
import { ShiftContext } from "./shift-context";

export const useStocks = (): StocksWActions => {
  const [values, setValues] = useState<IStock[]>([]);
  const [displayArray, setDisplayArray] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { setShift } = useContext(ShiftContext);

  const { sendRequest } = useHttpClient();

  const clickHandler = useCallback(
    (id: string) => {
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
    },
    [setDisplayArray, displayArray]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await sendRequest(
          ENDPOINT_STOCKS + "/" + new Date(getCurrDay())
        );
        const fetchedCategoris = res.categories;

        localStorage.setItem("categories", JSON.stringify(fetchedCategoris));
        setCategories(fetchedCategoris);
        setValues(res.stocks);
        const fetchedShift = res.shift;
        if (fetchedShift) {
          setShift(fetchedShift);
        }
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, setValues, setShift, setCategories]);

  return {
    values,
    displayArray,
    categories,
    setValues,
    clickHandler,
  };
};
