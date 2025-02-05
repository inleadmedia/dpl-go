import app from "./app"
import materialTypes from "./materialTypes"
import routes from "./routes"
import search from "./search"
import serviceDplCms from "./service.dplCms"
import serviceFbi from "./service.fbi"
import token from "./token"

export const resolvers = {
  ...app,
  ...serviceDplCms,
  ...serviceFbi,
  ...search,
  ...token,
  ...materialTypes,
  ...routes,
}

export type TResolvers = typeof resolvers
export type TConfigKey = keyof TResolvers
