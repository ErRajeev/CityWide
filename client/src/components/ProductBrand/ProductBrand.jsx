import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectProductByBrand } from "../Slices/productsSlice";
import FeaturesCard from "../Features/FeaturesCard/FeaturesCard";

const ProductBrand = (props) => {
  const { data } = props;
  const brand = data;
  const productsByBrand = useSelector((store) =>
    selectProductByBrand(store, brand)
  );

  return (
    <>
      <div className="container">
        <h1>Similar Products</h1>
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4  m-1">
        <FeaturesCard data={productsByBrand} />
      </div>
    </>
  );
};

export default ProductBrand;