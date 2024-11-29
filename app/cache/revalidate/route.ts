import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// const paramsSchema = z.object({
//   type: z.union([z.literal("tag"), z.literal("path")]),
// })

const paramsSchema = z.union([
  z.object({
    type: z.literal("tag"),
    tags: z.array(z.string().regex(/^[a-zA-Z0-9-]+$/)),
  }),
  z.object({
    type: z.literal("path"),
    paths: z.array(z.string().regex(/^\/[a-zA-Z0-9-\/]+$/)),
  }),
])

export async function POST(request: NextRequest) {
  const body = await request.json()
  try {
    const params = paramsSchema.parse(body)

    switch (params.type) {
      case "tag":
        params.tags.forEach(tag => {
          revalidateTag(tag)
        })
        break
      case "path":
        params.paths.forEach(path => {
          revalidatePath(path)
        })
        break
    }

    return NextResponse.json({ params })
  } catch (e) {
    // console.log("ze error", e)
    return NextResponse.json({ error: "Wrong input" }, { status: 422 })
  }
}

export const dynamic = "force-dynamic"
