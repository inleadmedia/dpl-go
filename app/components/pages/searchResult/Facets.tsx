import "./search.css";

import React from "react";

import { SearchFacetsQuery } from "@/src/gql/graphql";

import Debug from "./Debug";
import NoResult from "./NoResult";

const Facets = <TData extends SearchFacetsQuery>({
  data,
  searchTerm
}: {
  data: TData;
  searchTerm: string | null;
}) => {
  return (
    <>
      <h2>FILTERS, BABYYYYY</h2>
      {data.search.hitcount > 0 && <Debug data={data} />}
      <ul className="search__result">
        {data.search.facets.map((item, index) => (
          <li key={index} className="search__result-card">
            <h3>{item.name}</h3>
            <ul>
              {item.values.map((facetValue, index) => (
                <li key={index}>
                  {facetValue.term} - ({facetValue.score})
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {searchTerm !== null && data.search.hitcount == 0 && <NoResult />}
    </>
  );
};

export default Facets;
