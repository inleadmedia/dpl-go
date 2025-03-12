import { TUserInfo } from "@/app/pubhub/(lib)/types"
import { getPublizonServiceParameters } from "@/lib/helpers/publizon"
import { getUniloginWsCredentials } from "@/lib/helpers/unilogin"
import { createClientAsync } from "@/lib/soap/publizon/v2_7/generated/getlibraryuserorderlist"
import { createClientAsync as createClientAsyncUnilogin } from "@/lib/soap/unilogin/wsiinst-v5/generated/ws"

import { TLibraryUserOrderList } from "./types"

export const getLibraryUserOrderListRequest = async (userInfo: TUserInfo) => {
  const client = await createClientAsync(
    "./lib/soap/publizon/v2_7/wsdl/getlibraryuserorderlist.wsdl"
  )
  const [response] = await client.GetLibraryUserOrderListAsync({
    ...getPublizonServiceParameters(),
    cardnumber: userInfo.uniid,
  })
  return response.GetLibraryUserOrderListResult as TLibraryUserOrderList
}

export const getGroupsRequest = async (institutionId: string) => {
  const client = await createClientAsyncUnilogin("./lib/soap/unilogin/wsiinst-v5/wsdl/ws.wsdl", {
    forceSoap12Headers: true,
  })
  const { username, password } = getUniloginWsCredentials()
  const [response] = await client.hentGrupperAsync({
    wsBrugerid: username,
    wsPassword: password,
    instnr: institutionId,
  })

  return response.gruppe
}

export const getInstitutionUserRequest = async (institutionId: string, userInfo: TUserInfo) => {
  const client = await createClientAsyncUnilogin("./lib/soap/unilogin/wsiinst-v5/wsdl/ws.wsdl", {
    forceSoap12Headers: true,
  })
  const { username, password } = getUniloginWsCredentials()
  const [response] = await client.hentInstBrugerAsync({
    wsBrugerid: username,
    wsPassword: password,
    instnr: institutionId,
    brugerid: userInfo.uniid,
  })

  return response.instBruger
}

export const getInstitutionsRequest = async (institutionIds: string[], userInfo: TUserInfo) => {
  const client = await createClientAsyncUnilogin("./lib/soap/unilogin/wsiinst-v5/wsdl/ws.wsdl", {
    forceSoap12Headers: true,
  })
  const { username, password } = getUniloginWsCredentials()
  const [response] = await client.hentInstitutionerAsync({
    wsBrugerid: username,
    wsPassword: password,
    instnr: institutionIds,
  })

  return response.institution
}
