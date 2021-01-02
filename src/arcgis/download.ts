import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export enum JobState {
  NOT_STARTED = "NOT_STARTED",
  CANCELLED = "CANCELLED",
  RUNNING = "RUNNING",
  ERROR = "ERROR",
  COMPLETED = "COMPLETED"
}

interface DownloadJobParams {
  url: string
  outFile: string
  updateWatchers: (job: DownloadJob) => void
}

export class DownloadJob implements DownloadJobParams {
  done: number
  total: number
  state: JobState
  errorMsg?: string
  outFile: string
  url: string
  updateWatchers: (job: DownloadJob) => void

  constructor(params: DownloadJobParams) {
    this.outFile = params.outFile
    this.url = params.url
    this.done = 0
    this.total = 0
    this.state = JobState.NOT_STARTED
    this.updateWatchers = params.updateWatchers
  }
  sendUpdate() {
    if(this.updateWatchers) {
      this.updateWatchers(this)
    }
  }

}

export function download(params: DownloadJobParams): DownloadJob {
  const job = new DownloadJob(params)
  const layer  = new FeatureLayer();
  layer.url = params.url
  layer.load()
    .then(() => begin(layer, job))
    .catch((e) => {
      console.error(e)
      job.state = JobState.ERROR
      job.errorMsg = e
    })
  return job
}

async function begin(layer: FeatureLayer, job: DownloadJob) {
  const {updateWatchers} = job
  job.state = JobState.RUNNING
  const objectIds: number[] = await layer.queryObjectIds({
    where: "1=1"
  })
  job.total = objectIds.length
  const pages = paginateObjectIds(objectIds)
  for(let page of pages) {
    const features = await layer.queryFeatures({
      where: `OBJECTID IN (${page.join(",")})`,
      outFields: ["*"]
    })
    job.done += features.features.length
    job.sendUpdate()
  }
  job.state = JobState.COMPLETED
  job.sendUpdate()
}

const MAX_PAGE_LENGTH = 200;

function paginateObjectIds(ids: number[]): number[][] {
  const pages: number[][] = []
  let page: number[] = []
  for (let id of ids) {
    if(page.length === MAX_PAGE_LENGTH) {
      pages.push(page)
      page = []
    }
    page.push(id)
  }
  pages.push(page)
  return pages
}