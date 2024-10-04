import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://fbi-api.dbc.dk/ereolgo/graphql": {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_LIBRARY_TOKEN}`
        }
      }
    }
  ],
  documents: "**/*.graphql",

  generates: {
    "src/gql/graphql.ts": {
      // preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query"
      ],
      config: {
        // futureProofEnums: true,
        // withHooks: true,
        namingConvention: {
          typeNames: "change-case-all#pascalCase",
          transformUnderscore: true
        },
        defaultScalarType: "unknown",
        reactQueryVersion: 5
      },
      hooks: {
        afterOneFileWrite: [
          // "yarn post-process-generated-graphql",
          "yarn eslint --fix"
        ]
      }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
