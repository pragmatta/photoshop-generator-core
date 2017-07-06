## Modules

<dl>
<dt><a href="#module_plugin">plugin</a></dt>
<dd></dd>
<dt><a href="#module_server">server</a></dt>
<dd></dd>
<dt><a href="#module_system">system</a></dt>
<dd></dd>
<dt><a href="#module_layer">layer</a></dt>
<dd></dd>
<dt><a href="#module_document">document</a></dt>
<dd></dd>
<dt><a href="#module_delta">delta</a></dt>
<dd></dd>
<dt><a href="#module_photoshop">photoshop</a></dt>
<dd></dd>
<dt><a href="#module_png">png</a></dt>
<dd></dd>
<dt><a href="#module_file">file</a></dt>
<dd></dd>
<dt><a href="#module_directory">directory</a></dt>
<dd></dd>
<dt><a href="#module_http">http</a></dt>
<dd></dd>
<dt><a href="#module_util">util</a></dt>
<dd></dd>
<dt><a href="#module_log">log</a></dt>
<dd></dd>
<dt><a href="#module_json">json</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#Generator">Generator</a> : <code>object</code></dt>
<dd><p>photoshop-generator-core module for Photoshop generator plugins</p>
</dd>
</dl>

<a name="module_plugin"></a>

## plugin

* [plugin](#module_plugin)
    * [.pluginInitialize()](#module_plugin.pluginInitialize)
    * [.pluginStart()](#module_plugin.pluginStart)
    * [.pluginPause()](#module_plugin.pluginPause)
    * [.pluginGetTimestamp()](#module_plugin.pluginGetTimestamp) ⇒ <code>number</code>
    * [.pluginGetPreference(key)](#module_plugin.pluginGetPreference) ⇒ <code>string</code>
    * [.pluginSetPreference(key, value, save)](#module_plugin.pluginSetPreference) ⇒ <code>string</code>
    * [.pluginSavePreferences()](#module_plugin.pluginSavePreferences)
    * [.pluginLoadPreferences()](#module_plugin.pluginLoadPreferences)
    * [.pluginGetSessionId()](#module_plugin.pluginGetSessionId) ⇒ <code>string</code>
    * [.pluginGetHomeDirectory()](#module_plugin.pluginGetHomeDirectory) ⇒ <code>string</code>
    * [.pluginGetDataDirectory()](#module_plugin.pluginGetDataDirectory) ⇒ <code>string</code>
    * [.pluginSetupMenuItem(menu_id, menu_label)](#module_plugin.pluginSetupMenuItem) ⇒ <code>string</code>
    * [.pluginUpdateMenuState(menu_id, menu_enabled)](#module_plugin.pluginUpdateMenuState) ⇒ <code>string</code>
    * [.pluginSetEventHandler(event, callback)](#module_plugin.pluginSetEventHandler)

<a name="module_plugin.pluginInitialize"></a>

### plugin.pluginInitialize()
Initialize Photoshop Generator connection

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginStart"></a>

### plugin.pluginStart()
Start Photoshop event listening

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginPause"></a>

### plugin.pluginPause()
Pause Photoshop event listening

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginGetTimestamp"></a>

### plugin.pluginGetTimestamp() ⇒ <code>number</code>
Generate a timestamp

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginGetPreference"></a>

### plugin.pluginGetPreference(key) ⇒ <code>string</code>
Get a plugin preference value for a key

**Kind**: static method of [<code>plugin</code>](#module_plugin)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key of the preference |

<a name="module_plugin.pluginSetPreference"></a>

### plugin.pluginSetPreference(key, value, save) ⇒ <code>string</code>
Set a plugin preference value for a key

**Kind**: static method of [<code>plugin</code>](#module_plugin)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key of the preference |
| value | <code>string</code> | Value of the preference |
| save | <code>bool</code> | Whether to save preferences |

<a name="module_plugin.pluginSavePreferences"></a>

### plugin.pluginSavePreferences()
Save plugin preferences

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginLoadPreferences"></a>

### plugin.pluginLoadPreferences()
Load plugin preferences

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginGetSessionId"></a>

### plugin.pluginGetSessionId() ⇒ <code>string</code>
Get session id

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginGetHomeDirectory"></a>

### plugin.pluginGetHomeDirectory() ⇒ <code>string</code>
Get the plugin folder path

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginGetDataDirectory"></a>

### plugin.pluginGetDataDirectory() ⇒ <code>string</code>
Get the plugin data folder path

**Kind**: static method of [<code>plugin</code>](#module_plugin)  
<a name="module_plugin.pluginSetupMenuItem"></a>

### plugin.pluginSetupMenuItem(menu_id, menu_label) ⇒ <code>string</code>
Setup a plugin menu item in File -> Generate

**Kind**: static method of [<code>plugin</code>](#module_plugin)  

| Param | Type | Description |
| --- | --- | --- |
| menu_id | <code>string</code> | Id of the menu item |
| menu_label | <code>string</code> | Title of the menu item |

<a name="module_plugin.pluginUpdateMenuState"></a>

### plugin.pluginUpdateMenuState(menu_id, menu_enabled) ⇒ <code>string</code>
Update the menu state of a menu item

**Kind**: static method of [<code>plugin</code>](#module_plugin)  

| Param | Type | Description |
| --- | --- | --- |
| menu_id | <code>string</code> | Id of the menu item |
| menu_enabled | <code>bool</code> | Turn menu selection on/off |

<a name="module_plugin.pluginSetEventHandler"></a>

### plugin.pluginSetEventHandler(event, callback)
Set a callback for one of the events: onDocumentActivate, onDocumentSelect, onDocumentUpdate, onSelectionChange, onDocumentChange, onMenuChange, onToolChange, onAssertFail.

**Kind**: static method of [<code>plugin</code>](#module_plugin)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | Id of the event |
| callback | <code>function</code> | Handler of the event |

<a name="module_server"></a>

## server

* [server](#module_server)
    * [.serverGetPrimaryPort()](#module_server.serverGetPrimaryPort) ⇒ <code>number</code>
    * [.serverSetSecondaryPort(port)](#module_server.serverSetSecondaryPort)
    * [.serverGetSecondaryPort()](#module_server.serverGetSecondaryPort) ⇒ <code>number</code>
    * [.serverSetRequestHandler(service, callback)](#module_server.serverSetRequestHandler)
    * [.serverSetRequestValidator(callback)](#module_server.serverSetRequestValidator)

<a name="module_server.serverGetPrimaryPort"></a>

### server.serverGetPrimaryPort() ⇒ <code>number</code>
Get primary server port

**Kind**: static method of [<code>server</code>](#module_server)  
<a name="module_server.serverSetSecondaryPort"></a>

### server.serverSetSecondaryPort(port)
Set secondary server port

**Kind**: static method of [<code>server</code>](#module_server)  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>number</code> | Server port |

<a name="module_server.serverGetSecondaryPort"></a>

### server.serverGetSecondaryPort() ⇒ <code>number</code>
Get secondary server port

**Kind**: static method of [<code>server</code>](#module_server)  
<a name="module_server.serverSetRequestHandler"></a>

### server.serverSetRequestHandler(service, callback)
Set server handler for a service

**Kind**: static method of [<code>server</code>](#module_server)  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>string</code> | Name of the service |
| callback | <code>function</code> | Handler of the service |

<a name="module_server.serverSetRequestValidator"></a>

### server.serverSetRequestValidator(callback)
Set a method for validating incoming requests (e.g. only allow local requests)

**Kind**: static method of [<code>server</code>](#module_server)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Validator of the incoming HTTP requests |

<a name="module_system"></a>

## system

* [system](#module_system)
    * [.systemIsWindows()](#module_system.systemIsWindows) ⇒ <code>bool</code>
    * [.systemIsMac()](#module_system.systemIsMac) ⇒ <code>bool</code>
    * [.systemExecuteInstaller(path, package_file)](#module_system.systemExecuteInstaller)
    * [.systemGetEnvironmentVariable(variable)](#module_system.systemGetEnvironmentVariable) ⇒ <code>string</code>
    * [.systemGetDocumentsDirectory()](#module_system.systemGetDocumentsDirectory) ⇒ <code>string</code>
    * [.systemGetUserDirectory()](#module_system.systemGetUserDirectory) ⇒ <code>string</code>
    * [.systemGetAppdataDirectory()](#module_system.systemGetAppdataDirectory) ⇒ <code>string</code>
    * [.systemGetTemporaryDirectory()](#module_system.systemGetTemporaryDirectory) ⇒ <code>string</code>

<a name="module_system.systemIsWindows"></a>

### system.systemIsWindows() ⇒ <code>bool</code>
Whether system is Windows

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_system.systemIsMac"></a>

### system.systemIsMac() ⇒ <code>bool</code>
Whether system is MacOS

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_system.systemExecuteInstaller"></a>

### system.systemExecuteInstaller(path, package_file)
Whether system is Windows

**Kind**: static method of [<code>system</code>](#module_system)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Directory of the installer |
| package_file | <code>string</code> | Name of the installer file |

<a name="module_system.systemGetEnvironmentVariable"></a>

### system.systemGetEnvironmentVariable(variable) ⇒ <code>string</code>
Get and environment value

**Kind**: static method of [<code>system</code>](#module_system)  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>string</code> | Name of the variable |

<a name="module_system.systemGetDocumentsDirectory"></a>

### system.systemGetDocumentsDirectory() ⇒ <code>string</code>
Get the system document folder path

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_system.systemGetUserDirectory"></a>

### system.systemGetUserDirectory() ⇒ <code>string</code>
Get the system user folder path

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_system.systemGetAppdataDirectory"></a>

### system.systemGetAppdataDirectory() ⇒ <code>string</code>
Get the system application data folder path

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_system.systemGetTemporaryDirectory"></a>

### system.systemGetTemporaryDirectory() ⇒ <code>string</code>
Get the system temporary folder path

**Kind**: static method of [<code>system</code>](#module_system)  
<a name="module_layer"></a>

## layer

* [layer](#module_layer)
    * [.layerGetPreferences(layer)](#module_layer.layerGetPreferences) ⇒ <code>Object</code>
    * [.layerSetPreferences(layer, preferences)](#module_layer.layerSetPreferences)
    * [.layerGetWidth(layer)](#module_layer.layerGetWidth) ⇒ <code>number</code>
    * [.layerGetHeight(layer)](#module_layer.layerGetHeight) ⇒ <code>number</code>
    * [.layerGetContainerBounds(layer)](#module_layer.layerGetContainerBounds) ⇒ <code>Object</code>
    * [.layerGetContainer(layer)](#module_layer.layerGetContainer) ⇒ <code>Object</code>
    * [.layerGetBounds(layer)](#module_layer.layerGetBounds) ⇒ <code>Object</code>
    * [.layerBoundsUnion(bounds_a, bounds_b)](#module_layer.layerBoundsUnion) ⇒ <code>Object</code>
    * [.layerBoundsIntersection(bounds_a, bounds_b)](#module_layer.layerBoundsIntersection) ⇒ <code>Object</code>
    * [.layerGetExtents(layer)](#module_layer.layerGetExtents) ⇒ <code>Object</code>
    * [.layerGetTextFont(layer)](#module_layer.layerGetTextFont) ⇒ <code>Object</code>
    * [.layerGetFillColor(layer)](#module_layer.layerGetFillColor) ⇒ <code>string</code>
    * [.layerGetByIndex(doc_id, layer_index)](#module_layer.layerGetByIndex) ⇒ <code>Object</code>
    * [.layerGetById(doc_id, layer_id)](#module_layer.layerGetById) ⇒ <code>Object</code>
    * [.layerGetChildByIndex(layer, child_index)](#module_layer.layerGetChildByIndex) ⇒ <code>Object</code>
    * [.layerGetByUid(layer_uid)](#module_layer.layerGetByUid) ⇒ <code>Object</code>
    * [.layerGetByUrl(layer_url)](#module_layer.layerGetByUrl) ⇒ <code>Object</code>
    * [.layerGetId(layer)](#module_layer.layerGetId) ⇒ <code>string</code>
    * [.layerGetUid(layer)](#module_layer.layerGetUid) ⇒ <code>string</code>
    * [.layerGetUrl(layer)](#module_layer.layerGetUrl) ⇒ <code>Object</code>
    * [.layerIsArtboard(layer)](#module_layer.layerIsArtboard) ⇒ <code>bool</code>
    * [.layerIsBasicRectangle(layer)](#module_layer.layerIsBasicRectangle) ⇒ <code>bool</code>
    * [.layerIsContent(layer)](#module_layer.layerIsContent) ⇒ <code>bool</code>
    * [.layerIsDocument(layer)](#module_layer.layerIsDocument) ⇒ <code>bool</code>
    * [.layerIsEmpty(layer)](#module_layer.layerIsEmpty) ⇒ <code>bool</code>
    * [.layerIsFill(layer)](#module_layer.layerIsFill) ⇒ <code>bool</code>
    * [.layerIsGroup(layer)](#module_layer.layerIsGroup) ⇒ <code>bool</code>
    * [.layerIsInsideBounds(layer, container_bounds)](#module_layer.layerIsInsideBounds) ⇒ <code>bool</code>
    * [.layerIsMasked(layer)](#module_layer.layerIsMasked) ⇒ <code>bool</code>
    * [.layerIsNormal(layer)](#module_layer.layerIsNormal) ⇒ <code>bool</code>
    * [.layerIsParagraphText(layer)](#module_layer.layerIsParagraphText) ⇒ <code>bool</code>
    * [.layerIsParent(layer)](#module_layer.layerIsParent) ⇒ <code>bool</code>
    * [.layerIsPixels(layer)](#module_layer.layerIsPixels) ⇒ <code>bool</code>
    * [.layerIsRectangle(layer)](#module_layer.layerIsRectangle) ⇒ <code>bool</code>
    * [.layerIsShape(layer)](#module_layer.layerIsShape) ⇒ <code>bool</code>
    * [.layerIsSmartObject(layer)](#module_layer.layerIsSmartObject) ⇒ <code>bool</code>
    * [.layerIsText(layer)](#module_layer.layerIsText) ⇒ <code>bool</code>
    * [.layerIsVisible(layer)](#module_layer.layerIsVisible) ⇒ <code>bool</code>

<a name="module_layer.layerGetPreferences"></a>

### layer.layerGetPreferences(layer) ⇒ <code>Object</code>
Get the layer preferences for this plugin

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerSetPreferences"></a>

### layer.layerSetPreferences(layer, preferences)
Set the layer preferences for this plugin

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |
| preferences | <code>Object</code> | Preferences-object |

<a name="module_layer.layerGetWidth"></a>

### layer.layerGetWidth(layer) ⇒ <code>number</code>
Get the layer width

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetHeight"></a>

### layer.layerGetHeight(layer) ⇒ <code>number</code>
Get the layer height

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetContainerBounds"></a>

### layer.layerGetContainerBounds(layer) ⇒ <code>Object</code>
Get the bounds of the container (document or artboard) of the layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetContainer"></a>

### layer.layerGetContainer(layer) ⇒ <code>Object</code>
Get the container (document or artboard) of the layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetBounds"></a>

### layer.layerGetBounds(layer) ⇒ <code>Object</code>
Get the bounds of the layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerBoundsUnion"></a>

### layer.layerBoundsUnion(bounds_a, bounds_b) ⇒ <code>Object</code>
Calculate union of two bounds

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| bounds_a | <code>Object</code> | first bounds |
| bounds_b | <code>Object</code> | second bounds |

<a name="module_layer.layerBoundsIntersection"></a>

### layer.layerBoundsIntersection(bounds_a, bounds_b) ⇒ <code>Object</code>
Calculate intersection of two bounds

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| bounds_a | <code>Object</code> | first bounds |
| bounds_b | <code>Object</code> | second bounds |

<a name="module_layer.layerGetExtents"></a>

### layer.layerGetExtents(layer) ⇒ <code>Object</code>
Get the layer extents with x, y, w, h in relation to container bounds and origo in bottom left

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetTextFont"></a>

### layer.layerGetTextFont(layer) ⇒ <code>Object</code>
Get the font information of a text layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetFillColor"></a>

### layer.layerGetFillColor(layer) ⇒ <code>string</code>
Get the fill color as a hex string

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetByIndex"></a>

### layer.layerGetByIndex(doc_id, layer_index) ⇒ <code>Object</code>
Get a layer by index

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| doc_id | <code>Object</code> | id of the document of the layer |
| layer_index | <code>string</code> | index of the layer |

<a name="module_layer.layerGetById"></a>

### layer.layerGetById(doc_id, layer_id) ⇒ <code>Object</code>
Get a layer from a document by id

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| doc_id | <code>Object</code> | id of the document of the layer |
| layer_id | <code>string</code> | id of the layer |

<a name="module_layer.layerGetChildByIndex"></a>

### layer.layerGetChildByIndex(layer, child_index) ⇒ <code>Object</code>
Get a child layer by the index

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |
| child_index | <code>number</code> | index of the child |

<a name="module_layer.layerGetByUid"></a>

### layer.layerGetByUid(layer_uid) ⇒ <code>Object</code>
Get a layer by the UID

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer_uid | <code>string</code> | UID of the layer |

<a name="module_layer.layerGetByUrl"></a>

### layer.layerGetByUrl(layer_url) ⇒ <code>Object</code>
Get a layer by the Url

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer_url | <code>string</code> | Url of the layer |

<a name="module_layer.layerGetId"></a>

### layer.layerGetId(layer) ⇒ <code>string</code>
Get a layer UID

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetUid"></a>

### layer.layerGetUid(layer) ⇒ <code>string</code>
Get a layer UID

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerGetUrl"></a>

### layer.layerGetUrl(layer) ⇒ <code>Object</code>
Get a layer URL

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>string</code> | Layer-object |

<a name="module_layer.layerIsArtboard"></a>

### layer.layerIsArtboard(layer) ⇒ <code>bool</code>
Layer is an artboard

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsBasicRectangle"></a>

### layer.layerIsBasicRectangle(layer) ⇒ <code>bool</code>
Layer is a rectangle without effects

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsContent"></a>

### layer.layerIsContent(layer) ⇒ <code>bool</code>
Layer has some content

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsDocument"></a>

### layer.layerIsDocument(layer) ⇒ <code>bool</code>
Layer is a document

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsEmpty"></a>

### layer.layerIsEmpty(layer) ⇒ <code>bool</code>
Layer is or appears empty (e.g. invisible)

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsFill"></a>

### layer.layerIsFill(layer) ⇒ <code>bool</code>
Layer has a fill

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsGroup"></a>

### layer.layerIsGroup(layer) ⇒ <code>bool</code>
Layer is a group

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsInsideBounds"></a>

### layer.layerIsInsideBounds(layer, container_bounds) ⇒ <code>bool</code>
Layer content is contained in given bounds (false if empty)

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |
| container_bounds | <code>Object</code> | bounds of the container |

<a name="module_layer.layerIsMasked"></a>

### layer.layerIsMasked(layer) ⇒ <code>bool</code>
Layer has a mask

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsNormal"></a>

### layer.layerIsNormal(layer) ⇒ <code>bool</code>
Layer is a basic art layer (i.e. not a group, artboard or a document)

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsParagraphText"></a>

### layer.layerIsParagraphText(layer) ⇒ <code>bool</code>
Layer is a paragraph text layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsParent"></a>

### layer.layerIsParent(layer) ⇒ <code>bool</code>
Layer has children

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsPixels"></a>

### layer.layerIsPixels(layer) ⇒ <code>bool</code>
Layer is pixel data (i.e. not vector)

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsRectangle"></a>

### layer.layerIsRectangle(layer) ⇒ <code>bool</code>
Layer is a rectangle shape

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsShape"></a>

### layer.layerIsShape(layer) ⇒ <code>bool</code>
Layer is a shape

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsSmartObject"></a>

### layer.layerIsSmartObject(layer) ⇒ <code>bool</code>
Layer is a smart object

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsText"></a>

### layer.layerIsText(layer) ⇒ <code>bool</code>
Layer is a text layer

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_layer.layerIsVisible"></a>

### layer.layerIsVisible(layer) ⇒ <code>bool</code>
Layer is visible

**Kind**: static method of [<code>layer</code>](#module_layer)  

| Param | Type | Description |
| --- | --- | --- |
| layer | <code>Object</code> | Layer-object |

<a name="module_document"></a>

## document

* [document](#module_document)
    * [.documentGetActiveLayer(doc)](#module_document.documentGetActiveLayer) ⇒ <code>Object</code>
    * [.documentGetById(doc_or_url_or_id)](#module_document.documentGetById) ⇒ <code>Object</code>
    * [.documentGetAll()](#module_document.documentGetAll) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.documentGetActive()](#module_document.documentGetActive) ⇒ <code>Object</code>
    * [.documentIsActive(doc)](#module_document.documentIsActive) ⇒ <code>bool</code>
    * [.documentHasArtboards(doc)](#module_document.documentHasArtboards) ⇒ <code>bool</code>
    * [.documentUpdate(doc_id, callback)](#module_document.documentUpdate)

<a name="module_document.documentGetActiveLayer"></a>

### document.documentGetActiveLayer(doc) ⇒ <code>Object</code>
Get the selected layer of a document

**Kind**: static method of [<code>document</code>](#module_document)  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Object</code> | document-object |

<a name="module_document.documentGetById"></a>

### document.documentGetById(doc_or_url_or_id) ⇒ <code>Object</code>
Get document by Id (or Url)

**Kind**: static method of [<code>document</code>](#module_document)  

| Param | Type | Description |
| --- | --- | --- |
| doc_or_url_or_id | <code>Object</code> \| <code>string</code> | document-object or an Url or an id |

<a name="module_document.documentGetAll"></a>

### document.documentGetAll() ⇒ <code>Array.&lt;Object&gt;</code>
Get all current documents

**Kind**: static method of [<code>document</code>](#module_document)  
<a name="module_document.documentGetActive"></a>

### document.documentGetActive() ⇒ <code>Object</code>
Get the active document

**Kind**: static method of [<code>document</code>](#module_document)  
<a name="module_document.documentIsActive"></a>

### document.documentIsActive(doc) ⇒ <code>bool</code>
Whether document is active

**Kind**: static method of [<code>document</code>](#module_document)  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Object</code> | document-object |

<a name="module_document.documentHasArtboards"></a>

### document.documentHasArtboards(doc) ⇒ <code>bool</code>
Document has artboards

**Kind**: static method of [<code>document</code>](#module_document)  

| Param | Type | Description |
| --- | --- | --- |
| doc | <code>Object</code> | document-object |

<a name="module_document.documentUpdate"></a>

### document.documentUpdate(doc_id, callback)
Update document information

**Kind**: static method of [<code>document</code>](#module_document)  

| Param | Type | Description |
| --- | --- | --- |
| doc_id | <code>string</code> | Document Id |
| callback |  | Result callback for the document data |

<a name="module_delta"></a>

## delta

* [delta](#module_delta)
    * [.deltaChildrenChanged(data, delta)](#module_delta.deltaChildrenChanged) ⇒ <code>bool</code>
    * [.deltaContentChanged(data, delta)](#module_delta.deltaContentChanged) ⇒ <code>bool</code>
    * [.deltaCreated(data, delta)](#module_delta.deltaCreated) ⇒ <code>bool</code>
    * [.deltaDocumentMetaChanged(data, delta)](#module_delta.deltaDocumentMetaChanged) ⇒ <code>bool</code>
    * [.deltaDocumentSelectionChanged(data, delta)](#module_delta.deltaDocumentSelectionChanged) ⇒ <code>bool</code>
    * [.deltaDocumentActivated(data, delta)](#module_delta.deltaDocumentActivated) ⇒ <code>bool</code>
    * [.deltaDocumentClosed(data, delta)](#module_delta.deltaDocumentClosed) ⇒ <code>bool</code>
    * [.deltaDocumentSaved(data, delta)](#module_delta.deltaDocumentSaved) ⇒ <code>bool</code>
    * [.deltaDocumentFileChanged(data, delta)](#module_delta.deltaDocumentFileChanged) ⇒ <code>bool</code>
    * [.deltaDocumentChanged(data, delta)](#module_delta.deltaDocumentChanged) ⇒ <code>bool</code>
    * [.deltaEffectsChanged(data, delta)](#module_delta.deltaEffectsChanged) ⇒ <code>bool</code>
    * [.deltaFillChanged(data, delta)](#module_delta.deltaFillChanged) ⇒ <code>bool</code>
    * [.deltaMaskChanged(data, delta)](#module_delta.deltaMaskChanged) ⇒ <code>bool</code>
    * [.deltaMoved(data, delta)](#module_delta.deltaMoved) ⇒ <code>bool</code>
    * [.deltaPreferencesChanged(data, delta)](#module_delta.deltaPreferencesChanged) ⇒ <code>bool</code>
    * [.deltaRemoved(data, delta)](#module_delta.deltaRemoved) ⇒ <code>bool</code>
    * [.deltaRenamed(data, delta)](#module_delta.deltaRenamed) ⇒ <code>bool</code>
    * [.deltaReordered(data, delta)](#module_delta.deltaReordered) ⇒ <code>bool</code>
    * [.deltaResized(data, delta)](#module_delta.deltaResized) ⇒ <code>bool</code>
    * [.deltaTextChanged(data, delta)](#module_delta.deltaTextChanged) ⇒ <code>bool</code>

<a name="module_delta.deltaChildrenChanged"></a>

### delta.deltaChildrenChanged(data, delta) ⇒ <code>bool</code>
Whether layer children have changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaContentChanged"></a>

### delta.deltaContentChanged(data, delta) ⇒ <code>bool</code>
Whether layer content has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaCreated"></a>

### delta.deltaCreated(data, delta) ⇒ <code>bool</code>
Whether layer has been created

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentMetaChanged"></a>

### delta.deltaDocumentMetaChanged(data, delta) ⇒ <code>bool</code>
Whether layer metadata has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentSelectionChanged"></a>

### delta.deltaDocumentSelectionChanged(data, delta) ⇒ <code>bool</code>
Whether document selection has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentActivated"></a>

### delta.deltaDocumentActivated(data, delta) ⇒ <code>bool</code>
Whether document has become active

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentClosed"></a>

### delta.deltaDocumentClosed(data, delta) ⇒ <code>bool</code>
Whether document has closed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentSaved"></a>

### delta.deltaDocumentSaved(data, delta) ⇒ <code>bool</code>
Whether document has been saved

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentFileChanged"></a>

### delta.deltaDocumentFileChanged(data, delta) ⇒ <code>bool</code>
Whether document file has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaDocumentChanged"></a>

### delta.deltaDocumentChanged(data, delta) ⇒ <code>bool</code>
Whether document has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaEffectsChanged"></a>

### delta.deltaEffectsChanged(data, delta) ⇒ <code>bool</code>
Whether layer effects have changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaFillChanged"></a>

### delta.deltaFillChanged(data, delta) ⇒ <code>bool</code>
Whether layer fill has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaMaskChanged"></a>

### delta.deltaMaskChanged(data, delta) ⇒ <code>bool</code>
Whether layer mask has changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaMoved"></a>

### delta.deltaMoved(data, delta) ⇒ <code>bool</code>
Whether layer has moved

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaPreferencesChanged"></a>

### delta.deltaPreferencesChanged(data, delta) ⇒ <code>bool</code>
Whether layer preferences have changed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaRemoved"></a>

### delta.deltaRemoved(data, delta) ⇒ <code>bool</code>
Whether layer has been removed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaRenamed"></a>

### delta.deltaRenamed(data, delta) ⇒ <code>bool</code>
Whether layer has renamed

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaReordered"></a>

### delta.deltaReordered(data, delta) ⇒ <code>bool</code>
Whether layer has changed in order

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaResized"></a>

### delta.deltaResized(data, delta) ⇒ <code>bool</code>
Whether layer has resized

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_delta.deltaTextChanged"></a>

### delta.deltaTextChanged(data, delta) ⇒ <code>bool</code>
Whether layer has changed text content

**Kind**: static method of [<code>delta</code>](#module_delta)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | original object |
| delta | <code>Object</code> | change object |

<a name="module_photoshop"></a>

## photoshop

* [photoshop](#module_photoshop)
    * [.photoshopExecuteScript(str, [callback], [error])](#module_photoshop.photoshopExecuteScript)
    * [.photoshopOpenDocument(path, [callback], [error])](#module_photoshop.photoshopOpenDocument)
    * [.photoshopSetActiveDocument(id, [callback], [error])](#module_photoshop.photoshopSetActiveDocument)
    * [.photoshopCloseDocument(id, save, [callback], [error])](#module_photoshop.photoshopCloseDocument)
    * [.photoshopExecuteAction(set_id, action_id, [callback], [error])](#module_photoshop.photoshopExecuteAction)
    * [.photoshopGetOpenDocuments([callback], [error])](#module_photoshop.photoshopGetOpenDocuments)

<a name="module_photoshop.photoshopExecuteScript"></a>

### photoshop.photoshopExecuteScript(str, [callback], [error])
Execute a JSX-script string in Photoshop

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | JSX-script string |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_photoshop.photoshopOpenDocument"></a>

### photoshop.photoshopOpenDocument(path, [callback], [error])
Open a new file in Photoshop

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to file |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_photoshop.photoshopSetActiveDocument"></a>

### photoshop.photoshopSetActiveDocument(id, [callback], [error])
Change the active document in Photoshop

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of the document |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_photoshop.photoshopCloseDocument"></a>

### photoshop.photoshopCloseDocument(id, save, [callback], [error])
Close a document in Photoshop

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Id of the document |
| save | <code>bool</code> | Whether to save doc before closing |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_photoshop.photoshopExecuteAction"></a>

### photoshop.photoshopExecuteAction(set_id, action_id, [callback], [error])
Execute a Photoshop action

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| set_id | <code>string</code> | Id of the action set |
| action_id | <code>string</code> | Id of the action |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_photoshop.photoshopGetOpenDocuments"></a>

### photoshop.photoshopGetOpenDocuments([callback], [error])
Get all open documents

**Kind**: static method of [<code>photoshop</code>](#module_photoshop)  

| Param | Type | Description |
| --- | --- | --- |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_png"></a>

## png

* [png](#module_png)
    * [.pngConvertToGif(gif_file, png_files, fps, loop_count, [callback])](#module_png.pngConvertToGif)
    * [.pngWrite(doc_id, layers, filename, [bounds], [callback], [error])](#module_png.pngWrite)
    * [.pngStream(doc_id, layers, stream, [bounds], [callback], [error])](#module_png.pngStream)

<a name="module_png.pngConvertToGif"></a>

### png.pngConvertToGif(gif_file, png_files, fps, loop_count, [callback])
Convert PNG-files on disk to an animated GIF. Updates "pngConvertToGif"-task for progress updates.

**Kind**: static method of [<code>png</code>](#module_png)  

| Param | Type | Description |
| --- | --- | --- |
| gif_file | <code>string</code> | Path of the created GIF-file |
| png_files | <code>Array.&lt;string&gt;</code> | Array of PNG-file paths for animation frames |
| fps | <code>number</code> | Playback speed of animation |
| loop_count | <code>number</code> | Number of animation repeats, 0 for infinite |
| [callback] | <code>function</code> | Result callback |

<a name="module_png.pngWrite"></a>

### png.pngWrite(doc_id, layers, filename, [bounds], [callback], [error])
Write layers to a PNG-file

**Kind**: static method of [<code>png</code>](#module_png)  

| Param | Type | Description |
| --- | --- | --- |
| doc_id | <code>string</code> | Document of the layers |
| layers | <code>Array.&lt;Object&gt;</code> | Array of layers |
| filename | <code>string</code> | Path to filename |
| [bounds] | <code>Object</code> | Bounds to use for export if not layer bounds |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_png.pngStream"></a>

### png.pngStream(doc_id, layers, stream, [bounds], [callback], [error])
Write layers to a stream

**Kind**: static method of [<code>png</code>](#module_png)  

| Param | Type | Description |
| --- | --- | --- |
| doc_id | <code>string</code> | Document of the layers |
| layers | <code>Array.&lt;Object&gt;</code> | Array of layers |
| stream | <code>stream</code> | Writable stream |
| [bounds] | <code>Object</code> | Bounds to use for export if not layer bounds |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_file"></a>

## file

* [file](#module_file)
    * [.fileSanitizeName(path)](#module_file.fileSanitizeName) ⇒ <code>string</code>
    * [.fileParseRelativePath(path, root_path)](#module_file.fileParseRelativePath) ⇒ <code>string</code>
    * [.fileSanitizePath(path, trailing_slash)](#module_file.fileSanitizePath) ⇒ <code>string</code>
    * [.fileGetName(path)](#module_file.fileGetName) ⇒ <code>string</code>
    * [.fileGetExtension(path)](#module_file.fileGetExtension) ⇒ <code>string</code>
    * [.fileGetPath(path)](#module_file.fileGetPath) ⇒ <code>string</code>
    * [.fileLoadJson(path)](#module_file.fileLoadJson) ⇒ <code>Object</code>
    * [.fileLoad(path)](#module_file.fileLoad) ⇒ <code>string</code>
    * [.fileSaveJson(path, data, pretty_print)](#module_file.fileSaveJson)
    * [.fileGetReadStream(path)](#module_file.fileGetReadStream) ⇒ <code>stream</code>
    * [.fileGetWriteStream(path)](#module_file.fileGetWriteStream) ⇒ <code>stream</code>
    * [.fileSaveZip(file_entries, path, [callback], [error])](#module_file.fileSaveZip)
    * [.fileStreamZip(file_entries, stream, [callback], [error])](#module_file.fileStreamZip)
    * [.fileSave(path, data)](#module_file.fileSave) ⇒ <code>bool</code>
    * [.fileMove(old_path, new_path)](#module_file.fileMove) ⇒ <code>bool</code>
    * [.fileCopy(old_path, new_path)](#module_file.fileCopy) ⇒ <code>bool</code>
    * [.fileDelete(path)](#module_file.fileDelete) ⇒ <code>bool</code>
    * [.filesDeleteWithPrefix(path, prefix)](#module_file.filesDeleteWithPrefix)
    * [.fileGetInfo(path)](#module_file.fileGetInfo)
    * [.fileGetSize(path)](#module_file.fileGetSize)
    * [.fileExists(path)](#module_file.fileExists) ⇒ <code>bool</code>

<a name="module_file.fileSanitizeName"></a>

### file.fileSanitizeName(path) ⇒ <code>string</code>
Get just the name of the file without the path or extension

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path of the file |

<a name="module_file.fileParseRelativePath"></a>

### file.fileParseRelativePath(path, root_path) ⇒ <code>string</code>
Turn an absolute path to a relative path with respect to a root folder

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |
| root_path | <code>string</code> | Root of the relative path |

<a name="module_file.fileSanitizePath"></a>

### file.fileSanitizePath(path, trailing_slash) ⇒ <code>string</code>
Sanitize a path to forward slashes and optionally to a trailing slash

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |
| trailing_slash | <code>bool</code> | Whether path should end to a trailing slash |

<a name="module_file.fileGetName"></a>

### file.fileGetName(path) ⇒ <code>string</code>
Get the file name part of a path

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileGetExtension"></a>

### file.fileGetExtension(path) ⇒ <code>string</code>
Get the file extension of a path

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileGetPath"></a>

### file.fileGetPath(path) ⇒ <code>string</code>
Get directory part of the path

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileLoadJson"></a>

### file.fileLoadJson(path) ⇒ <code>Object</code>
Load and decode a JSON-file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileLoad"></a>

### file.fileLoad(path) ⇒ <code>string</code>
Load a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileSaveJson"></a>

### file.fileSaveJson(path, data, pretty_print)
Encode an object as JSON and save it to a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |
| data | <code>Object</code> | Object to save |
| pretty_print | <code>bool</code> | Format JSON as human readable |

<a name="module_file.fileGetReadStream"></a>

### file.fileGetReadStream(path) ⇒ <code>stream</code>
Create a readable stream to a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileGetWriteStream"></a>

### file.fileGetWriteStream(path) ⇒ <code>stream</code>
Create a writable stream to a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileSaveZip"></a>

### file.fileSaveZip(file_entries, path, [callback], [error])
Save files to a ZIP-archive in a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| file_entries | <code>Array.&lt;string&gt;</code> | Array of file paths |
| path | <code>string</code> | Path to the file |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_file.fileStreamZip"></a>

### file.fileStreamZip(file_entries, stream, [callback], [error])
Save files to a ZIP-archive and write to a stream

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| file_entries | <code>Array.&lt;string&gt;</code> | Array of file paths |
| stream | <code>Object</code> | Writable stream |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_file.fileSave"></a>

### file.fileSave(path, data) ⇒ <code>bool</code>
Save content to a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |
| data | <code>string</code> | Data to save |

<a name="module_file.fileMove"></a>

### file.fileMove(old_path, new_path) ⇒ <code>bool</code>
Move a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| old_path | <code>string</code> | Old path to the file |
| new_path | <code>string</code> | New path to the file |

<a name="module_file.fileCopy"></a>

### file.fileCopy(old_path, new_path) ⇒ <code>bool</code>
Copy a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| old_path | <code>string</code> | Old path to the file |
| new_path | <code>string</code> | New path to the file |

<a name="module_file.fileDelete"></a>

### file.fileDelete(path) ⇒ <code>bool</code>
Delete a file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.filesDeleteWithPrefix"></a>

### file.filesDeleteWithPrefix(path, prefix)
Delete all files in a directory with given preix

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the directory |
| prefix | <code>string</code> | Prefix of files to delete |

<a name="module_file.fileGetInfo"></a>

### file.fileGetInfo(path)
Get Node-style file info object

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileGetSize"></a>

### file.fileGetSize(path)
Get size of the file

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_file.fileExists"></a>

### file.fileExists(path) ⇒ <code>bool</code>
Does the file exist

**Kind**: static method of [<code>file</code>](#module_file)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the file |

<a name="module_directory"></a>

## directory

* [directory](#module_directory)
    * [.directoryGetFiles(path)](#module_directory.directoryGetFiles) ⇒ <code>Array.&lt;string&gt;</code>
    * [.directoryCreatePath(path)](#module_directory.directoryCreatePath) ⇒ <code>bool</code>

<a name="module_directory.directoryGetFiles"></a>

### directory.directoryGetFiles(path) ⇒ <code>Array.&lt;string&gt;</code>
Get files in a directory

**Kind**: static method of [<code>directory</code>](#module_directory)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of filenames  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Directory path |

<a name="module_directory.directoryCreatePath"></a>

### directory.directoryCreatePath(path) ⇒ <code>bool</code>
Create a directory path (including multiple subdirectories)

**Kind**: static method of [<code>directory</code>](#module_directory)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Directory path |

<a name="module_http"></a>

## http

* [http](#module_http)
    * [.httpRequest(url, [method], [headers], [body], [callback], [error])](#module_http.httpRequest)
    * [.httpRequestStream(url, [method], [headers], [body], [callback], [error])](#module_http.httpRequestStream)

<a name="module_http.httpRequest"></a>

### http.httpRequest(url, [method], [headers], [body], [callback], [error])
Execute a HTTP request

**Kind**: static method of [<code>http</code>](#module_http)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Request URL |
| [method] | <code>string</code> | HTTP method |
| [headers] | <code>Object</code> | Request headers |
| [body] | <code>string</code> | Request body |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_http.httpRequestStream"></a>

### http.httpRequestStream(url, [method], [headers], [body], [callback], [error])
Create a HTTP request stream to write the body on

**Kind**: static method of [<code>http</code>](#module_http)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Request URL |
| [method] | <code>string</code> | HTTP method |
| [headers] | <code>Object</code> | Request headers |
| [body] | <code>string</code> | Request body |
| [callback] | <code>function</code> | Callback for the result |
| [error] | <code>function</code> | Callback for an error |

<a name="module_util"></a>

## util

* [util](#module_util)
    * [.utilCrc32(data)](#module_util.utilCrc32) ⇒ <code>string</code>
    * [.utilMd5(data)](#module_util.utilMd5) ⇒ <code>string</code>
    * [.utilRandomId()](#module_util.utilRandomId) ⇒ <code>string</code>

<a name="module_util.utilCrc32"></a>

### util.utilCrc32(data) ⇒ <code>string</code>
Calculate CRC32 of a data

**Kind**: static method of [<code>util</code>](#module_util)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Calculated data |

<a name="module_util.utilMd5"></a>

### util.utilMd5(data) ⇒ <code>string</code>
Calculate MD5 of a data

**Kind**: static method of [<code>util</code>](#module_util)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Calculated data |

<a name="module_util.utilRandomId"></a>

### util.utilRandomId() ⇒ <code>string</code>
Generate a random id string

**Kind**: static method of [<code>util</code>](#module_util)  
<a name="module_log"></a>

## log

* [log](#module_log)
    * [.logDebug(title, message)](#module_log.logDebug)
    * [.logInfo(title, message)](#module_log.logInfo)
    * [.logWarning(title, message)](#module_log.logWarning)
    * [.logError(title, message)](#module_log.logError)
    * [.logGetErrors()](#module_log.logGetErrors) ⇒ <code>Array.&lt;string&gt;</code>

<a name="module_log.logDebug"></a>

### log.logDebug(title, message)
Log a debug message

**Kind**: static method of [<code>log</code>](#module_log)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Log title |
| message | <code>string</code> | Log message |

<a name="module_log.logInfo"></a>

### log.logInfo(title, message)
Log an info message

**Kind**: static method of [<code>log</code>](#module_log)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Log title |
| message | <code>string</code> | Log message |

<a name="module_log.logWarning"></a>

### log.logWarning(title, message)
Log a warning message

**Kind**: static method of [<code>log</code>](#module_log)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Log title |
| message | <code>string</code> | Log message |

<a name="module_log.logError"></a>

### log.logError(title, message)
Log an error message

**Kind**: static method of [<code>log</code>](#module_log)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Log title |
| message | <code>string</code> | Log message |

<a name="module_log.logGetErrors"></a>

### log.logGetErrors() ⇒ <code>Array.&lt;string&gt;</code>
Get all logged errors

**Kind**: static method of [<code>log</code>](#module_log)  
<a name="module_json"></a>

## json

* [json](#module_json)
    * [.jsonEncode(obj_data, [pretty_print], [hide_prefix])](#module_json.jsonEncode) ⇒ <code>string</code>
    * [.jsonDecode(json_data)](#module_json.jsonDecode) ⇒ <code>Object</code>

<a name="module_json.jsonEncode"></a>

### json.jsonEncode(obj_data, [pretty_print], [hide_prefix]) ⇒ <code>string</code>
Encode an object as JSON

**Kind**: static method of [<code>json</code>](#module_json)  

| Param | Type | Description |
| --- | --- | --- |
| obj_data | <code>Object</code> |  |
| [pretty_print] | <code>bool</code> | Human readable JSON formatting |
| [hide_prefix] | <code>Object</code> | Hide all property names starting with prefix |

<a name="module_json.jsonDecode"></a>

### json.jsonDecode(json_data) ⇒ <code>Object</code>
Decode an object as JSON

**Kind**: static method of [<code>json</code>](#module_json)  

| Param | Type | Description |
| --- | --- | --- |
| json_data | <code>string</code> | JSON data |

<a name="Generator"></a>

## Generator : <code>object</code>
photoshop-generator-core module for Photoshop generator plugins

**Kind**: global namespace  
