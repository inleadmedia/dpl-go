import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { getServerEnv } from "@/lib/config/env"

const paramsSchema = z.union([
  z.object({
    tags: z.string(),
    path: z.string().optional(),
    secret: z.string(),
  }),
  z.object({
    tags: z.string().optional(),
    path: z.string(),
    secret: z.string(),
  }),
])

export async function handler(request: NextRequest) {
  const secretEnv = getServerEnv("REVALIDATE_CACHE_SECRET")
  const searchParams = request.nextUrl.searchParams
  const requestParams = Object.fromEntries(searchParams.entries())

  try {
    const { tags, path, secret } = paramsSchema.parse(requestParams)

    console.log({ tags, path, secret })

    if (!secret || secret !== secretEnv) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    if (path) {
      revalidatePath(path)
    }

    if (tags) {
      tags.split(",").forEach(tag => revalidateTag(tag))
    }

    return NextResponse.json({ message: "Revalidation successful" })
  } catch (e) {
    console.error("Error parsing params:", e)
    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }
}

export { handler as GET, handler as POST }
export const dynamic = "force-dynamic"
