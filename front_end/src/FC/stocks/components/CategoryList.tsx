import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../../typing/interfaces";

function CategoryList({
  setSelected,
  selected,
}: {
  setSelected: Function;
  selected?: string;
}) {
  const nav = useNavigate();

  const [categories, setCategories] = useState<ICategory[]>([]);
  useLayoutEffect(() => {
    const categories = localStorage.getItem("categories");

    if (categories) {
      setCategories(JSON.parse(categories));
    }
  }, []);

  const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (e.target.value === "newCategory") {
      nav("/category/new");
    }

    setSelected(e.target.value);
  };

  const TXT_SELECT = "בחר קטגוריה";
  const TXT_NEW_CATEGORY = "קטגוריה חדשה";
  const TXT_CATEGORY = "קטגוריה";

  return (
    <React.Fragment>
      <label htmlFor="categories">{TXT_CATEGORY}</label>
      <select
        value={selected}
        name="categories"
        id="categories"
        onChange={selectChangeHandler}
      >
        <option disabled value="default" key="default">
          {`-- ${TXT_SELECT} --`}
        </option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
        <option key="newCategory" value="newCategory">
          {TXT_NEW_CATEGORY}
        </option>
      </select>
    </React.Fragment>
  );
}

export default CategoryList;
