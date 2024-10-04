import "./search.css";

import React from "react";
import { useCollapse } from "react-collapsed";
import { JSONTree } from "react-json-tree";

export interface ButtonProps {
  data: Record<string, unknown>;
}

const Debug = <TData extends Record<string, unknown>>({
  data
}: {
  data: TData;
}) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <>
      <button className="search__debug-button" {...getToggleProps()}>
        {isExpanded ? "Hide debug data ⋀" : "Show debug data ⋁"}
      </button>
      <section {...getCollapseProps()}>
        {isExpanded && (
          <JSONTree
            data={data.search}
            shouldExpandNodeInitially={(keyPath, data, level) => {
              return level < 3;
            }}
          />
        )}
      </section>
    </>
  );
};

export default Debug;
