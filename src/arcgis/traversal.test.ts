import {isLayerUrl} from "./traversal";

describe('isLayerUrl', () => {
  test.each([
    ["https://matterhornvs.co.pierce.wa.us/spatialservices/rest/services/MapServer", false],
    ["https://matterhornvs.co.pierce.wa.us/spatialservices/rest/services//MapServer/0", true],
    ["https://matterhornvs.co.pierce.wa.us/spatialservices/rest/services//MapServer/01", true],
    ["https://matterhornvs.co.pierce.wa.us/spatialservices/rest/services//MapServer/11111", true],
  ])("%p should be %p", (url, isLayer) => {
    expect(isLayerUrl(url)).toBe(isLayer)
  })
});


