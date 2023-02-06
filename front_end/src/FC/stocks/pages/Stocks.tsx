import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ICategory, IStock } from "../../../typing/interfaces";
import { ENDPOINT_STOCKS } from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import CategoryItem from "../components/CategoryItem";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

function Stocks({
  setter,
  clickHandler,
  displayArray,
  setIsLoading,
}: {
  setter: Function;
  clickHandler: Function;
  displayArray: string[];
  setIsLoading: Function;
}) {
  const nav = useNavigate();
  const auth = useContext(AuthContext).user;
  const isAdmin = auth?.isAdmin;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await sendRequest(ENDPOINT_STOCKS);
        const fetchedCategoris = res.categories;

        localStorage.setItem("categories", JSON.stringify(fetchedCategoris));
        setCategories(fetchedCategoris);
        setter(res.stocks);
        setStocks(res.stocks);
      } catch (err) {}
    };

    fetchStocks();
  }, [sendRequest, setter]);

  if (isLoading) {
    setIsLoading(false);
  }

  const stockDeletedHandler = (deletedstockId: string) => {
    setStocks((prevstocks) =>
      prevstocks.filter((p) => p._id !== deletedstockId)
    );
  };

  const addClickHandler = () => {
    nav("/stocks/new/undefined");
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )} */}
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          isVisible={displayArray.includes(category._id!)}
          category={category}
          stocks={stocks}
          clickHandler={clickHandler}
          deleteHandler={stockDeletedHandler}
        />
      ))}
      {isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
          }}
          onClick={addClickHandler}
        >
          <AddIcon />
        </Fab>
      )}
    </React.Fragment>
  );
}

export default Stocks;
