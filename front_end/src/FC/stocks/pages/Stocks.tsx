import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ICategory, IShift, IStock } from "../../../typing/interfaces";
import {
  DEFAULT_HEADERS,
  ENDPOINT_SHIFTS,
  ENDPOINT_STOCKS,
} from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import CategoryItem from "../components/CategoryItem";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { getCurrDay } from "../../../util/time";
import StepperDialog from "../../components/StepperDialog";
import { ShiftContext } from "../../../hooks/shift-context";

function Stocks({
  stocks,
  setStocks,
  clickHandler,
  displayArray,
  stockDeletedHandler,
}: {
  stocks: IStock[];
  setStocks: Function;
  clickHandler: Function;
  displayArray: string[];
  stockDeletedHandler: Function;
}) {
  const nav = useNavigate();
  const { shift, setShift } = useContext(ShiftContext);
  const { user } = useContext(AuthContext);

  const { error, sendRequest, clearError } = useHttpClient();
  const [openShiftPicker, setOpenShiftPicker] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await sendRequest(
          ENDPOINT_STOCKS + "/" + new Date(getCurrDay())
        );
        const fetchedCategoris = res.categories;

        localStorage.setItem("categories", JSON.stringify(fetchedCategoris));
        setCategories(fetchedCategoris);
        setStocks(res.stocks);
        const fetchedShift = res.shift;
        if (fetchedShift) {
          setShift(fetchedShift);
        } else {
          setOpenShiftPicker(true);
        }
      } catch (err) {}
    };

    fetchData();
  }, [sendRequest, setStocks, setShift, setCategories, setOpenShiftPicker]);

  useEffect(() => {
    const uploadShift = async () => {
      try {
        const res = await sendRequest(
          ENDPOINT_SHIFTS,
          "POST",
          JSON.stringify(shift),
          {
            ...DEFAULT_HEADERS,
            Authorization: "Barer " + user?.token,
          }
        );
        const fetchedShift = res.shift;
        setShift(fetchedShift);
        setOpenShiftPicker(false);
      } catch (err) {}
    };

    if (shift && !shift._id) {
      uploadShift();
    }
  }, [shift, shift?._id, sendRequest, user?.token, setShift]);

  const addClickHandler = () => {
    nav("/stocks/new/undefined");
  };

  const closeStepperHandler = () => {
    setOpenShiftPicker(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <StepperDialog
        open={openShiftPicker}
        closeStepperHandler={closeStepperHandler}
        setShift={setShift}
      />
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
      {user?.isAdmin && (
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
