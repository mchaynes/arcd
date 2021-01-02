import {arcfetch, Directory} from './server'
import Layer from "@arcgis/core/layers/Layer";

export interface L extends Layer {
  name: string
  url: string
}

export type TraverseResult = {
  serverRoot: string
  layers: L[]
}

export async function traverse(url: string, opts?: RequestInit): Promise<TraverseResult> {
  // only attempt to traverse if its a real url
  if(safeParseUrl(url)) {
    return {
      serverRoot: url,
      layers: await recurseTree(url, opts),
    }
  } else {
    return {
      serverRoot: url,
      layers: [],
    }
  }
}


async function recurseTree(url: string, opts?: RequestInit): Promise<L[]> {
  if (isLayerUrl(url)) {
    const resp = await arcfetch(url, opts)
    const layer: L = await resp.json()
    layer.url = url
    return [layer]
  } else {
    const resp = await arcfetch(url, opts)
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
    let {name, type} = service
    // a MapServer/FeatureServer/etc name can include the folder name, i.e.: 'Behavioralhealth/BHProvider'
    // at the point where we have this server, the url already contains the 'BehavioralHealth' part, so only add the 'BHProvider' part
    if (name.includes("/")) {
      name = name.split("/")[1]
    }
    return `${protocol}//${hostname}${pathname}/${name}/${type}`
  }).forEach(layer => links.push(layer))
  dir.layers?.forEach(layer => links.push(`${protocol}//${hostname}${pathname}/${layer.id}`))
  return links
}

// layer urls end with /<integer>, so check for that
const layerUrlRegex = new RegExp("/[0-9]+$")

/**
 * Determines whether this URL looks like a URL to a layer or not (as opposed to a MapServer, etc)
 */
export function isLayerUrl(url: string): boolean {
  const parsed = safeParseUrl(url);
  return layerUrlRegex.test(parsed?.pathname ?? "")
}

/**
 * Parses URL, returns undefined if the URL is invalid
 */
function safeParseUrl(url: string): URL|undefined {
  try {
    return new URL(url)
  } catch (e) {
    return undefined
  }
}
