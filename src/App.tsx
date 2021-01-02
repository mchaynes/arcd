import React, {FormEvent, useState} from 'react';
import './App.css';
import {traverse, TraverseResult} from "./arcgis/traversal";

function App() {
    const [layers, setLayers] = useState({} as TraverseResult)
    const [url, setUrl] = useState("https://gismaps.kingcounty.gov/arcgis/rest/services")
    let getLayers = () => {
        traverse(url).then(setLayers)
    }

    let submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getLayers();
    }
    return (
      <div>
        <form onSubmit={submit} style={{paddingLeft: "20px"}}>
          <label >Url:</label><br/><br/>
          <input type="text" id="url" name="url" onChange={event => setUrl(event.target.value)} value={url}/>
          <input type="submit" />
        </form>
        <pre>
              {JSON.stringify(layers.layers?.map(l => l.name), undefined, 2)}
            </pre>
      </div>
    );
}

export default App;
