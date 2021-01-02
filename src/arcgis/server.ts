
export class SourceSpatialReference {
    wkid: number = 0
    latestWkid: number = 0
    xyTolerance: number = 0
    zTolerance: number = 0
    mTolerance: number = 0
    falseX: number = 0
    falseY: number = 0
    xyUnits: number = 0
    falseZ: number = 0
    zUnits: number = 0
    falseM: number = 0
    mUnits: number = 0
}

export class Outline {
    type: string = ''
    style: string = ''
    color: number[] = []
    width: number = 0
}

export class Symbol {
    type: string = ''
    style: string = ''
    color: number[] = []
    outline: Outline = new Outline();
}

export class Renderer {
    type: string = ''
    symbol: Symbol = new Symbol();
}

export class DrawingInfo {
    renderer: Renderer = new Renderer();
    transparency: number = 0
    labelingInfo?: any;
}

export class SpatialReference {
    wkid: number = 0
    latestWkid: number = 0
    xyTolerance: number = 0
    zTolerance: number = 0
    mTolerance: number = 0
    falseX: number = 0
    falseY: number = 0
    xyUnits: number = 0
    falseZ: number = 0
    zUnits: number = 0
    falseM: number = 0
    mUnits: number = 0
}

export class Extent {
    xmin: number = 0
    ymin: number = 0
    xmax: number = 0
    ymax: number = 0
    spatialReference: SpatialReference = new SpatialReference();
}

export class Field {
    name: string = ''
    type: string = ''
    alias: string = ''
    domain?: any;
    length?: number = 0
}

export class GeometryField {
    name: string = ''
    type: string = ''
    alias: string = ''
}

export class Index {
    name: string = ''
    fields: string = ''
    isAscending: boolean = false
    isUnique: boolean = false
    description: string = ''
}

export class OwnershipBasedAccessControlForFeatures {
    allowOthersToQuery: boolean = false
}

export class AdvancedQueryCapabilities {
    useStandardizedQueries: boolean = false
    supportsStatistics: boolean = false
    supportsHavingClause: boolean = false
    supportsOrderBy: boolean = false
    supportsDistinct: boolean = false
    supportsCountDistinct: boolean = false
    supportsPagination: boolean = false
    supportsTrueCurve: boolean = false
    supportsReturningQueryExtent: boolean = false
    supportsQueryWithDistance: boolean = false
    supportsSqlExpression: boolean = false
}

export class ArchivingInfo {
    supportsQueryWithHistoricMoment: boolean = false
    startArchivingMoment: number = 0
}

export class Layer {
    currentVersion: number = 0
    cimVersion: string = ''
    id: number = 0
    name: string = ''
    type: string = ''
    description: string = ''
    geometryType: string = ''
    sourceSpatialReference: SourceSpatialReference = new SourceSpatialReference();
    copyrightText: string = ''
    parentLayer?: any;
    subLayers: any[] = []
    minScale: number = 0
    maxScale: number = 0
    drawingInfo: DrawingInfo = new DrawingInfo();
    defaultVisibility: boolean = false
    extent: Extent = new Extent();
    hasAttachments: boolean = false
    htmlPopupType: string = ''
    displayField: string = ''
    typeIdField?: any;
    subtypeFieldName?: any;
    subtypeField?: any;
    defaultSubtypeCode?: any;
    fields: Field[] = []
    geometryField: GeometryField = new GeometryField();
    indexes: Index[] = []
    subtypes: any[] = []
    relationships: any[] = []
    canModifyLayer: boolean = false
    canScaleSymbols: boolean = false
    hasLabels: boolean = false
    capabilities: string = ''
    maxRecordCount: number = 0
    supportsStatistics: boolean = false
    supportsAdvancedQueries: boolean = false
    supportedQueryFormats: string = ''
    isDataVersioned: boolean = false
    ownershipBasedAccessControlForFeatures: OwnershipBasedAccessControlForFeatures = new OwnershipBasedAccessControlForFeatures();
    useStandardizedQueries: boolean = false
    advancedQueryCapabilities: AdvancedQueryCapabilities = new AdvancedQueryCapabilities();
    supportsDatumTransformation: boolean = false
    hasMetadata: boolean = false
    isDataArchived: boolean = false
    archivingInfo: ArchivingInfo = new ArchivingInfo();
    supportsCoordinatesQuantization: boolean = false
}

export type Directory = {
    currentVersion: number
    folders: string[]
    services: {
        name: string,
        type: string
    }[]
    layers: {
        id: number,
        name: string,
        parentLayerId: number,
        type: string,
        geometryType: string
    }[]
}

export async function arcfetch(url: string, init?: RequestInit): Promise<Response> {
    const parsed = new URL(url)
    parsed.searchParams.set("f", "json")
    return fetch(parsed.toString(), init)
}