// To parse this data:
//
//   import { Convert, Ldtk } from "./file";
//
//   const ldtk = Convert.toLdtk(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * This file is a JSON schema of files created by LDtk level editor (https://ldtk.io).
 *
 * This is the root of any Project JSON file. It contains:  - the project settings, - an
 * array of levels, - a group of definitions (that can probably be safely ignored for most
 * users).
 */
export interface Ldtk {
    /**
     * This object is not actually used by LDtk. It ONLY exists to force explicit references to
     * all types, to make sure QuickType finds them and integrate all of them. Otherwise,
     * Quicktype will drop types that are not explicitely used.
     */
    __FORCED_REFS?: ForcedRefs
    /**
     * LDtk application build identifier.<br/>  This is only used to identify the LDtk version
     * that generated this particular project file, which can be useful for specific bug fixing.
     * Note that the build identifier is just the date of the release, so it's not unique to
     * each user (one single global ID per LDtk public release), and as a result, completely
     * anonymous.
     */
    appBuildId: number
    /**
     * Number of backup files to keep, if the `backupOnSave` is TRUE
     */
    backupLimit: number
    /**
     * If TRUE, an extra copy of the project will be created in a sub folder, when saving.
     */
    backupOnSave: boolean
    /**
     * Project background color
     */
    bgColor: string
    /**
     * Default grid size for new layers
     */
    defaultGridSize: number
    /**
     * Default background color of levels
     */
    defaultLevelBgColor: string
    /**
     * **WARNING**: this field will move to the `worlds` array after the "multi-worlds" update.
     * It will then be `null`. You can enable the Multi-worlds advanced project option to enable
     * the change immediately.<br/><br/>  Default new level height
     */
    defaultLevelHeight?: number | null
    /**
     * **WARNING**: this field will move to the `worlds` array after the "multi-worlds" update.
     * It will then be `null`. You can enable the Multi-worlds advanced project option to enable
     * the change immediately.<br/><br/>  Default new level width
     */
    defaultLevelWidth?: number | null
    /**
     * Default X pivot (0 to 1) for new entities
     */
    defaultPivotX: number
    /**
     * Default Y pivot (0 to 1) for new entities
     */
    defaultPivotY: number
    /**
     * A structure containing all the definitions of this project
     */
    defs: Definitions
    /**
     * **WARNING**: this deprecated value is no longer exported since version 0.9.3  Replaced
     * by: `imageExportMode`
     */
    exportPng?: boolean | null
    /**
     * If TRUE, a Tiled compatible file will also be generated along with the LDtk JSON file
     * (default is FALSE)
     */
    exportTiled: boolean
    /**
     * If TRUE, one file will be saved for the project (incl. all its definitions) and one file
     * in a sub-folder for each level.
     */
    externalLevels: boolean
    /**
     * An array containing various advanced flags (ie. options or other states). Possible
     * values: `DiscardPreCsvIntGrid`, `ExportPreCsvIntGridFormat`, `IgnoreBackupSuggest`,
     * `PrependIndexToLevelFileNames`, `MultiWorlds`, `UseMultilinesType`
     */
    flags: Flag[]
    /**
     * Naming convention for Identifiers (first-letter uppercase, full uppercase etc.) Possible
     * values: `Capitalize`, `Uppercase`, `Lowercase`, `Free`
     */
    identifierStyle: IdentifierStyle
    /**
     * "Image export" option when saving project. Possible values: `None`, `OneImagePerLayer`,
     * `OneImagePerLevel`, `LayersAndLevels`
     */
    imageExportMode: ImageExportMode
    /**
     * File format version
     */
    jsonVersion: string
    /**
     * The default naming convention for level identifiers.
     */
    levelNamePattern: string
    /**
     * All levels. The order of this array is only relevant in `LinearHorizontal` and
     * `linearVertical` world layouts (see `worldLayout` value).<br/>  Otherwise, you should
     * refer to the `worldX`,`worldY` coordinates of each Level.
     */
    levels: Level[]
    /**
     * If TRUE, the Json is partially minified (no indentation, nor line breaks, default is
     * FALSE)
     */
    minifyJson: boolean
    /**
     * Next Unique integer ID available
     */
    nextUid: number
    /**
     * File naming pattern for exported PNGs
     */
    pngFilePattern?: null | string
    /**
     * If TRUE, a very simplified will be generated on saving, for quicker & easier engine
     * integration.
     */
    simplifiedExport: boolean
    /**
     * This optional description is used by LDtk Samples to show up some informations and
     * instructions.
     */
    tutorialDesc?: null | string
    /**
     * **WARNING**: this field will move to the `worlds` array after the "multi-worlds" update.
     * It will then be `null`. You can enable the Multi-worlds advanced project option to enable
     * the change immediately.<br/><br/>  Height of the world grid in pixels.
     */
    worldGridHeight?: number | null
    /**
     * **WARNING**: this field will move to the `worlds` array after the "multi-worlds" update.
     * It will then be `null`. You can enable the Multi-worlds advanced project option to enable
     * the change immediately.<br/><br/>  Width of the world grid in pixels.
     */
    worldGridWidth?: number | null
    /**
     * **WARNING**: this field will move to the `worlds` array after the "multi-worlds" update.
     * It will then be `null`. You can enable the Multi-worlds advanced project option to enable
     * the change immediately.<br/><br/>  An enum that describes how levels are organized in
     * this project (ie. linearly or in a 2D space). Possible values: &lt;`null`&gt;, `Free`,
     * `GridVania`, `LinearHorizontal`, `LinearVertical`
     */
    worldLayout?: WorldLayout | null
    /**
     * This array is not used yet in current LDtk version (so, for now, it's always
     * empty).<br/><br/>In a later update, it will be possible to have multiple Worlds in a
     * single project, each containing multiple Levels.<br/><br/>What will change when "Multiple
     * worlds" support will be added to LDtk:<br/><br/> - in current version, a LDtk project
     * file can only contain a single world with multiple levels in it. In this case, levels and
     * world layout related settings are stored in the root of the JSON.<br/> - after the
     * "Multiple worlds" update, there will be a `worlds` array in root, each world containing
     * levels and layout settings. Basically, it's pretty much only about moving the `levels`
     * array to the `worlds` array, along with world layout related values (eg. `worldGridWidth`
     * etc).<br/><br/>If you want to start supporting this future update easily, please refer to
     * this documentation: https://github.com/deepnight/ldtk/issues/231
     */
    worlds: World[]
}

/**
 * This object is not actually used by LDtk. It ONLY exists to force explicit references to
 * all types, to make sure QuickType finds them and integrate all of them. Otherwise,
 * Quicktype will drop types that are not explicitely used.
 */
export interface ForcedRefs {
    AutoLayerRuleGroup?: AutoLayerRuleGroup
    AutoRuleDef?: AutoLayerRuleDefinition
    Definitions?: Definitions
    EntityDef?: EntityDefinition
    EntityInstance?: EntityInstance
    EntityReferenceInfos?: FieldInstanceEntityReference
    EnumDef?: EnumDefinition
    EnumDefValues?: EnumValueDefinition
    EnumTagValue?: EnumTagValue
    FieldDef?: FieldDefinition
    FieldInstance?: FieldInstance
    GridPoint?: FieldInstanceGridPoint
    IntGridValueDef?: IntGridValueDefinition
    IntGridValueInstance?: IntGridValueInstance
    LayerDef?: LayerDefinition
    LayerInstance?: LayerInstance
    Level?: Level
    LevelBgPosInfos?: LevelBackgroundPosition
    NeighbourLevel?: NeighbourLevel
    Tile?: TileInstance
    TileCustomMetadata?: TileCustomMetadata
    TilesetDef?: TilesetDefinition
    TilesetRect?: TilesetRectangle
    World?: World
}

export interface AutoLayerRuleGroup {
    active: boolean
    /**
     * *This field was removed in 1.0.0 and should no longer be used.*
     */
    collapsed?: boolean | null
    isOptional: boolean
    name: string
    rules: AutoLayerRuleDefinition[]
    uid: number
}

/**
 * This complex section isn't meant to be used by game devs at all, as these rules are
 * completely resolved internally by the editor before any saving. You should just ignore
 * this part.
 */
export interface AutoLayerRuleDefinition {
    /**
     * If FALSE, the rule effect isn't applied, and no tiles are generated.
     */
    active: boolean
    /**
     * When TRUE, the rule will prevent other rules to be applied in the same cell if it matches
     * (TRUE by default).
     */
    breakOnMatch: boolean
    /**
     * Chances for this rule to be applied (0 to 1)
     */
    chance: number
    /**
     * Checker mode Possible values: `None`, `Horizontal`, `Vertical`
     */
    checker: Checker
    /**
     * If TRUE, allow rule to be matched by flipping its pattern horizontally
     */
    flipX: boolean
    /**
     * If TRUE, allow rule to be matched by flipping its pattern vertically
     */
    flipY: boolean
    /**
     * Default IntGrid value when checking cells outside of level bounds
     */
    outOfBoundsValue?: number | null
    /**
     * Rule pattern (size x size)
     */
    pattern: number[]
    /**
     * If TRUE, enable Perlin filtering to only apply rule on specific random area
     */
    perlinActive: boolean
    perlinOctaves: number
    perlinScale: number
    perlinSeed: number
    /**
     * X pivot of a tile stamp (0-1)
     */
    pivotX: number
    /**
     * Y pivot of a tile stamp (0-1)
     */
    pivotY: number
    /**
     * Pattern width & height. Should only be 1,3,5 or 7.
     */
    size: number
    /**
     * Array of all the tile IDs. They are used randomly or as stamps, based on `tileMode` value.
     */
    tileIds: number[]
    /**
     * Defines how tileIds array is used Possible values: `Single`, `Stamp`
     */
    tileMode: TileMode
    /**
     * Unique Int identifier
     */
    uid: number
    /**
     * X cell coord modulo
     */
    xModulo: number
    /**
     * X cell start offset
     */
    xOffset: number
    /**
     * Y cell coord modulo
     */
    yModulo: number
    /**
     * Y cell start offset
     */
    yOffset: number
}

/**
 * Checker mode Possible values: `None`, `Horizontal`, `Vertical`
 */
export enum Checker {
    Horizontal = 'Horizontal',
    None = 'None',
    Vertical = 'Vertical'
}

/**
 * Defines how tileIds array is used Possible values: `Single`, `Stamp`
 */
export enum TileMode {
    Single = 'Single',
    Stamp = 'Stamp'
}

/**
 * If you're writing your own LDtk importer, you should probably just ignore *most* stuff in
 * the `defs` section, as it contains data that are mostly important to the editor. To keep
 * you away from the `defs` section and avoid some unnecessary JSON parsing, important data
 * from definitions is often duplicated in fields prefixed with a double underscore (eg.
 * `__identifier` or `__type`).  The 2 only definition types you might need here are
 * **Tilesets** and **Enums**.
 *
 * A structure containing all the definitions of this project
 */
export interface Definitions {
    /**
     * All entities definitions, including their custom fields
     */
    entities: EntityDefinition[]
    /**
     * All internal enums
     */
    enums: EnumDefinition[]
    /**
     * Note: external enums are exactly the same as `enums`, except they have a `relPath` to
     * point to an external source file.
     */
    externalEnums: EnumDefinition[]
    /**
     * All layer definitions
     */
    layers: LayerDefinition[]
    /**
     * All custom fields available to all levels.
     */
    levelFields: FieldDefinition[]
    /**
     * All tilesets
     */
    tilesets: TilesetDefinition[]
}

export interface EntityDefinition {
    /**
     * Base entity color
     */
    color: string
    /**
     * Array of field definitions
     */
    fieldDefs: FieldDefinition[]
    fillOpacity: number
    /**
     * Pixel height
     */
    height: number
    hollow: boolean
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * Only applies to entities resizable on both X/Y. If TRUE, the entity instance width/height
     * will keep the same aspect ratio as the definition.
     */
    keepAspectRatio: boolean
    /**
     * Possible values: `DiscardOldOnes`, `PreventAdding`, `MoveLastOne`
     */
    limitBehavior: LimitBehavior
    /**
     * If TRUE, the maxCount is a "per world" limit, if FALSE, it's a "per level". Possible
     * values: `PerLayer`, `PerLevel`, `PerWorld`
     */
    limitScope: LimitScope
    lineOpacity: number
    /**
     * Max instances count
     */
    maxCount: number
    /**
     * An array of 4 dimensions for the up/right/down/left borders (in this order) when using
     * 9-slice mode for `tileRenderMode`.<br/>  If the tileRenderMode is not NineSlice, then
     * this array is empty.<br/>  See: https://en.wikipedia.org/wiki/9-slice_scaling
     */
    nineSliceBorders: number[]
    /**
     * Pivot X coordinate (from 0 to 1.0)
     */
    pivotX: number
    /**
     * Pivot Y coordinate (from 0 to 1.0)
     */
    pivotY: number
    /**
     * Possible values: `Rectangle`, `Ellipse`, `Tile`, `Cross`
     */
    renderMode: RenderMode
    /**
     * If TRUE, the entity instances will be resizable horizontally
     */
    resizableX: boolean
    /**
     * If TRUE, the entity instances will be resizable vertically
     */
    resizableY: boolean
    /**
     * Display entity name in editor
     */
    showName: boolean
    /**
     * An array of strings that classifies this entity
     */
    tags: string[]
    /**
     * **WARNING**: this deprecated value will be *removed* completely on version 1.2.0+
     * Replaced by: `tileRect`
     */
    tileId?: number | null
    tileOpacity: number
    /**
     * An object representing a rectangle from an existing Tileset
     */
    tileRect?: TilesetRectangle | null
    /**
     * An enum describing how the the Entity tile is rendered inside the Entity bounds. Possible
     * values: `Cover`, `FitInside`, `Repeat`, `Stretch`, `FullSizeCropped`,
     * `FullSizeUncropped`, `NineSlice`
     */
    tileRenderMode: TileRenderMode
    /**
     * Tileset ID used for optional tile display
     */
    tilesetId?: number | null
    /**
     * Unique Int identifier
     */
    uid: number
    /**
     * Pixel width
     */
    width: number
}

/**
 * This section is mostly only intended for the LDtk editor app itself. You can safely
 * ignore it.
 */
export interface FieldDefinition {
    /**
     * Human readable value type. Possible values: `Int, Float, String, Bool, Color,
     * ExternEnum.XXX, LocalEnum.XXX, Point, FilePath`.<br/>  If the field is an array, this
     * field will look like `Array<...>` (eg. `Array<Int>`, `Array<Point>` etc.)<br/>  NOTE: if
     * you enable the advanced option **Use Multilines type**, you will have "*Multilines*"
     * instead of "*String*" when relevant.
     */
    __type: string
    /**
     * Optional list of accepted file extensions for FilePath value type. Includes the dot:
     * `.ext`
     */
    acceptFileTypes?: string[] | null
    /**
     * Possible values: `Any`, `OnlySame`, `OnlyTags`
     */
    allowedRefs: AllowedRefs
    allowedRefTags: string[]
    allowOutOfLevelRef: boolean
    /**
     * Array max length
     */
    arrayMaxLength?: number | null
    /**
     * Array min length
     */
    arrayMinLength?: number | null
    autoChainRef: boolean
    /**
     * TRUE if the value can be null. For arrays, TRUE means it can contain null values
     * (exception: array of Points can't have null values).
     */
    canBeNull: boolean
    /**
     * Default value if selected value is null or invalid.
     */
    defaultOverride?: any
    editorAlwaysShow: boolean
    editorCutLongValues: boolean
    /**
     * Possible values: `Hidden`, `ValueOnly`, `NameAndValue`, `EntityTile`, `Points`,
     * `PointStar`, `PointPath`, `PointPathLoop`, `RadiusPx`, `RadiusGrid`,
     * `ArrayCountWithLabel`, `ArrayCountNoLabel`, `RefLinkBetweenPivots`,
     * `RefLinkBetweenCenters`
     */
    editorDisplayMode: EditorDisplayMode
    /**
     * Possible values: `Above`, `Center`, `Beneath`
     */
    editorDisplayPos: EditorDisplayPos
    editorTextPrefix?: null | string
    editorTextSuffix?: null | string
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * TRUE if the value is an array of multiple values
     */
    isArray: boolean
    /**
     * Max limit for value, if applicable
     */
    max?: number | null
    /**
     * Min limit for value, if applicable
     */
    min?: number | null
    /**
     * Optional regular expression that needs to be matched to accept values. Expected format:
     * `/some_reg_ex/g`, with optional "i" flag.
     */
    regex?: null | string
    symmetricalRef: boolean
    /**
     * Possible values: &lt;`null`&gt;, `LangPython`, `LangRuby`, `LangJS`, `LangLua`, `LangC`,
     * `LangHaxe`, `LangMarkdown`, `LangJson`, `LangXml`, `LangLog`
     */
    textLanguageMode?: TextLanguageMode | null
    /**
     * UID of the tileset used for a Tile
     */
    tilesetUid?: number | null
    /**
     * Internal enum representing the possible field types. Possible values: F_Int, F_Float,
     * F_String, F_Text, F_Bool, F_Color, F_Enum(...), F_Point, F_Path, F_EntityRef, F_Tile
     */
    type: string
    /**
     * Unique Int identifier
     */
    uid: number
    /**
     * If TRUE, the color associated with this field will override the Entity or Level default
     * color in the editor UI. For Enum fields, this would be the color associated to their
     * values.
     */
    useForSmartColor: boolean
}

/**
 * Possible values: `Any`, `OnlySame`, `OnlyTags`
 */
export enum AllowedRefs {
    Any = 'Any',
    OnlySame = 'OnlySame',
    OnlyTags = 'OnlyTags'
}

/**
 * Possible values: `Hidden`, `ValueOnly`, `NameAndValue`, `EntityTile`, `Points`,
 * `PointStar`, `PointPath`, `PointPathLoop`, `RadiusPx`, `RadiusGrid`,
 * `ArrayCountWithLabel`, `ArrayCountNoLabel`, `RefLinkBetweenPivots`,
 * `RefLinkBetweenCenters`
 */
export enum EditorDisplayMode {
    ArrayCountNoLabel = 'ArrayCountNoLabel',
    ArrayCountWithLabel = 'ArrayCountWithLabel',
    EntityTile = 'EntityTile',
    Hidden = 'Hidden',
    NameAndValue = 'NameAndValue',
    PointPath = 'PointPath',
    PointPathLoop = 'PointPathLoop',
    PointStar = 'PointStar',
    Points = 'Points',
    RadiusGrid = 'RadiusGrid',
    RadiusPx = 'RadiusPx',
    RefLinkBetweenCenters = 'RefLinkBetweenCenters',
    RefLinkBetweenPivots = 'RefLinkBetweenPivots',
    ValueOnly = 'ValueOnly'
}

/**
 * Possible values: `Above`, `Center`, `Beneath`
 */
export enum EditorDisplayPos {
    Above = 'Above',
    Beneath = 'Beneath',
    Center = 'Center'
}

export enum TextLanguageMode {
    LangC = 'LangC',
    LangHaxe = 'LangHaxe',
    LangJS = 'LangJS',
    LangJSON = 'LangJson',
    LangLog = 'LangLog',
    LangLua = 'LangLua',
    LangMarkdown = 'LangMarkdown',
    LangPython = 'LangPython',
    LangRuby = 'LangRuby',
    LangXML = 'LangXml'
}

/**
 * Possible values: `DiscardOldOnes`, `PreventAdding`, `MoveLastOne`
 */
export enum LimitBehavior {
    DiscardOldOnes = 'DiscardOldOnes',
    MoveLastOne = 'MoveLastOne',
    PreventAdding = 'PreventAdding'
}

/**
 * If TRUE, the maxCount is a "per world" limit, if FALSE, it's a "per level". Possible
 * values: `PerLayer`, `PerLevel`, `PerWorld`
 */
export enum LimitScope {
    PerLayer = 'PerLayer',
    PerLevel = 'PerLevel',
    PerWorld = 'PerWorld'
}

/**
 * Possible values: `Rectangle`, `Ellipse`, `Tile`, `Cross`
 */
export enum RenderMode {
    Cross = 'Cross',
    Ellipse = 'Ellipse',
    Rectangle = 'Rectangle',
    Tile = 'Tile'
}

/**
 * This object represents a custom sub rectangle in a Tileset image.
 */
export interface TilesetRectangle {
    /**
     * Height in pixels
     */
    h: number
    /**
     * UID of the tileset
     */
    tilesetUid: number
    /**
     * Width in pixels
     */
    w: number
    /**
     * X pixels coordinate of the top-left corner in the Tileset image
     */
    x: number
    /**
     * Y pixels coordinate of the top-left corner in the Tileset image
     */
    y: number
}

/**
 * An enum describing how the the Entity tile is rendered inside the Entity bounds. Possible
 * values: `Cover`, `FitInside`, `Repeat`, `Stretch`, `FullSizeCropped`,
 * `FullSizeUncropped`, `NineSlice`
 */
export enum TileRenderMode {
    Cover = 'Cover',
    FitInside = 'FitInside',
    FullSizeCropped = 'FullSizeCropped',
    FullSizeUncropped = 'FullSizeUncropped',
    NineSlice = 'NineSlice',
    Repeat = 'Repeat',
    Stretch = 'Stretch'
}

export interface EnumDefinition {
    externalFileChecksum?: null | string
    /**
     * Relative path to the external file providing this Enum
     */
    externalRelPath?: null | string
    /**
     * Tileset UID if provided
     */
    iconTilesetUid?: number | null
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * An array of user-defined tags to organize the Enums
     */
    tags: string[]
    /**
     * Unique Int identifier
     */
    uid: number
    /**
     * All possible enum values, with their optional Tile infos.
     */
    values: EnumValueDefinition[]
}

export interface EnumValueDefinition {
    /**
     * An array of 4 Int values that refers to the tile in the tileset image: `[ x, y, width,
     * height ]`
     */
    __tileSrcRect?: number[] | null
    /**
     * Optional color
     */
    color: number
    /**
     * Enum value
     */
    id: string
    /**
     * The optional ID of the tile
     */
    tileId?: number | null
}

export interface LayerDefinition {
    /**
     * Type of the layer (*IntGrid, Entities, Tiles or AutoLayer*)
     */
    __type: string
    /**
     * Contains all the auto-layer rule definitions.
     */
    autoRuleGroups: AutoLayerRuleGroup[]
    autoSourceLayerDefUid?: number | null
    /**
     * **WARNING**: this deprecated value will be *removed* completely on version 1.2.0+
     * Replaced by: `tilesetDefUid`
     */
    autoTilesetDefUid?: number | null
    /**
     * Opacity of the layer (0 to 1.0)
     */
    displayOpacity: number
    /**
     * An array of tags to forbid some Entities in this layer
     */
    excludedTags: string[]
    /**
     * Width and height of the grid in pixels
     */
    gridSize: number
    /**
     * Height of the optional "guide" grid in pixels
     */
    guideGridHei: number
    /**
     * Width of the optional "guide" grid in pixels
     */
    guideGridWid: number
    hideFieldsWhenInactive: boolean
    /**
     * Hide the layer from the list on the side of the editor view.
     */
    hideInList: boolean
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * Alpha of this layer when it is not the active one.
     */
    inactiveOpacity: number
    /**
     * An array that defines extra optional info for each IntGrid value.<br/>  WARNING: the
     * array order is not related to actual IntGrid values! As user can re-order IntGrid values
     * freely, you may value "2" before value "1" in this array.
     */
    intGridValues: IntGridValueDefinition[]
    /**
     * Parallax horizontal factor (from -1 to 1, defaults to 0) which affects the scrolling
     * speed of this layer, creating a fake 3D (parallax) effect.
     */
    parallaxFactorX: number
    /**
     * Parallax vertical factor (from -1 to 1, defaults to 0) which affects the scrolling speed
     * of this layer, creating a fake 3D (parallax) effect.
     */
    parallaxFactorY: number
    /**
     * If true (default), a layer with a parallax factor will also be scaled up/down accordingly.
     */
    parallaxScaling: boolean
    /**
     * X offset of the layer, in pixels (IMPORTANT: this should be added to the `LayerInstance`
     * optional offset)
     */
    pxOffsetX: number
    /**
     * Y offset of the layer, in pixels (IMPORTANT: this should be added to the `LayerInstance`
     * optional offset)
     */
    pxOffsetY: number
    /**
     * An array of tags to filter Entities that can be added to this layer
     */
    requiredTags: string[]
    /**
     * If the tiles are smaller or larger than the layer grid, the pivot value will be used to
     * position the tile relatively its grid cell.
     */
    tilePivotX: number
    /**
     * If the tiles are smaller or larger than the layer grid, the pivot value will be used to
     * position the tile relatively its grid cell.
     */
    tilePivotY: number
    /**
     * Reference to the default Tileset UID being used by this layer definition.<br/>
     * **WARNING**: some layer *instances* might use a different tileset. So most of the time,
     * you should probably use the `__tilesetDefUid` value found in layer instances.<br/>  Note:
     * since version 1.0.0, the old `autoTilesetDefUid` was removed and merged into this value.
     */
    tilesetDefUid?: number | null
    /**
     * Type of the layer as Haxe Enum Possible values: `IntGrid`, `Entities`, `Tiles`,
     * `AutoLayer`
     */
    type: Type
    /**
     * Unique Int identifier
     */
    uid: number
}

/**
 * IntGrid value definition
 */
export interface IntGridValueDefinition {
    color: string
    /**
     * User defined unique identifier
     */
    identifier?: null | string
    /**
     * The IntGrid value itself
     */
    value: number
}

/**
 * Type of the layer as Haxe Enum Possible values: `IntGrid`, `Entities`, `Tiles`,
 * `AutoLayer`
 */
export enum Type {
    AutoLayer = 'AutoLayer',
    Entities = 'Entities',
    IntGrid = 'IntGrid',
    Tiles = 'Tiles'
}

/**
 * The `Tileset` definition is the most important part among project definitions. It
 * contains some extra informations about each integrated tileset. If you only had to parse
 * one definition section, that would be the one.
 */
export interface TilesetDefinition {
    /**
     * Grid-based height
     */
    __cHei: number
    /**
     * Grid-based width
     */
    __cWid: number
    /**
     * The following data is used internally for various optimizations. It's always synced with
     * source image changes.
     */
    cachedPixelData?: { [key: string]: any } | null
    /**
     * An array of custom tile metadata
     */
    customData: TileCustomMetadata[]
    /**
     * If this value is set, then it means that this atlas uses an internal LDtk atlas image
     * instead of a loaded one. Possible values: &lt;`null`&gt;, `LdtkIcons`
     */
    embedAtlas?: EmbedAtlas | null
    /**
     * Tileset tags using Enum values specified by `tagsSourceEnumId`. This array contains 1
     * element per Enum value, which contains an array of all Tile IDs that are tagged with it.
     */
    enumTags: EnumTagValue[]
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * Distance in pixels from image borders
     */
    padding: number
    /**
     * Image height in pixels
     */
    pxHei: number
    /**
     * Image width in pixels
     */
    pxWid: number
    /**
     * Path to the source file, relative to the current project JSON file<br/>  It can be null
     * if no image was provided, or when using an embed atlas.
     */
    relPath?: null | string
    /**
     * Array of group of tiles selections, only meant to be used in the editor
     */
    savedSelections: { [key: string]: any }[]
    /**
     * Space in pixels between all tiles
     */
    spacing: number
    /**
     * An array of user-defined tags to organize the Tilesets
     */
    tags: string[]
    /**
     * Optional Enum definition UID used for this tileset meta-data
     */
    tagsSourceEnumUid?: number | null
    tileGridSize: number
    /**
     * Unique Intidentifier
     */
    uid: number
}

/**
 * In a tileset definition, user defined meta-data of a tile.
 */
export interface TileCustomMetadata {
    data: string
    tileId: number
}

export enum EmbedAtlas {
    LdtkIcons = 'LdtkIcons'
}

/**
 * In a tileset definition, enum based tag infos
 */
export interface EnumTagValue {
    enumValueId: string
    tileIds: number[]
}

export interface EntityInstance {
    /**
     * Grid-based coordinates (`[x,y]` format)
     */
    __grid: number[]
    /**
     * Entity definition identifier
     */
    __identifier: string
    /**
     * Pivot coordinates  (`[x,y]` format, values are from 0 to 1) of the Entity
     */
    __pivot: number[]
    /**
     * The entity "smart" color, guessed from either Entity definition, or one its field
     * instances.
     */
    __smartColor: string
    /**
     * Array of tags defined in this Entity definition
     */
    __tags: string[]
    /**
     * Optional TilesetRect used to display this entity (it could either be the default Entity
     * tile, or some tile provided by a field value, like an Enum).
     */
    __tile?: TilesetRectangle | null
    /**
     * Reference of the **Entity definition** UID
     */
    defUid: number
    /**
     * An array of all custom fields and their values.
     */
    fieldInstances: FieldInstance[]
    /**
     * Entity height in pixels. For non-resizable entities, it will be the same as Entity
     * definition.
     */
    height: number
    /**
     * Unique instance identifier
     */
    iid: string
    /**
     * Pixel coordinates (`[x,y]` format) in current level coordinate space. Don't forget
     * optional layer offsets, if they exist!
     */
    px: number[]
    /**
     * Entity width in pixels. For non-resizable entities, it will be the same as Entity
     * definition.
     */
    width: number
}

export interface FieldInstance {
    /**
     * Field definition identifier
     */
    __identifier: string
    /**
     * Optional TilesetRect used to display this field (this can be the field own Tile, or some
     * other Tile guessed from the value, like an Enum).
     */
    __tile?: TilesetRectangle | null
    /**
     * Type of the field, such as `Int`, `Float`, `String`, `Enum(my_enum_name)`, `Bool`,
     * etc.<br/>  NOTE: if you enable the advanced option **Use Multilines type**, you will have
     * "*Multilines*" instead of "*String*" when relevant.
     */
    __type: string
    /**
     * Actual value of the field instance. The value type varies, depending on `__type`:<br/>
     * - For **classic types** (ie. Integer, Float, Boolean, String, Text and FilePath), you
     * just get the actual value with the expected type.<br/>   - For **Color**, the value is an
     * hexadecimal string using "#rrggbb" format.<br/>   - For **Enum**, the value is a String
     * representing the selected enum value.<br/>   - For **Point**, the value is a
     * [GridPoint](#ldtk-GridPoint) object.<br/>   - For **Tile**, the value is a
     * [TilesetRect](#ldtk-TilesetRect) object.<br/>   - For **EntityRef**, the value is an
     * [EntityReferenceInfos](#ldtk-EntityReferenceInfos) object.<br/><br/>  If the field is an
     * array, then this `__value` will also be a JSON array.
     */
    __value: any
    /**
     * Reference of the **Field definition** UID
     */
    defUid: number
    /**
     * Editor internal raw values
     */
    realEditorValues: any[]
}

/**
 * This object is used in Field Instances to describe an EntityRef value.
 */
export interface FieldInstanceEntityReference {
    /**
     * IID of the refered EntityInstance
     */
    entityIid: string
    /**
     * IID of the LayerInstance containing the refered EntityInstance
     */
    layerIid: string
    /**
     * IID of the Level containing the refered EntityInstance
     */
    levelIid: string
    /**
     * IID of the World containing the refered EntityInstance
     */
    worldIid: string
}

/**
 * This object is just a grid-based coordinate used in Field values.
 */
export interface FieldInstanceGridPoint {
    /**
     * X grid-based coordinate
     */
    cx: number
    /**
     * Y grid-based coordinate
     */
    cy: number
}

/**
 * IntGrid value instance
 */
export interface IntGridValueInstance {
    /**
     * Coordinate ID in the layer grid
     */
    coordId: number
    /**
     * IntGrid value
     */
    v: number
}

export interface LayerInstance {
    /**
     * Grid-based height
     */
    __cHei: number
    /**
     * Grid-based width
     */
    __cWid: number
    /**
     * Grid size
     */
    __gridSize: number
    /**
     * Layer definition identifier
     */
    __identifier: string
    /**
     * Layer opacity as Float [0-1]
     */
    __opacity: number
    /**
     * Total layer X pixel offset, including both instance and definition offsets.
     */
    __pxTotalOffsetX: number
    /**
     * Total layer Y pixel offset, including both instance and definition offsets.
     */
    __pxTotalOffsetY: number
    /**
     * The definition UID of corresponding Tileset, if any.
     */
    __tilesetDefUid?: number | null
    /**
     * The relative path to corresponding Tileset, if any.
     */
    __tilesetRelPath?: null | string
    /**
     * Layer type (possible values: IntGrid, Entities, Tiles or AutoLayer)
     */
    __type: string
    /**
     * An array containing all tiles generated by Auto-layer rules. The array is already sorted
     * in display order (ie. 1st tile is beneath 2nd, which is beneath 3rd etc.).<br/><br/>
     * Note: if multiple tiles are stacked in the same cell as the result of different rules,
     * all tiles behind opaque ones will be discarded.
     */
    autoLayerTiles: TileInstance[]
    entityInstances: EntityInstance[]
    gridTiles: TileInstance[]
    /**
     * Unique layer instance identifier
     */
    iid: string
    /**
     * **WARNING**: this deprecated value is no longer exported since version 1.0.0  Replaced
     * by: `intGridCsv`
     */
    intGrid?: IntGridValueInstance[] | null
    /**
     * A list of all values in the IntGrid layer, stored in CSV format (Comma Separated
     * Values).<br/>  Order is from left to right, and top to bottom (ie. first row from left to
     * right, followed by second row, etc).<br/>  `0` means "empty cell" and IntGrid values
     * start at 1.<br/>  The array size is `__cWid` x `__cHei` cells.
     */
    intGridCsv: number[]
    /**
     * Reference the Layer definition UID
     */
    layerDefUid: number
    /**
     * Reference to the UID of the level containing this layer instance
     */
    levelId: number
    /**
     * An Array containing the UIDs of optional rules that were enabled in this specific layer
     * instance.
     */
    optionalRules: number[]
    /**
     * This layer can use another tileset by overriding the tileset UID here.
     */
    overrideTilesetUid?: number | null
    /**
     * X offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to
     * the `LayerDef` optional offset, see `__pxTotalOffsetX`)
     */
    pxOffsetX: number
    /**
     * Y offset in pixels to render this layer, usually 0 (IMPORTANT: this should be added to
     * the `LayerDef` optional offset, see `__pxTotalOffsetY`)
     */
    pxOffsetY: number
    /**
     * Random seed used for Auto-Layers rendering
     */
    seed: number
    /**
     * Layer instance visibility
     */
    visible: boolean
}

/**
 * This structure represents a single tile from a given Tileset.
 */
export interface TileInstance {
    /**
     * Internal data used by the editor.<br/>  For auto-layer tiles: `[ruleId, coordId]`.<br/>
     * For tile-layer tiles: `[coordId]`.
     */
    d: number[]
    /**
     * "Flip bits", a 2-bits integer to represent the mirror transformations of the tile.<br/>
     * - Bit 0 = X flip<br/>   - Bit 1 = Y flip<br/>   Examples: f=0 (no flip), f=1 (X flip
     * only), f=2 (Y flip only), f=3 (both flips)
     */
    f: number
    /**
     * Pixel coordinates of the tile in the **layer** (`[x,y]` format). Don't forget optional
     * layer offsets, if they exist!
     */
    px: number[]
    /**
     * Pixel coordinates of the tile in the **tileset** (`[x,y]` format)
     */
    src: number[]
    /**
     * The *Tile ID* in the corresponding tileset.
     */
    t: number
}

/**
 * This section contains all the level data. It can be found in 2 distinct forms, depending
 * on Project current settings:  - If "*Separate level files*" is **disabled** (default):
 * full level data is *embedded* inside the main Project JSON file, - If "*Separate level
 * files*" is **enabled**: level data is stored in *separate* standalone `.ldtkl` files (one
 * per level). In this case, the main Project JSON file will still contain most level data,
 * except heavy sections, like the `layerInstances` array (which will be null). The
 * `externalRelPath` string points to the `ldtkl` file.  A `ldtkl` file is just a JSON file
 * containing exactly what is described below.
 */
export interface Level {
    /**
     * Background color of the level (same as `bgColor`, except the default value is
     * automatically used here if its value is `null`)
     */
    __bgColor: string
    /**
     * Position informations of the background image, if there is one.
     */
    __bgPos?: LevelBackgroundPosition | null
    /**
     * An array listing all other levels touching this one on the world map.<br/>  Only relevant
     * for world layouts where level spatial positioning is manual (ie. GridVania, Free). For
     * Horizontal and Vertical layouts, this array is always empty.
     */
    __neighbours: NeighbourLevel[]
    /**
     * The "guessed" color for this level in the editor, decided using either the background
     * color or an existing custom field.
     */
    __smartColor: string
    /**
     * Background color of the level. If `null`, the project `defaultLevelBgColor` should be
     * used.
     */
    bgColor?: null | string
    /**
     * Background image X pivot (0-1)
     */
    bgPivotX: number
    /**
     * Background image Y pivot (0-1)
     */
    bgPivotY: number
    /**
     * An enum defining the way the background image (if any) is positioned on the level. See
     * `__bgPos` for resulting position info. Possible values: &lt;`null`&gt;, `Unscaled`,
     * `Contain`, `Cover`, `CoverDirty`
     */
    bgPos?: BgPos | null
    /**
     * The *optional* relative path to the level background image.
     */
    bgRelPath?: null | string
    /**
     * This value is not null if the project option "*Save levels separately*" is enabled. In
     * this case, this **relative** path points to the level Json file.
     */
    externalRelPath?: null | string
    /**
     * An array containing this level custom field values.
     */
    fieldInstances: FieldInstance[]
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * Unique instance identifier
     */
    iid: string
    /**
     * An array containing all Layer instances. **IMPORTANT**: if the project option "*Save
     * levels separately*" is enabled, this field will be `null`.<br/>  This array is **sorted
     * in display order**: the 1st layer is the top-most and the last is behind.
     */
    layerInstances?: LayerInstance[] | null
    /**
     * Height of the level in pixels
     */
    pxHei: number
    /**
     * Width of the level in pixels
     */
    pxWid: number
    /**
     * Unique Int identifier
     */
    uid: number
    /**
     * If TRUE, the level identifier will always automatically use the naming pattern as defined
     * in `Project.levelNamePattern`. Becomes FALSE if the identifier is manually modified by
     * user.
     */
    useAutoIdentifier: boolean
    /**
     * Index that represents the "depth" of the level in the world. Default is 0, greater means
     * "above", lower means "below".<br/>  This value is mostly used for display only and is
     * intended to make stacking of levels easier to manage.
     */
    worldDepth: number
    /**
     * World X coordinate in pixels.<br/>  Only relevant for world layouts where level spatial
     * positioning is manual (ie. GridVania, Free). For Horizontal and Vertical layouts, the
     * value is always -1 here.
     */
    worldX: number
    /**
     * World Y coordinate in pixels.<br/>  Only relevant for world layouts where level spatial
     * positioning is manual (ie. GridVania, Free). For Horizontal and Vertical layouts, the
     * value is always -1 here.
     */
    worldY: number
}

/**
 * Level background image position info
 */
export interface LevelBackgroundPosition {
    /**
     * An array of 4 float values describing the cropped sub-rectangle of the displayed
     * background image. This cropping happens when original is larger than the level bounds.
     * Array format: `[ cropX, cropY, cropWidth, cropHeight ]`
     */
    cropRect: number[]
    /**
     * An array containing the `[scaleX,scaleY]` values of the **cropped** background image,
     * depending on `bgPos` option.
     */
    scale: number[]
    /**
     * An array containing the `[x,y]` pixel coordinates of the top-left corner of the
     * **cropped** background image, depending on `bgPos` option.
     */
    topLeftPx: number[]
}

/**
 * Nearby level info
 */
export interface NeighbourLevel {
    /**
     * A single lowercase character tipping on the level location (`n`orth, `s`outh, `w`est,
     * `e`ast).
     */
    dir: string
    /**
     * Neighbour Instance Identifier
     */
    levelIid: string
    /**
     * **WARNING**: this deprecated value will be *removed* completely on version 1.2.0+
     * Replaced by: `levelIid`
     */
    levelUid?: number
}

export enum BgPos {
    Contain = 'Contain',
    Cover = 'Cover',
    CoverDirty = 'CoverDirty',
    Unscaled = 'Unscaled'
}

/**
 * **IMPORTANT**: this type is not used *yet* in current LDtk version. It's only presented
 * here as a preview of a planned feature.  A World contains multiple levels, and it has its
 * own layout settings.
 */
export interface World {
    /**
     * Default new level height
     */
    defaultLevelHeight: number
    /**
     * Default new level width
     */
    defaultLevelWidth: number
    /**
     * User defined unique identifier
     */
    identifier: string
    /**
     * Unique instance identifer
     */
    iid: string
    /**
     * All levels from this world. The order of this array is only relevant in
     * `LinearHorizontal` and `linearVertical` world layouts (see `worldLayout` value).
     * Otherwise, you should refer to the `worldX`,`worldY` coordinates of each Level.
     */
    levels: Level[]
    /**
     * Height of the world grid in pixels.
     */
    worldGridHeight: number
    /**
     * Width of the world grid in pixels.
     */
    worldGridWidth: number
    /**
     * An enum that describes how levels are organized in this project (ie. linearly or in a 2D
     * space). Possible values: `Free`, `GridVania`, `LinearHorizontal`, `LinearVertical`, `null`
     */
    worldLayout: WorldLayout | null
}

export enum WorldLayout {
    Free = 'Free',
    GridVania = 'GridVania',
    LinearHorizontal = 'LinearHorizontal',
    LinearVertical = 'LinearVertical'
}

export enum Flag {
    DiscardPreCSVIntGrid = 'DiscardPreCsvIntGrid',
    ExportPreCSVIntGridFormat = 'ExportPreCsvIntGridFormat',
    IgnoreBackupSuggest = 'IgnoreBackupSuggest',
    MultiWorlds = 'MultiWorlds',
    PrependIndexToLevelFileNames = 'PrependIndexToLevelFileNames',
    UseMultilinesType = 'UseMultilinesType'
}

/**
 * Naming convention for Identifiers (first-letter uppercase, full uppercase etc.) Possible
 * values: `Capitalize`, `Uppercase`, `Lowercase`, `Free`
 */
export enum IdentifierStyle {
    Capitalize = 'Capitalize',
    Free = 'Free',
    Lowercase = 'Lowercase',
    Uppercase = 'Uppercase'
}

/**
 * "Image export" option when saving project. Possible values: `None`, `OneImagePerLayer`,
 * `OneImagePerLevel`, `LayersAndLevels`
 */
export enum ImageExportMode {
    LayersAndLevels = 'LayersAndLevels',
    None = 'None',
    OneImagePerLayer = 'OneImagePerLayer',
    OneImagePerLevel = 'OneImagePerLevel'
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toLdtk(json: string): Ldtk {
        return cast(JSON.parse(json), r('Ldtk'))
    }

    public static ldtkToJson(value: Ldtk): string {
        return JSON.stringify(uncast(value, r('Ldtk')), null, 2)
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`)
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`)
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {}
        typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
        typ.jsonToJS = map
    }
    return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {}
        typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
        typ.jsToJSON = map
    }
    return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val
        return invalidValue(typ, val, key)
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length
        for (let i = 0; i < l; i++) {
            const typ = typs[i]
            try {
                return transform(val, typ, getProps)
            } catch (_) {}
        }
        return invalidValue(typs, val)
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val
        return invalidValue(cases, val)
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue('array', val)
        return val.map(el => transform(el, typ, getProps))
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null
        }
        const d = new Date(val)
        if (isNaN(d.valueOf())) {
            return invalidValue('Date', val)
        }
        return d
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            return invalidValue('object', val)
        }
        const result: any = {}
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key]
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined
            result[prop.key] = transform(v, prop.typ, getProps, prop.key)
        })
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key)
            }
        })
        return result
    }

    if (typ === 'any') return val
    if (typ === null) {
        if (val === null) return val
        return invalidValue(typ, val)
    }
    if (typ === false) return invalidValue(typ, val)
    while (typeof typ === 'object' && typ.ref !== undefined) {
        typ = typeMap[typ.ref]
    }
    if (Array.isArray(typ)) return transformEnum(typ, val)
    if (typeof typ === 'object') {
        return typ.hasOwnProperty('unionMembers')
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty('arrayItems')
            ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty('props')
            ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val)
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== 'number') return transformDate(val)
    return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps)
}

function a(typ: any) {
    return { arrayItems: typ }
}

function u(...typs: any[]) {
    return { unionMembers: typs }
}

function o(props: any[], additional: any) {
    return { props, additional }
}

function m(additional: any) {
    return { props: [], additional }
}

function r(name: string) {
    return { ref: name }
}

const typeMap: any = {
    Ldtk: o(
        [
            { json: '__FORCED_REFS', js: '__FORCED_REFS', typ: u(undefined, r('ForcedRefs')) },
            { json: 'appBuildId', js: 'appBuildId', typ: 3.14 },
            { json: 'backupLimit', js: 'backupLimit', typ: 0 },
            { json: 'backupOnSave', js: 'backupOnSave', typ: true },
            { json: 'bgColor', js: 'bgColor', typ: '' },
            { json: 'defaultGridSize', js: 'defaultGridSize', typ: 0 },
            { json: 'defaultLevelBgColor', js: 'defaultLevelBgColor', typ: '' },
            { json: 'defaultLevelHeight', js: 'defaultLevelHeight', typ: u(undefined, u(0, null)) },
            { json: 'defaultLevelWidth', js: 'defaultLevelWidth', typ: u(undefined, u(0, null)) },
            { json: 'defaultPivotX', js: 'defaultPivotX', typ: 3.14 },
            { json: 'defaultPivotY', js: 'defaultPivotY', typ: 3.14 },
            { json: 'defs', js: 'defs', typ: r('Definitions') },
            { json: 'exportPng', js: 'exportPng', typ: u(undefined, u(true, null)) },
            { json: 'exportTiled', js: 'exportTiled', typ: true },
            { json: 'externalLevels', js: 'externalLevels', typ: true },
            { json: 'flags', js: 'flags', typ: a(r('Flag')) },
            { json: 'identifierStyle', js: 'identifierStyle', typ: r('IdentifierStyle') },
            { json: 'imageExportMode', js: 'imageExportMode', typ: r('ImageExportMode') },
            { json: 'jsonVersion', js: 'jsonVersion', typ: '' },
            { json: 'levelNamePattern', js: 'levelNamePattern', typ: '' },
            { json: 'levels', js: 'levels', typ: a(r('Level')) },
            { json: 'minifyJson', js: 'minifyJson', typ: true },
            { json: 'nextUid', js: 'nextUid', typ: 0 },
            { json: 'pngFilePattern', js: 'pngFilePattern', typ: u(undefined, u(null, '')) },
            { json: 'simplifiedExport', js: 'simplifiedExport', typ: true },
            { json: 'tutorialDesc', js: 'tutorialDesc', typ: u(undefined, u(null, '')) },
            { json: 'worldGridHeight', js: 'worldGridHeight', typ: u(undefined, u(0, null)) },
            { json: 'worldGridWidth', js: 'worldGridWidth', typ: u(undefined, u(0, null)) },
            { json: 'worldLayout', js: 'worldLayout', typ: u(undefined, u(r('WorldLayout'), null)) },
            { json: 'worlds', js: 'worlds', typ: a(r('World')) }
        ],
        'any'
    ),
    ForcedRefs: o(
        [
            { json: 'AutoLayerRuleGroup', js: 'AutoLayerRuleGroup', typ: u(undefined, r('AutoLayerRuleGroup')) },
            { json: 'AutoRuleDef', js: 'AutoRuleDef', typ: u(undefined, r('AutoLayerRuleDefinition')) },
            { json: 'Definitions', js: 'Definitions', typ: u(undefined, r('Definitions')) },
            { json: 'EntityDef', js: 'EntityDef', typ: u(undefined, r('EntityDefinition')) },
            { json: 'EntityInstance', js: 'EntityInstance', typ: u(undefined, r('EntityInstance')) },
            { json: 'EntityReferenceInfos', js: 'EntityReferenceInfos', typ: u(undefined, r('FieldInstanceEntityReference')) },
            { json: 'EnumDef', js: 'EnumDef', typ: u(undefined, r('EnumDefinition')) },
            { json: 'EnumDefValues', js: 'EnumDefValues', typ: u(undefined, r('EnumValueDefinition')) },
            { json: 'EnumTagValue', js: 'EnumTagValue', typ: u(undefined, r('EnumTagValue')) },
            { json: 'FieldDef', js: 'FieldDef', typ: u(undefined, r('FieldDefinition')) },
            { json: 'FieldInstance', js: 'FieldInstance', typ: u(undefined, r('FieldInstance')) },
            { json: 'GridPoint', js: 'GridPoint', typ: u(undefined, r('FieldInstanceGridPoint')) },
            { json: 'IntGridValueDef', js: 'IntGridValueDef', typ: u(undefined, r('IntGridValueDefinition')) },
            { json: 'IntGridValueInstance', js: 'IntGridValueInstance', typ: u(undefined, r('IntGridValueInstance')) },
            { json: 'LayerDef', js: 'LayerDef', typ: u(undefined, r('LayerDefinition')) },
            { json: 'LayerInstance', js: 'LayerInstance', typ: u(undefined, r('LayerInstance')) },
            { json: 'Level', js: 'Level', typ: u(undefined, r('Level')) },
            { json: 'LevelBgPosInfos', js: 'LevelBgPosInfos', typ: u(undefined, r('LevelBackgroundPosition')) },
            { json: 'NeighbourLevel', js: 'NeighbourLevel', typ: u(undefined, r('NeighbourLevel')) },
            { json: 'Tile', js: 'Tile', typ: u(undefined, r('TileInstance')) },
            { json: 'TileCustomMetadata', js: 'TileCustomMetadata', typ: u(undefined, r('TileCustomMetadata')) },
            { json: 'TilesetDef', js: 'TilesetDef', typ: u(undefined, r('TilesetDefinition')) },
            { json: 'TilesetRect', js: 'TilesetRect', typ: u(undefined, r('TilesetRectangle')) },
            { json: 'World', js: 'World', typ: u(undefined, r('World')) }
        ],
        'any'
    ),
    AutoLayerRuleGroup: o(
        [
            { json: 'active', js: 'active', typ: true },
            { json: 'collapsed', js: 'collapsed', typ: u(undefined, u(true, null)) },
            { json: 'isOptional', js: 'isOptional', typ: true },
            { json: 'name', js: 'name', typ: '' },
            { json: 'rules', js: 'rules', typ: a(r('AutoLayerRuleDefinition')) },
            { json: 'uid', js: 'uid', typ: 0 }
        ],
        false
    ),
    AutoLayerRuleDefinition: o(
        [
            { json: 'active', js: 'active', typ: true },
            { json: 'breakOnMatch', js: 'breakOnMatch', typ: true },
            { json: 'chance', js: 'chance', typ: 3.14 },
            { json: 'checker', js: 'checker', typ: r('Checker') },
            { json: 'flipX', js: 'flipX', typ: true },
            { json: 'flipY', js: 'flipY', typ: true },
            { json: 'outOfBoundsValue', js: 'outOfBoundsValue', typ: u(undefined, u(0, null)) },
            { json: 'pattern', js: 'pattern', typ: a(0) },
            { json: 'perlinActive', js: 'perlinActive', typ: true },
            { json: 'perlinOctaves', js: 'perlinOctaves', typ: 3.14 },
            { json: 'perlinScale', js: 'perlinScale', typ: 3.14 },
            { json: 'perlinSeed', js: 'perlinSeed', typ: 3.14 },
            { json: 'pivotX', js: 'pivotX', typ: 3.14 },
            { json: 'pivotY', js: 'pivotY', typ: 3.14 },
            { json: 'size', js: 'size', typ: 0 },
            { json: 'tileIds', js: 'tileIds', typ: a(0) },
            { json: 'tileMode', js: 'tileMode', typ: r('TileMode') },
            { json: 'uid', js: 'uid', typ: 0 },
            { json: 'xModulo', js: 'xModulo', typ: 0 },
            { json: 'xOffset', js: 'xOffset', typ: 0 },
            { json: 'yModulo', js: 'yModulo', typ: 0 },
            { json: 'yOffset', js: 'yOffset', typ: 0 }
        ],
        false
    ),
    Definitions: o(
        [
            { json: 'entities', js: 'entities', typ: a(r('EntityDefinition')) },
            { json: 'enums', js: 'enums', typ: a(r('EnumDefinition')) },
            { json: 'externalEnums', js: 'externalEnums', typ: a(r('EnumDefinition')) },
            { json: 'layers', js: 'layers', typ: a(r('LayerDefinition')) },
            { json: 'levelFields', js: 'levelFields', typ: a(r('FieldDefinition')) },
            { json: 'tilesets', js: 'tilesets', typ: a(r('TilesetDefinition')) }
        ],
        false
    ),
    EntityDefinition: o(
        [
            { json: 'color', js: 'color', typ: '' },
            { json: 'fieldDefs', js: 'fieldDefs', typ: a(r('FieldDefinition')) },
            { json: 'fillOpacity', js: 'fillOpacity', typ: 3.14 },
            { json: 'height', js: 'height', typ: 0 },
            { json: 'hollow', js: 'hollow', typ: true },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'keepAspectRatio', js: 'keepAspectRatio', typ: true },
            { json: 'limitBehavior', js: 'limitBehavior', typ: r('LimitBehavior') },
            { json: 'limitScope', js: 'limitScope', typ: r('LimitScope') },
            { json: 'lineOpacity', js: 'lineOpacity', typ: 3.14 },
            { json: 'maxCount', js: 'maxCount', typ: 0 },
            { json: 'nineSliceBorders', js: 'nineSliceBorders', typ: a(0) },
            { json: 'pivotX', js: 'pivotX', typ: 3.14 },
            { json: 'pivotY', js: 'pivotY', typ: 3.14 },
            { json: 'renderMode', js: 'renderMode', typ: r('RenderMode') },
            { json: 'resizableX', js: 'resizableX', typ: true },
            { json: 'resizableY', js: 'resizableY', typ: true },
            { json: 'showName', js: 'showName', typ: true },
            { json: 'tags', js: 'tags', typ: a('') },
            { json: 'tileId', js: 'tileId', typ: u(undefined, u(0, null)) },
            { json: 'tileOpacity', js: 'tileOpacity', typ: 3.14 },
            { json: 'tileRect', js: 'tileRect', typ: u(undefined, u(r('TilesetRectangle'), null)) },
            { json: 'tileRenderMode', js: 'tileRenderMode', typ: r('TileRenderMode') },
            { json: 'tilesetId', js: 'tilesetId', typ: u(undefined, u(0, null)) },
            { json: 'uid', js: 'uid', typ: 0 },
            { json: 'width', js: 'width', typ: 0 }
        ],
        false
    ),
    FieldDefinition: o(
        [
            { json: '__type', js: '__type', typ: '' },
            { json: 'acceptFileTypes', js: 'acceptFileTypes', typ: u(undefined, u(a(''), null)) },
            { json: 'allowedRefs', js: 'allowedRefs', typ: r('AllowedRefs') },
            { json: 'allowedRefTags', js: 'allowedRefTags', typ: a('') },
            { json: 'allowOutOfLevelRef', js: 'allowOutOfLevelRef', typ: true },
            { json: 'arrayMaxLength', js: 'arrayMaxLength', typ: u(undefined, u(0, null)) },
            { json: 'arrayMinLength', js: 'arrayMinLength', typ: u(undefined, u(0, null)) },
            { json: 'autoChainRef', js: 'autoChainRef', typ: true },
            { json: 'canBeNull', js: 'canBeNull', typ: true },
            { json: 'defaultOverride', js: 'defaultOverride', typ: u(undefined, 'any') },
            { json: 'editorAlwaysShow', js: 'editorAlwaysShow', typ: true },
            { json: 'editorCutLongValues', js: 'editorCutLongValues', typ: true },
            { json: 'editorDisplayMode', js: 'editorDisplayMode', typ: r('EditorDisplayMode') },
            { json: 'editorDisplayPos', js: 'editorDisplayPos', typ: r('EditorDisplayPos') },
            { json: 'editorTextPrefix', js: 'editorTextPrefix', typ: u(undefined, u(null, '')) },
            { json: 'editorTextSuffix', js: 'editorTextSuffix', typ: u(undefined, u(null, '')) },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'isArray', js: 'isArray', typ: true },
            { json: 'max', js: 'max', typ: u(undefined, u(3.14, null)) },
            { json: 'min', js: 'min', typ: u(undefined, u(3.14, null)) },
            { json: 'regex', js: 'regex', typ: u(undefined, u(null, '')) },
            { json: 'symmetricalRef', js: 'symmetricalRef', typ: true },
            { json: 'textLanguageMode', js: 'textLanguageMode', typ: u(undefined, u(r('TextLanguageMode'), null)) },
            { json: 'tilesetUid', js: 'tilesetUid', typ: u(undefined, u(0, null)) },
            { json: 'type', js: 'type', typ: '' },
            { json: 'uid', js: 'uid', typ: 0 },
            { json: 'useForSmartColor', js: 'useForSmartColor', typ: true }
        ],
        false
    ),
    TilesetRectangle: o(
        [
            { json: 'h', js: 'h', typ: 0 },
            { json: 'tilesetUid', js: 'tilesetUid', typ: 0 },
            { json: 'w', js: 'w', typ: 0 },
            { json: 'x', js: 'x', typ: 0 },
            { json: 'y', js: 'y', typ: 0 }
        ],
        false
    ),
    EnumDefinition: o(
        [
            { json: 'externalFileChecksum', js: 'externalFileChecksum', typ: u(undefined, u(null, '')) },
            { json: 'externalRelPath', js: 'externalRelPath', typ: u(undefined, u(null, '')) },
            { json: 'iconTilesetUid', js: 'iconTilesetUid', typ: u(undefined, u(0, null)) },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'tags', js: 'tags', typ: a('') },
            { json: 'uid', js: 'uid', typ: 0 },
            { json: 'values', js: 'values', typ: a(r('EnumValueDefinition')) }
        ],
        false
    ),
    EnumValueDefinition: o(
        [
            { json: '__tileSrcRect', js: '__tileSrcRect', typ: u(undefined, u(a(0), null)) },
            { json: 'color', js: 'color', typ: 0 },
            { json: 'id', js: 'id', typ: '' },
            { json: 'tileId', js: 'tileId', typ: u(undefined, u(0, null)) }
        ],
        false
    ),
    LayerDefinition: o(
        [
            { json: '__type', js: '__type', typ: '' },
            { json: 'autoRuleGroups', js: 'autoRuleGroups', typ: a(r('AutoLayerRuleGroup')) },
            { json: 'autoSourceLayerDefUid', js: 'autoSourceLayerDefUid', typ: u(undefined, u(0, null)) },
            { json: 'autoTilesetDefUid', js: 'autoTilesetDefUid', typ: u(undefined, u(0, null)) },
            { json: 'displayOpacity', js: 'displayOpacity', typ: 3.14 },
            { json: 'excludedTags', js: 'excludedTags', typ: a('') },
            { json: 'gridSize', js: 'gridSize', typ: 0 },
            { json: 'guideGridHei', js: 'guideGridHei', typ: 0 },
            { json: 'guideGridWid', js: 'guideGridWid', typ: 0 },
            { json: 'hideFieldsWhenInactive', js: 'hideFieldsWhenInactive', typ: true },
            { json: 'hideInList', js: 'hideInList', typ: true },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'inactiveOpacity', js: 'inactiveOpacity', typ: 3.14 },
            { json: 'intGridValues', js: 'intGridValues', typ: a(r('IntGridValueDefinition')) },
            { json: 'parallaxFactorX', js: 'parallaxFactorX', typ: 3.14 },
            { json: 'parallaxFactorY', js: 'parallaxFactorY', typ: 3.14 },
            { json: 'parallaxScaling', js: 'parallaxScaling', typ: true },
            { json: 'pxOffsetX', js: 'pxOffsetX', typ: 0 },
            { json: 'pxOffsetY', js: 'pxOffsetY', typ: 0 },
            { json: 'requiredTags', js: 'requiredTags', typ: a('') },
            { json: 'tilePivotX', js: 'tilePivotX', typ: 3.14 },
            { json: 'tilePivotY', js: 'tilePivotY', typ: 3.14 },
            { json: 'tilesetDefUid', js: 'tilesetDefUid', typ: u(undefined, u(0, null)) },
            { json: 'type', js: 'type', typ: r('Type') },
            { json: 'uid', js: 'uid', typ: 0 }
        ],
        false
    ),
    IntGridValueDefinition: o(
        [
            { json: 'color', js: 'color', typ: '' },
            { json: 'identifier', js: 'identifier', typ: u(undefined, u(null, '')) },
            { json: 'value', js: 'value', typ: 0 }
        ],
        false
    ),
    TilesetDefinition: o(
        [
            { json: '__cHei', js: '__cHei', typ: 0 },
            { json: '__cWid', js: '__cWid', typ: 0 },
            { json: 'cachedPixelData', js: 'cachedPixelData', typ: u(undefined, u(m('any'), null)) },
            { json: 'customData', js: 'customData', typ: a(r('TileCustomMetadata')) },
            { json: 'embedAtlas', js: 'embedAtlas', typ: u(undefined, u(r('EmbedAtlas'), null)) },
            { json: 'enumTags', js: 'enumTags', typ: a(r('EnumTagValue')) },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'padding', js: 'padding', typ: 0 },
            { json: 'pxHei', js: 'pxHei', typ: 0 },
            { json: 'pxWid', js: 'pxWid', typ: 0 },
            { json: 'relPath', js: 'relPath', typ: u(undefined, u(null, '')) },
            { json: 'savedSelections', js: 'savedSelections', typ: a(m('any')) },
            { json: 'spacing', js: 'spacing', typ: 0 },
            { json: 'tags', js: 'tags', typ: a('') },
            { json: 'tagsSourceEnumUid', js: 'tagsSourceEnumUid', typ: u(undefined, u(0, null)) },
            { json: 'tileGridSize', js: 'tileGridSize', typ: 0 },
            { json: 'uid', js: 'uid', typ: 0 }
        ],
        false
    ),
    TileCustomMetadata: o(
        [
            { json: 'data', js: 'data', typ: '' },
            { json: 'tileId', js: 'tileId', typ: 0 }
        ],
        false
    ),
    EnumTagValue: o(
        [
            { json: 'enumValueId', js: 'enumValueId', typ: '' },
            { json: 'tileIds', js: 'tileIds', typ: a(0) }
        ],
        false
    ),
    EntityInstance: o(
        [
            { json: '__grid', js: '__grid', typ: a(0) },
            { json: '__identifier', js: '__identifier', typ: '' },
            { json: '__pivot', js: '__pivot', typ: a(3.14) },
            { json: '__smartColor', js: '__smartColor', typ: '' },
            { json: '__tags', js: '__tags', typ: a('') },
            { json: '__tile', js: '__tile', typ: u(undefined, u(r('TilesetRectangle'), null)) },
            { json: 'defUid', js: 'defUid', typ: 0 },
            { json: 'fieldInstances', js: 'fieldInstances', typ: a(r('FieldInstance')) },
            { json: 'height', js: 'height', typ: 0 },
            { json: 'iid', js: 'iid', typ: '' },
            { json: 'px', js: 'px', typ: a(0) },
            { json: 'width', js: 'width', typ: 0 }
        ],
        false
    ),
    FieldInstance: o(
        [
            { json: '__identifier', js: '__identifier', typ: '' },
            { json: '__tile', js: '__tile', typ: u(undefined, u(r('TilesetRectangle'), null)) },
            { json: '__type', js: '__type', typ: '' },
            { json: '__value', js: '__value', typ: 'any' },
            { json: 'defUid', js: 'defUid', typ: 0 },
            { json: 'realEditorValues', js: 'realEditorValues', typ: a('any') }
        ],
        false
    ),
    FieldInstanceEntityReference: o(
        [
            { json: 'entityIid', js: 'entityIid', typ: '' },
            { json: 'layerIid', js: 'layerIid', typ: '' },
            { json: 'levelIid', js: 'levelIid', typ: '' },
            { json: 'worldIid', js: 'worldIid', typ: '' }
        ],
        false
    ),
    FieldInstanceGridPoint: o(
        [
            { json: 'cx', js: 'cx', typ: 0 },
            { json: 'cy', js: 'cy', typ: 0 }
        ],
        false
    ),
    IntGridValueInstance: o(
        [
            { json: 'coordId', js: 'coordId', typ: 0 },
            { json: 'v', js: 'v', typ: 0 }
        ],
        false
    ),
    LayerInstance: o(
        [
            { json: '__cHei', js: '__cHei', typ: 0 },
            { json: '__cWid', js: '__cWid', typ: 0 },
            { json: '__gridSize', js: '__gridSize', typ: 0 },
            { json: '__identifier', js: '__identifier', typ: '' },
            { json: '__opacity', js: '__opacity', typ: 3.14 },
            { json: '__pxTotalOffsetX', js: '__pxTotalOffsetX', typ: 0 },
            { json: '__pxTotalOffsetY', js: '__pxTotalOffsetY', typ: 0 },
            { json: '__tilesetDefUid', js: '__tilesetDefUid', typ: u(undefined, u(0, null)) },
            { json: '__tilesetRelPath', js: '__tilesetRelPath', typ: u(undefined, u(null, '')) },
            { json: '__type', js: '__type', typ: '' },
            { json: 'autoLayerTiles', js: 'autoLayerTiles', typ: a(r('TileInstance')) },
            { json: 'entityInstances', js: 'entityInstances', typ: a(r('EntityInstance')) },
            { json: 'gridTiles', js: 'gridTiles', typ: a(r('TileInstance')) },
            { json: 'iid', js: 'iid', typ: '' },
            { json: 'intGrid', js: 'intGrid', typ: u(undefined, u(a(r('IntGridValueInstance')), null)) },
            { json: 'intGridCsv', js: 'intGridCsv', typ: a(0) },
            { json: 'layerDefUid', js: 'layerDefUid', typ: 0 },
            { json: 'levelId', js: 'levelId', typ: 0 },
            { json: 'optionalRules', js: 'optionalRules', typ: a(0) },
            { json: 'overrideTilesetUid', js: 'overrideTilesetUid', typ: u(undefined, u(0, null)) },
            { json: 'pxOffsetX', js: 'pxOffsetX', typ: 0 },
            { json: 'pxOffsetY', js: 'pxOffsetY', typ: 0 },
            { json: 'seed', js: 'seed', typ: 0 },
            { json: 'visible', js: 'visible', typ: true }
        ],
        false
    ),
    TileInstance: o(
        [
            { json: 'd', js: 'd', typ: a(0) },
            { json: 'f', js: 'f', typ: 0 },
            { json: 'px', js: 'px', typ: a(0) },
            { json: 'src', js: 'src', typ: a(0) },
            { json: 't', js: 't', typ: 0 }
        ],
        false
    ),
    Level: o(
        [
            { json: '__bgColor', js: '__bgColor', typ: '' },
            { json: '__bgPos', js: '__bgPos', typ: u(undefined, u(r('LevelBackgroundPosition'), null)) },
            { json: '__neighbours', js: '__neighbours', typ: a(r('NeighbourLevel')) },
            { json: '__smartColor', js: '__smartColor', typ: '' },
            { json: 'bgColor', js: 'bgColor', typ: u(undefined, u(null, '')) },
            { json: 'bgPivotX', js: 'bgPivotX', typ: 3.14 },
            { json: 'bgPivotY', js: 'bgPivotY', typ: 3.14 },
            { json: 'bgPos', js: 'bgPos', typ: u(undefined, u(r('BgPos'), null)) },
            { json: 'bgRelPath', js: 'bgRelPath', typ: u(undefined, u(null, '')) },
            { json: 'externalRelPath', js: 'externalRelPath', typ: u(undefined, u(null, '')) },
            { json: 'fieldInstances', js: 'fieldInstances', typ: a(r('FieldInstance')) },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'iid', js: 'iid', typ: '' },
            { json: 'layerInstances', js: 'layerInstances', typ: u(undefined, u(a(r('LayerInstance')), null)) },
            { json: 'pxHei', js: 'pxHei', typ: 0 },
            { json: 'pxWid', js: 'pxWid', typ: 0 },
            { json: 'uid', js: 'uid', typ: 0 },
            { json: 'useAutoIdentifier', js: 'useAutoIdentifier', typ: true },
            { json: 'worldDepth', js: 'worldDepth', typ: 0 },
            { json: 'worldX', js: 'worldX', typ: 0 },
            { json: 'worldY', js: 'worldY', typ: 0 }
        ],
        false
    ),
    LevelBackgroundPosition: o(
        [
            { json: 'cropRect', js: 'cropRect', typ: a(3.14) },
            { json: 'scale', js: 'scale', typ: a(3.14) },
            { json: 'topLeftPx', js: 'topLeftPx', typ: a(0) }
        ],
        false
    ),
    NeighbourLevel: o(
        [
            { json: 'dir', js: 'dir', typ: '' },
            { json: 'levelIid', js: 'levelIid', typ: '' },
            { json: 'levelUid', js: 'levelUid', typ: u(undefined, 0) }
        ],
        false
    ),
    World: o(
        [
            { json: 'defaultLevelHeight', js: 'defaultLevelHeight', typ: 0 },
            { json: 'defaultLevelWidth', js: 'defaultLevelWidth', typ: 0 },
            { json: 'identifier', js: 'identifier', typ: '' },
            { json: 'iid', js: 'iid', typ: '' },
            { json: 'levels', js: 'levels', typ: a(r('Level')) },
            { json: 'worldGridHeight', js: 'worldGridHeight', typ: 0 },
            { json: 'worldGridWidth', js: 'worldGridWidth', typ: 0 },
            { json: 'worldLayout', js: 'worldLayout', typ: u(r('WorldLayout'), null) }
        ],
        false
    ),
    Checker: ['Horizontal', 'None', 'Vertical'],
    TileMode: ['Single', 'Stamp'],
    AllowedRefs: ['Any', 'OnlySame', 'OnlyTags'],
    EditorDisplayMode: [
        'ArrayCountNoLabel',
        'ArrayCountWithLabel',
        'EntityTile',
        'Hidden',
        'NameAndValue',
        'PointPath',
        'PointPathLoop',
        'PointStar',
        'Points',
        'RadiusGrid',
        'RadiusPx',
        'RefLinkBetweenCenters',
        'RefLinkBetweenPivots',
        'ValueOnly'
    ],
    EditorDisplayPos: ['Above', 'Beneath', 'Center'],
    TextLanguageMode: ['LangC', 'LangHaxe', 'LangJS', 'LangJson', 'LangLog', 'LangLua', 'LangMarkdown', 'LangPython', 'LangRuby', 'LangXml'],
    LimitBehavior: ['DiscardOldOnes', 'MoveLastOne', 'PreventAdding'],
    LimitScope: ['PerLayer', 'PerLevel', 'PerWorld'],
    RenderMode: ['Cross', 'Ellipse', 'Rectangle', 'Tile'],
    TileRenderMode: ['Cover', 'FitInside', 'FullSizeCropped', 'FullSizeUncropped', 'NineSlice', 'Repeat', 'Stretch'],
    Type: ['AutoLayer', 'Entities', 'IntGrid', 'Tiles'],
    EmbedAtlas: ['LdtkIcons'],
    BgPos: ['Contain', 'Cover', 'CoverDirty', 'Unscaled'],
    WorldLayout: ['Free', 'GridVania', 'LinearHorizontal', 'LinearVertical'],
    Flag: ['DiscardPreCsvIntGrid', 'ExportPreCsvIntGridFormat', 'IgnoreBackupSuggest', 'MultiWorlds', 'PrependIndexToLevelFileNames', 'UseMultilinesType'],
    IdentifierStyle: ['Capitalize', 'Free', 'Lowercase', 'Uppercase'],
    ImageExportMode: ['LayersAndLevels', 'None', 'OneImagePerLayer', 'OneImagePerLevel']
}
