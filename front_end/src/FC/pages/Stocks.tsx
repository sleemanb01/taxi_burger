import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { DEFAULT_HEADERS, ENDPOINT_SHIFTS } from "../../util/constants";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import StepperDialog from "../components/StepperDialog";
import { ShiftContext } from "../../hooks/shift-context";
import { StocksWActions } from "../../types/types";
import CategoryItem from "../components/CategoryItem";
import { ErrorModal } from "../assest/UIElements/ErrorModal";

function Stocks({ stocksWActions }: { stocksWActions: StocksWActions }) {
  const { displayArray, categories } = stocksWActions;

  const nav = useNavigate();
  const { shift, setShift } = useContext(ShiftContext);
  const { user } = useContext(AuthContext);

  const { error, sendRequest, clearError } = useHttpClient();
  const [openShiftPicker, setOpenShiftPicker] = useState(false);

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
    } else {
      setOpenShiftPicker(true);
    }
  }, [
    shift,
    shift?._id,
    sendRequest,
    user?.token,
    setShift,
    setOpenShiftPicker,
  ]);

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
          stocksWActions={stocksWActions}
        />
      ))}
      {user?.email === process.env.MANAGER && (
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

export default React.memo(Stocks);
