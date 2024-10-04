import React from "react";
import "./search.css";

export interface ButtonProps {
  data: Record<string, unknown>;
}

const NoResult = () => (
  <div className="search__result-empty">
    <h3>No results found</h3>
  </div>
);

export default NoResult;
