import React from "react";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../../hooks/http-hook";
import { ICategory, IStock } from "../../../typing/interfaces";
import { ENDPOINT_STOCKS } from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import CategoryItem from "../components/CategoryItem";

function Stocks() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [displayArray, setDisplayArray] = useState<string[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await sendRequest(ENDPOINT_STOCKS);
        const fetchedCategoris = res.categories;

        localStorage.setItem("categories", JSON.stringify(fetchedCategoris));
        setCategories(fetchedCategoris);
        console.log(res);

        setStocks(res.stocks);
      } catch (err) {}
    };

    fetchStocks();
  }, [sendRequest]);

  const stockDeletedHandler = (deletedstockId: string) => {
    setStocks((prevstocks) =>
      prevstocks.filter((p) => p._id !== deletedstockId)
    );
  };

  const categoryClickHandler = (id: string) => {
    const alreadyExists = displayArray.includes(id);

    if (alreadyExists) {
      setDisplayArray((prev) => prev.filter((e) => e !== id));
      return;
    }

    setDisplayArray((prev) => [...prev, id]);
  };

  if (categories.length === 0) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          isVisible={displayArray.includes(category._id!)}
          category={category}
          stocks={stocks}
          clickHandler={categoryClickHandler}
          deleteHandler={stockDeletedHandler}
        />
      ))}
    </React.Fragment>
  );
}

export default Stocks;
