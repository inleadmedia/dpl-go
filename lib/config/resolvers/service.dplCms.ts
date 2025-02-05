const serviceFbi = {
  "service.dplcms.url": () => {
    if (process.env.NEXT_PUBLIC_URL_DPL_CMS) {
      return process.env.NEXT_PUBLIC_URL_DPL_CMS
    }
  },
}

export default serviceFbi
