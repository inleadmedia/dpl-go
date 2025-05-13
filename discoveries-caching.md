
Upgrade nextjs to 15.4.0-canary.20 (have to looking at 15.4.0-canary.23 which just came out)

Set experimental.dynamicIO to true in nextjs config. Which turns everything upside down.

Suspense in layout.tsx file to avoid error about pages depending on awaitng params etc.

Delete `export const dynamic = "force-dynamic"` which is deprecated in dynamicIO mode.

Had to upgrade tanstack react query because of error about QueryClient using Date.now.
Still get error in layout.tsx when fetching dpl cms config. Maybe we have to query the config differently.

---

Ideas:

---
Notes video:

All components are per default dynamic
Need to wrap async in promises
Possibility for dynamic cache tag (13:50)
