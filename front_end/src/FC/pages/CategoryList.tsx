import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useHttpClient } from "../../hooks/http-hook";
import { IStock, ICategory } from "../../typing/interfaces";
import { ENDPOINT_STOCKS } from "../../util/Constants";

export default function CategoryList() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [stocks, setStocks] = React.useState<IStock[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [displayArray, setDisplayArray] = React.useState<string[]>([]);

  React.useEffect(() => {
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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
      </Stack>
    </Box>
  );
}
