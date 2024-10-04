"use client";

import "./search.css";

import React, { useState } from "react";
import { FallingLines } from "react-loader-spinner";

import {
  FacetField,
  SearchQuery,
  useSearchFacetsQuery,
  useSearchWithPaginationQuery
} from "@/src/gql/graphql";
import { getLibraryToken } from "@/utils/libraryToken";

import Facets from "./Facets";
import Result from "./Result";

export interface ButtonProps {
  message?: string;
}

/**
 * Primary UI component for user interaction
 */
const SearchResult = () => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [tempSearchTerm, seTempSearchTerm] = useState<string | null>(null);
  const q: SearchQuery = {
    all: searchTerm
  };

  const { data, isError, isLoading, isFetching, isLoadingError } =
    useSearchWithPaginationQuery(
      {
        endpoint: "https://fbi-api.dbc.dk/ereolgo/graphql",
        fetchParams: {
          headers: {
            Authorization: `Bearer ${getLibraryToken()}`,
            "Content-Type": "application/json"
          }
        }
      },
      {
        q,
        offset: 0,
        limit: 10,
        filters: {
          branchId: [
            "775120",
            "775122",
            "775144",
            "775167",
            "775146",
            "775168",
            "751010",
            "775147",
            "751032",
            "751031",
            "775126",
            "751030",
            "775149",
            "775127",
            "775160",
            "775162",
            "775140",
            "751009",
            "751029",
            "751027",
            "751026",
            "751025",
            "775133",
            "751024",
            "775100",
            "775170",
            "775150",
            "775130"
          ]
        }
      },
      {
        enabled: searchTerm !== null
      }
    );

  const {
    data: facetData,
    isError: facetError,
    isLoading: facetisLoading,
    isFetching: facetIsFetching,
    isLoadingError: facetisLoadingError
  } = useSearchFacetsQuery(
    {
      endpoint: "https://fbi-api.dbc.dk/ereolgo/graphql",
      fetchParams: {
        headers: {
          Authorization: `Bearer ${getLibraryToken()}`,
          "Content-Type": "application/json"
        }
      }
    },
    {
      q,
      facetLimit: 100,
      facets: [
        "materialTypesGeneral",
        "mainLanguages",
        "age",
        "lix",
        "subjects",
        "let"
      ] as FacetField[]
    },
    {
      enabled: searchTerm !== null
    }
  );
  const onClick = () => {
    setSearchTerm(tempSearchTerm);
  };

  return (
    <div className="search">
      <div className="search__inputs">
        <input
          type="search"
          className="search__input-field"
          placeholder="Search..."
          onChange={(e) => {
            seTempSearchTerm(e.target.value);
            if (searchTerm !== null) {
              setSearchTerm(null);
            }
          }}
          onInput={(e) => {
            if (!e.currentTarget.value) {
              setSearchTerm(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
        />
        <button onClick={onClick}>Search</button>
      </div>
      {/* {!data && isFetching && (
        <div>
          <FallingLines color="#1ea7fd" width="100" visible={true} />
        </div>
      )}
      {!facetisLoading && facetData && facetData.search && (
        <Facets data={facetData} searchTerm={searchTerm} />
      )}
      {!isLoading && data && data.search && (
        <Result data={data} searchTerm={searchTerm} />
      )}
      {isError && (
        <div>
          <p>
            Error... something went wrong.{" "}
            {isLoadingError && (
              <span>Seems like the fetch request failed.</span>
            )}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default SearchResult;
