import React, {useEffect, useState} from 'react';
import './App.css';
import {traverse, TraverseResult} from "./arcgis/traversal";

function App() {
    const [layers, setLayers] = useState({} as TraverseResult)
    const [url, setUrl] = useState("https://gismaps.kingcounty.gov/arcgis/rest/services")
    let getLayers = () => {
        traverse(url).then(setLayers)
    }

    useEffect(() => {
      getLayers()
    }, [url])

    return (
      <div>
        <form style={{paddingLeft: "20px"}}>
          <label >Url:</label><br/><br/>
          <input type="text" id="url" name="url" onChange={event => setUrl(event.target.value)} value={url}/>
        </form>
        <pre>
              {JSON.stringify(layers.layers?.map(l => l.name), undefined, 2)}
            </pre>
      </div>
    );
}

export default App;
