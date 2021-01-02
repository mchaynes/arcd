import React, {useEffect, useState} from 'react';
import './App.css';
import {isLayerUrl, traverse, TraverseResult} from "./arcgis/traversal";
import {download, DownloadJob} from "./arcgis/download";

interface JobStatuses {
  [key: string]: DownloadJob
}

function App() {
  const [layers, setLayers] = useState({} as TraverseResult)
  const [url, setUrl] = useState("")
  const [jobs, setJobs] = useState<JobStatuses>({})

  useEffect(() => {
    traverse(url).then((layers) => {
      setLayers(layers)
    })
  }, [url])

  function updateJob(url: string, job: DownloadJob) {
    setJobs({
      ...jobs,
      [url]: job
    })
  }

  function startDownload() {
    // short circuit if we've already setup a job
    if (jobs[url]) {
      return
    }
    const job = download({
      url: url,
      outFile: "/Users/myles/out.gdb",
      updateWatchers: (job) => updateJob(url, job)
    })
  }

  return (
    <div>
      <form style={{paddingLeft: "20px"}} onSubmit={(event) => {
        event.preventDefault()
        startDownload()
      }
      }>

        <label>Url:</label><br/><br/>
        <input style={{width: "800px"}} type="text" id="url" name="url" onChange={event => setUrl(event.target.value)}
               value={url}/>
        {
          isLayerUrl(url) ? (
            <input type="submit" value="Download"/>
          ) : (
            <></>
          )
        }
      </form>
      <p>Layers:</p>
      <pre>
        {JSON.stringify(
          layers.layers?.map(l => `${l.url} ${l.name}`)
            .sort((a, b) => a.localeCompare(b)),
          undefined, 2
        )}
      </pre>
      <p>Jobs:</p>
      <pre>
        {JSON.stringify(jobs, undefined, 2)}
      </pre>
    </div>
  );
}

export default App;
