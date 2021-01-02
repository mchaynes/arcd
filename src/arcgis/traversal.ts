import {arcfetch, Directory} from './server'
import Layer from "@arcgis/core/layers/Layer";

export interface L extends Layer {
  name: string
}

export type TraverseResult = {
  serverRoot: string
  layers: L[]
}

export async function traverse(url: string): Promise<TraverseResult> {
  return {
    serverRoot: url,
    layers: await recurseTree(url),
  }
}


async function recurseTree(url: string): Promise<L[]> {
  if (isLayerUrl(url)) {
    console.log(`determined to be a layer: ${url}`)
    const resp = await arcfetch(url)
    const layer: L = await resp.json()
    return [layer]
  } else {
    console.log(`not a layer: ${url}`)
    const resp = await arcfetch(url)
    const dir: Directory = await resp.json()
    const links = resolveLinks(url, dir)
    const layers = []
    for (const link of links) {
      layers.push(...await recurseTree(link))
    }
    return layers
  }
}

/**
 * Resolves tree links from a directory node
 * @param url base url to resolve link to
 * @param dir response for this directory node
 */
function resolveLinks(url: string, dir: Directory): string[] {
  const parsed = safeParseUrl(url)
  if (!parsed) {
    return []
  }
  const {protocol, pathname, hostname} = parsed
  const links: string[] = []
  dir.folders?.forEach((folder) => links.push(`${protocol}//${hostname}${pathname}/${folder}`))
  dir.services?.map(service => {
    let name = service.name
    // a MapServer/FeatureServer/etc name can include the folder name, i.e.: 'Behavioralhealth/BHProvider'
    // at the point where we have this server, the url already contains the 'BehavioralHealth' part, so only add the 'BHProvider' part
    if (name.includes("/")) {
      name = name.split("/")[1]
    }
    return `${protocol}//${hostname}${pathname}/${name}/${service.type}`
  }).forEach(layer => links.push(layer))
  dir.layers?.forEach(layer => links.push(`${protocol}//${hostname}${pathname}/${layer.id}`))
  return links
}

// layer urls end with /<integer>, so check for that
const layerUrlRegex = new RegExp("/[0-9]+")

export function isLayerUrl(url: string): boolean{
  const parsed = safeParseUrl(url);
  return layerUrlRegex.test(parsed?.pathname ?? "")
}

function safeParseUrl(url: string): URL|undefined {
  try {
    return new URL(url)
  } catch (e) {
    console.log(`${url}: ${e}`)
    return undefined
  }
}
