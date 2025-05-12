import { NextRequest, NextResponse } from "next/server"

import { withAuth } from "@/app/(routes)/pubhub/(lib)/helper"
import { TUserInfo } from "@/app/(routes)/pubhub/(lib)/types"
import { transformTimeToUtcString } from "@/app/(routes)/pubhub/helper"

import { getLibraryUserOrderListRequest } from "./(lib)/requests"
import { libraryUserOrderListSchema } from "./(lib)/schemas"
import { isOrderItem } from "./(lib)/types"

async function getLibraryUserOrder(request: NextRequest, context: { uniLoginUserInfo: TUserInfo }) {
  const { uniLoginUserInfo } = context
  const libraryUserOrderList = libraryUserOrderListSchema.transform(orderListData => {
    const orderListResponse = orderListData.response
    const orderItem = orderListResponse.data?.orderitem
    const libraryData = orderListResponse.status.LibraryExtension

    const data: {
      code: string
      message: string
      loans?: Record<string, unknown>[]
      libraryData?: Record<string, unknown>
      userData?: Record<string, unknown>
    } = {
      code: orderListResponse.status.code,
      message: orderListResponse.status.message,
    }
    if (orderItem) {
      const orderItems = isOrderItem(orderItem) ? [orderItem] : orderItem
      data.loans = orderItems.map(orderItem => {
        return {
          orderId: orderItem.internalordernumber,
          orderDateUtc: transformTimeToUtcString(orderItem.orderdate),
          loanExpireDateUtc: transformTimeToUtcString(orderItem.loanexpiredate),
          libraryBook: {
            identifier: orderItem.book.attributes.id,
          },
        }
      })
    }
    if (libraryData) {
      data.libraryData = {
        maxAmountPerMonth: Number(libraryData.maxloanpertime),
        maxConcurrentAudiobookLoansPerBorrower: Number(libraryData.maxloanpertimesound),
        maxConcurrentEbookLoansPerBorrower: Number(libraryData.maxloanpertime),
      }
      data.userData = {
        totalLoans: Number(libraryData.usertotalloans),
        totalEbookLoans: Number(libraryData.usertotalebookloans),
        totalAudioLoans: Number(libraryData.usertotalsoundloans),
        ebookLoansRemaining: Number(libraryData.userebookloansremain),
        // There is no direct data field from the SOAP service that gives the remaining amount of audiobooks
        audiobookLoansRemaining:
          Number(libraryData.maxloanpertimesound) - Number(libraryData.usertotalsoundloans),
      }
    }
    if (orderListResponse.data?.friendlycardnumber) {
      data.userData = {
        ...(data.userData ? data.userData : {}),
        friendlycardnumber: orderListResponse.data.friendlycardnumber,
      }
    }

    return data
  })

  try {
    const responseData = await getLibraryUserOrderListRequest(uniLoginUserInfo)
    return NextResponse.json(libraryUserOrderList.parse(responseData))
  } catch (error) {
    console.error(error)
    throw new Response("Unprocessable content", { status: 422 })
  }
}

export const GET = withAuth(getLibraryUserOrder)

export const dynamic = "force-dynamic"
