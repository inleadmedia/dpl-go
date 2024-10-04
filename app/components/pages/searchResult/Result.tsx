import "./search.css";

import React, { useEffect, useState } from "react";

import { SearchWithPaginationQuery } from "@/src/gql/graphql";
import { getLibraryToken } from "@/utils/libraryToken";

import Debug from "./Debug";
import NoResult from "./NoResult";

const ResultItem = (
  item: SearchWithPaginationQuery["search"]["works"]["0"]
) => {
  const [coverData, setCoverData] = useState<any>(null);
  const getCoverData = async (pid: string) => {
    const libraryToken = getLibraryToken();
    const authHeaders = libraryToken
      ? ({ Authorization: `Bearer ${libraryToken}` } as object)
      : {};

    const headers = {
      ...authHeaders
    };
    try {
      const response = await fetch(
        `https://cover.dandigbib.org/api/v2/covers?type=pid&identifiers=${pid}&sizes=original`,
        {
          method: "GET",
          headers
        }
      );
      const data = await response.json();
      setCoverData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoverData(item.manifestations.bestRepresentation.pid);
  }, []);

  return (
    <li key={item.workId} className="search__result-card">
      {coverData && (
        <img
          alt=""
          src={coverData[0]?.imageUrls?.original.url}
          style={{ width: "200px" }}
        />
      )}
      <h3>{item.titles.full}</h3>
      <h4>
        {item.manifestations.bestRepresentation.creators[0]?.display}
        {item.manifestations.bestRepresentation?.workYear?.year
          ? ` (${item.manifestations.bestRepresentation?.workYear?.year})`
          : ""}
      </h4>
      {item?.abstract ? <p>{item.abstract[0]}</p> : ""}
      {item.materialTypes.map((materialType) => {
        return <p>{materialType.materialTypeGeneral.display}</p>;
      })}
    </li>
  );
};

const Result = <TData extends SearchWithPaginationQuery>({
  data,
  searchTerm
}: {
  data: TData;
  searchTerm: string | null;
}) => {
  return (
    <>
      <h2>RESULTS, BABYYYYY</h2>
      {data.search.hitcount > 0 && <Debug data={data} />}
      <ul className="search__result">
        {data.search.works.map((item) => (
          <ResultItem {...item} />
        ))}
      </ul>
      {searchTerm !== null && data.search.hitcount == 0 && <NoResult />}
    </>
  );
};

export default Result;
