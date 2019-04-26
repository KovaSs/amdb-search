import React from "react";
import { CollapceItem } from "./CollapceItem";
import "./collapce-container.scss";


const CollapceContainer = props => {
  const { companyResponse } = props.store
  return (
    <div className="table-info">
      <CollapceItem source={companyResponse}/>
    </div>
  );
};

export { CollapceContainer };
