import React from "react";
import { CollapceItem } from "./CollapceItem";
import "./table-container.scss";


const CollapceContainer = props => {
  const { companyResponse } = props.store
  return (
    <div className="table-info">
      <CollapceItem store={companyResponse}/>
    </div>
  );
};

export { CollapceContainer };
