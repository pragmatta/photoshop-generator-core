"use strict";

/**
  * photoshop-generator-core module for Photoshop generator plugins
  * @namespace
  */
var Generator = {
    MODULE_ID: "Generator",
    LAYER_TYPES: { group: "layerSection", text: "textLayer", art: "layer", document: "document", shape: "shapeLayer" },
    _PLUGIN_ID: "PHOTOSHOP_GENERATOR_CORE",

    _serverPort: 0,
    _preferences: {},
    _errors: [],
    _progress: {},
    _progressCallbacks: {},

    _documents: {},
    _layerDataIndex: {},
    _layerOrderIndex: {},
    _layerUrlIndex: {},
    _layerSettingsData: {},
    _selectedLayer: {},
    _documentUpdatePending: {},
    _serverHandlers: {},
    _serverRequestBody: "",

    _photoshopEventHandlers: {
        Asrt: "_onAssertFail", 
        closedDocument: "_onDocumentClose", 
        generatorDocActivated: "_onDocumentActivate", 
        currentDocumentChanged: "_onDocumentSelect", 
        generatorMenuChanged: "_onMenuChange", 
        imageChanged: "_onDocumentChange", 
        idle: "_onIdle", 
        toolChanged: "_onToolChange"
    },

    _handlePhotoshopEvent: function(event, data) {
        var handler = Generator._eventHandlers[event]
        if (handler) {
            handler(data)
        }
    },
    _onMenuChange: function (data) { 
        Generator._handlePhotoshopEvent("onMenuChange", data) 
    },
    _onToolChange: function (data){ 
        Generator._handlePhotoshopEvent("onToolChange", data) 
    },
    _onAssertFail: function (data) { 
        Generator._handlePhotoshopEvent("onAssertFail", data) 
    },
    _onDocumentClose: function (data) { 
        if (data) {
            data = data.toString()
            Generator.logDebug("_onDocumentClose", "data=" + data)
            var doc = Generator.documentGetById(data)
            if (doc) {
                Generator._deleteLayerData(doc, true)
                delete Generator._documents[data]
                Generator._handlePhotoshopEvent("onDocumentClose", data) 
            }
        }
    },
    _onDocumentActivate: function (data) { 
        Generator.logDebug("_onDocumentActivate", "data=" + Generator.jsonEncode(data, true, "_"))
        Generator._handlePhotoshopEvent("onDocumentActivate", data) 
    },
    _onDocumentSelect: function (doc_id) {
        // Generator.logDebug("_onDocumentSelect", "selected_doc="+doc_id)
        if (doc_id) {
            doc_id = doc_id.toString()
            if (Generator._selectedDocument != doc_id) {
                var doc = Generator.documentGetById(doc_id)
                if (doc) { // this really should not happen unless last document closed, but just in case we're out of sync
                    // Generator.logDebug("_onDocumentSelect", "selected_doc="+(Generator._selectedDocument||"")+", new_doc="+doc_id)
                    Generator._selectedDocument = doc_id
                    Generator._selectedDocumentPending = null
                    Generator._handlePhotoshopEvent("onDocumentSelect", doc_id)
                } else {
                    Generator.logDebug("_onDocumentSelect", "missing doc="+doc_id)
                    Generator._selectedDocumentPending = doc_id
                    Generator.documentUpdate(doc_id)
                    // Generator.photoshopGetOpenDocuments(Generator._parseOpenDocuments) // new, doc let's get data first and then this triggers
                }
            }
        }
    },
    _onDocumentUpdate: function(data) { 
        Generator._handlePhotoshopEvent("onDocumentUpdate", data) 
    },
    _onDocumentChange: function (data) { 
        Generator._parseDocumentChanges(data)
    },
    _onSelectionChange: function (doc_id, selection) {
        if (doc_id) {
            // Generator.logDebug("_onSelectionChange", "doc="+doc_id+", selection="+selection)
            var previous_selection = Generator._selectedLayer[doc_id]
            if (selection && selection.length === 1) {
                Generator._selectedLayer[doc_id] = selection[0]
            } else {
                Generator._selectedLayer[doc_id] = null
            }
            if (Generator._selectedLayer[doc_id] != previous_selection) {
                Generator._handlePhotoshopEvent("onSelectionChange", Generator._selectedLayer[doc_id]) 
                // Generator.logDebug("_onSelectionChange", "doc="+doc_id+", selection="+Generator._selectedLayer[doc_id])
            }
            // Generator.logDebug("_onSelectionChange", "doc="+doc_id+", selected_doc="+Generator._selectedDocument+", new_selected="+Generator._selectedLayer[doc_id])
        }
    },
    _onIdle: function (data) { 
        Generator._handlePhotoshopEvent("onIdle", data) 
    },
    _setPluginId: function (plugin_id) {        
        Generator._pluginid = (plugin_id || Generator._PLUGIN_ID).replace(/\-\\\/\w\./g, "_")
        Generator.logDebug("_setPluginId", "plugin_id="+plugin_id)
        Generator._plugindatadirectory = Generator.systemGetAppdataDirectory() + "photoshop-generator-core/" + Generator._pluginid + "/" 
        Generator.logDebug("_setPluginId", "_plugindatadirectory="+Generator._plugindatadirectory)
        Generator._preferencefile = Generator._plugindatadirectory+"preferences.v"+(Generator._packageversion[0] || "0")+".json"
        // Generator.logDebug("_setPluginId", "_preferencefile="+Generator._preferencefile)
        Generator.directoryCreatePath(Generator._plugindatadirectory)
        Generator.pluginLoadPreferences()
    },
    /**
     * @module plugin
     */
    /**
     * Initialize Photoshop Generator connection
     *
     * @memberof module:plugin
     */
    pluginInitialize: function (generator_instance, generator_config, app_id, server_port) {
		if (generator_instance) {
            Generator.logDebug("_initialize", "")        

            Generator._package = require('./package.json')
            Generator._os = require("os")
            Generator._url = require("url")
            Generator._http = require("http")
            Generator._https = require("https")
            Generator._https.globalAgent.options.secureProtocol = "TLSv1_method" //'SSLv3_method';
            Generator._cryptography = require("crypto")
            Generator._processes = require('child_process')

            Generator._filesystem = require("fs-extra")
            Generator._archiver = require("archiver")
            Generator._crc = require("js-crc").crc32
            Generator._png = require('pngjs').PNG
            Generator._gif = require('gif-encoder')

            Generator._instance = generator_instance
            Generator._config = generator_config
            Generator._sessionid = Generator.utilRandomId()
            Generator._packageversion = Generator._package.version.split('.')

            Generator._setPluginId(app_id)
            Generator._setServerPrimaryPort(server_port)
		}
    },
    /**
     * Start Photoshop event listening
     *
     * @memberof module:plugin
     */
    pluginStart: function () {
        for (var event_id in Generator._photoshopEventHandlers) {
            Generator._instance.addPhotoshopEventListener(event_id, Generator[Generator._photoshopEventHandlers[event_id]])    
        }
        Generator.photoshopGetOpenDocuments(Generator._parseOpenDocuments)
    },
    /**
     * Pause Photoshop event listening
     *
     * @memberof module:plugin
     */
    pluginPause: function () {
        for (var event_id in Generator._photoshopEventHandlers) {
            Generator._instance.removePhotoshopEventListener(event_id, Generator[Generator._photoshopEventHandlers[event_id]])    
        }
    },
    /**
     * Generate a timestamp
     * @return {number}
     *
     * @memberof module:plugin
     */
    pluginGetTimestamp: function() {
        if (!Generator._initTimeStamp) {
            Generator._initTimeStamp = new Date().getTime()
            return 0
        } else {
            return ((new Date().getTime()) - Generator._initTimeStamp)/1000
        }
    },
    /**
     * Get a plugin preference value for a key
     * @param {string} key Key of the preference
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginGetPreference: function (key) {
        if (key) {
            return Generator._preferences[key]
        }
    },
    /**
     * Set a plugin preference value for a key
     * @param {string} key Key of the preference
     * @param {string} value Value of the preference
     * @param {bool} save Whether to save preferences
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginSetPreference: function (key, value, save) {
        if (key) {
            if (value) {
                Generator._preferences[key] = value
            } else {
                delete Generator._preferences[key]
            }
            if (save) {
                Generator.pluginSavePreferences()
            }
        }
    },
    /**
     * Save plugin preferences
     *
     * @memberof module:plugin
     */    
    pluginSavePreferences: function () {
        Generator.fileSaveJson(Generator._preferencefile, Generator._preferences, true)
    },
    /**
     * Load plugin preferences
     *
     * @memberof module:plugin
     */
    pluginLoadPreferences: function () {
        Generator._preferences = Generator.fileLoadJson(Generator._preferencefile) || {}
    },
    /**
     * Get session id
     *
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginGetSessionId: function () {
        return Generator._sessionid
    },
    /**
     * Get the plugin folder path
     *
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginGetHomeDirectory: function () {
        if (!Generator._plugindirectory) {
            Generator._plugindirectory = Generator.fileSanitizePath(__dirname, true)
        }
        return Generator._plugindirectory
    },
    /**
     * Get the plugin data folder path
     *
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginGetDataDirectory: function () {
        return Generator._plugindatadirectory
    },
    /**
     * Setup a plugin menu item in File -> Generate
     * @param {string} menu_id Id of the menu item
     * @param {string} menu_label Title of the menu item
     *
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginSetupMenuItem: function(menu_id, menu_label) {
        Generator._instance.addMenuItem(menu_id, menu_label, true, false).then(
            function () {
                // Generator.logDebug("Menu created", menu_id);
            }, function () {
                console.error("Menu creation failed", menu_id);
            })
    },
    /**
     * Update the menu state of a menu item
     * @param {string} menu_id Id of the menu item
     * @param {bool} menu_enabled Turn menu selection on/off
     *
     * @return {string}
     *
     * @memberof module:plugin
     */
    pluginUpdateMenuState: function (menu_id, menu_enabled) {
        //Generator.logDebug("Setting menu state to", menu_enabled)
        Generator._instance.toggleMenu(menu_id, true, menu_enabled)
    },
    _eventHandlers: {},
    /**
     * Set a callback for one of the events: onDocumentActivate, onDocumentSelect, onDocumentUpdate, onSelectionChange, onDocumentChange, onMenuChange, onToolChange, onAssertFail.
     * @param {string} event Id of the event
     * @param {function} callback Handler of the event
     *
     * @memberof module:plugin
     */
    pluginSetEventHandler: function(event, callback) {
        if (event) {
            Generator._eventHandlers[event] = callback
        }
    },
    pluginSetProgressCallback: function (task, callback){
        if (task) {
            Generator._progressCallbacks[task] = callback
            // Generator.logDebug("pluginSetProgressCallback", "task="+task+", null_callback="+(!Generator._progressCallback))
        }
    },
    pluginSetProgress: function (task, progress){
        if (task) {
            if (progress != Generator._progress[task]) {
                if (progress) {
                    Generator._progress[task] = progress
                } else {
                    delete Generator._progress[task]
                }
                var callback = Generator._progressCallbacks[task]
                if (callback) {
                    // Generator.logDebug("pluginSetProgress", "invoke callback for task="+task+",  progress="+progress)
                    callback(progress)
                }
            }
        }
    },    
    pluginGetProgress: function (task){
        if (task) {
            return Generator._progress[task]
        }
    },    
    _initializeServerWithPort: function (server, port) {
        // Generator.logDebug("_serverCreate", "port="+port)
        if (!server) {
            server = Generator._http.createServer()
            server.on('request', function (req, res) {
                Generator._serverRequestBody = [];
                req.on('data', function (data) {
                    Generator._serverRequestBody.push(data);
                    // Generator.logDebug("server @ data", "new data="+data)
                });
                req.on('end', function () {
                    Generator._serverRequestBody = Buffer.concat(Generator._serverRequestBody).toString();
                    // Generator.logDebug("server @ end", "data="+Generator._serverRequestBody)
                    Generator._onServerRequest(req, res)
                });
            });
        }
        if (server.listening) {
            server.close(function () { server.listen(port) })
        } else {
            server.listen(port)
        }
        return server
    },
    /**
     * @module server
     */
    _setServerPrimaryPort: function (port) {
        if (port && typeof port == "number" && port >= 1 && port < 65536 && port != Generator._serverPort) {
            Generator.logDebug("_setServerPrimaryPort", "new port="+port)
            Generator._serverPort = port
            Generator._server = Generator._initializeServerWithPort(Generator._server, Generator._serverPort)
        }
    },
    /**
     * Get primary server port
     * @memberof module:server
     *
     * @return {number}
     *
     * @memberof module:server
     */
    serverGetPrimaryPort: function () {
        return Generator._serverPort
    },
    /**
     * Set secondary server port
     * @param {number} port Server port
     *
     * @memberof module:server
     */
    serverSetSecondaryPort: function (port) {
        if (port && typeof port == "number" && port >= 1 && port < 65536 && port != Generator._serverCustomPort && port != Generator._serverPort) {
            Generator.logDebug("serverSetSecondaryPort", "new port="+port)
            Generator._serverCustomPort = port
            Generator._serverCustom = Generator._initializeServerWithPort(Generator._serverCustom, Generator._serverCustomPort)
        }
    },
    /**
     * Get secondary server port
     * @return {number}
     *
     * @memberof module:server
     */
    serverGetSecondaryPort: function () {
        return Generator._serverCustomPort
    },
    /**
     * Set server handler for a service
     * @param {string} service Name of the service
     * @param {function} callback Handler of the service
     *
     * @memberof module:server
     */
    serverSetRequestHandler: function (service, handler) {
        if (service || service === "") {
            Generator._serverHandlers[service] = handler
        }
    },
    /**
     * Set a method for validating incoming requests (e.g. only allow local requests)
     * @param {function} callback Validator of the incoming HTTP requests
     *
     * @memberof module:server
     */
    serverSetRequestValidator: function (validator) {
        Generator._serverValidator = validator
    },
    _onServerRequest: function (request, response) {
        var start = Generator.pluginGetTimestamp()
        var url = Generator._url.parse(request.url, true, true)
        var params = url.query
        var request_path = url.pathname.split('/');
        if (url.pathname[0]=='/')
            request_path.shift();
        // Generator.logDebug("_onServerRequest", "path=" + url.pathname + ", path_parts=" +request_path )

        response.setHeader("Access-Control-Allow-Origin", "*") // needed for browser debugging
        if (Generator._serverValidator && !Generator._serverValidator(request)) {
            response.writeHead(403, 'Invalid request', {'Content-Type': 'text/plain'})
            response.end()
            Generator.logDebug("_onServerRequest", "invalid request, url="+request.url)            

        } else if (params.sessionid && params.sessionid != Generator._sessionid) {
            response.writeHead(403, 'Invalid session, reconnect', {'Content-Type': 'text/plain'})
            response.end()
            Generator.logDebug("_onServerRequest", "invalid session, id="+Generator._sessionid+", parameter="+params.sessionid)

        } else {
            var handler = Generator._serverHandlers[request_path[0]]
            if (handler) {
                var result = handler(request_path, params, Generator._serverRequestBody, request, response)
                if (result != null) { // null response means async operation and handler will write the response
                    response.statusCode = 200
                    if (typeof(result) == "object") {
                        result = Generator.jsonEncode(result, true)
                    }
                    response.end(result)
                } else {
                    // handler needs to write response and end it
                }
            } else {
                response.writeHead(404, 'File not found', {'Content-Type': 'text/plain'})
                response.end()
            }            
        }
        // Generator.logDebug("_onServerRequest", "operation=" + Generator.jsonEncode(operation)+", result="+result+", duration=" + (Generator.pluginGetTimestamp()-start)+" sec")
    },      
    /**
     * @module system
     */
    /**
     * Whether system is Windows
     * @return {bool}
     *
     * @memberof module:system
     */
    systemIsWindows: function() {
        return Generator._os.platform() == "win32"
    },
    /**
     * Whether system is MacOS
     * @return {bool}
     *
     * @memberof module:system
     */
    systemIsMac: function() {
        return Generator._os.platform() == "darwin"
    },
    /**
     * Whether system is Windows
     * @param {string} path Directory of the installer
     * @param {string} package_file Name of the installer file
     *
     * @memberof module:system
     */
    systemExecuteInstaller: function (path, package_file){
        if (package_file) {
            Generator.logDebug("systemExecuteInstaller", "package_file="+package_file+" at path="+path)
            if (Generator.systemIsWindows()) {
                Generator._processes.spawn(package_file, {cwd: path})
            } else if (Generator.systemIsMac()) {
                Generator._processes.exec("open "+package_file, {cwd: path})
            }
        }
    },
    /**
     * Get and environment value
     * @param {string} variable Name of the variable
     *
     * @return {string}
     *
     * @memberof module:system
     */
    systemGetEnvironmentVariable: function (variable) {
        if (variable) {
            return process.env[variable]
        }
    },
    _systemGetDirectory: function (env_variable) {
        return Generator.fileSanitizePath(Generator.systemGetEnvironmentVariable(env_variable), true)
    },
    /**
     * Get the system document folder path
     *
     * @return {string}
     *
     * @memberof module:system
     */
    systemGetDocumentsDirectory: function () {
        if (!Generator._documentsdirectory) {
            if (Generator.systemIsWindows()) {
                Generator._documentsdirectory = Generator.systemGetUserDirectory()+"Documents/"
                if (!Generator.fileExists(Generator._documentsdirectory)) { // small chance that user has something non-standard -> default to home dir
                    Generator.logDebug("systemGetDocumentsDirectory", "No 'Documents' in user directory="+Generator._documentsdirectory)
                    Generator._documentsdirectory = Generator.systemGetUserDirectory()
                }
            } else if (Generator.systemIsMac()) {
                Generator._documentsdirectory = Generator.systemGetUserDirectory()+"Documents/"
            }
            Generator.logDebug("systemGetDocumentsDirectory", "path="+Generator._documentsdirectory)
        }
        return Generator._documentsdirectory
    },
    /**
     * Get the system user folder path
     *
     * @return {string}
     *
     * @memberof module:system
     */
    systemGetUserDirectory: function () {
        if (!Generator._userdirectory) {
            Generator._userdirectory = Generator._systemGetDirectory('USERPROFILE') || Generator._systemGetDirectory('HOME')
        }
        return Generator._userdirectory
    },
    /**
     * Get the system application data folder path
     *
     * @return {string}
     *
     * @memberof module:system
     */
    systemGetAppdataDirectory: function () {
        if (!Generator._appdatadirectory) {
            if (Generator.systemIsWindows()) {
                Generator._appdatadirectory = Generator._systemGetDirectory('LOCALAPPDATA')
            } else {
                Generator._appdatadirectory = Generator.systemGetUserDirectory()+"Library/Application Support/"                
            }
        }
		return Generator._appdatadirectory
	},
    /**
     * Get the system temporary folder path
     *
     * @return {string}
     *
     * @memberof module:system
     */
    systemGetTemporaryDirectory: function () {
        if (!Generator._tmpdirectory) {
            Generator._tmpdirectory = Generator._systemGetDirectory('TMPDIR') || Generator._systemGetDirectory('TMP') 
        }
        return Generator._tmpdirectory
    },
    /**
     * @module layer
     */
    layerCalculateUid: function (doc_id, layer_id) {
		if (doc_id == null)
			return ""
		else if (layer_id == null)
			return "document:"+doc_id
		else
			return "layer:"+doc_id+":"+layer_id
    },
    /**
     * Get the layer preferences for this plugin
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetPreferences: function (layer) {
        if (layer) {
            // Generator.logDebug("layerGetPreferences", "id="+layer.id)
            return layer._settings
        }
    },
    /**
     * Set the layer preferences for this plugin
     * @param {Object} layer Layer-object
     * @param {Object} preferences Preferences-object
     *
     * @memberof module:layer
     */
    layerSetPreferences: function (layer, preferences) {
        Generator._layerSetPluginSettings(layer, preferences, Generator._pluginid)
    },
    /**
     * Get the layer width
     * @param {Object} layer Layer-object
     *
     * @return {number}
     *
     * @memberof module:layer
     */
    layerGetWidth: function (layer) {
        var bounds = Generator.layerGetBounds(layer)
        return bounds.right - bounds.left
    },
    /**
     * Get the layer height
     * @param {Object} layer Layer-object
     *
     * @return {number}
     *
     * @memberof module:layer
     */
    layerGetHeight: function (layer) {
        var bounds = Generator.layerGetBounds(layer)
        return bounds.bottom - bounds.top
    },
    /**
     * Get the bounds of the container (document or artboard) of the layer
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetContainerBounds: function (layer) {
        while (layer) {
            if (Generator.layerIsArtboard(layer)) {
                return layer.artboard.artboardRect

            } else if (Generator.layerIsDocument(layer)) {
                return Generator.layerGetBounds(layer)

            } else {
                layer = layer._parent
            }
        }
    },
    _calculateTextBoxBounds: function (layer) {
        var document_bounds = Generator.layerGetBounds(layer._document)
        var text_element = layer.text
        var click_point = text_element.textClickPoint
        var result = {}
        result.left = Math.round((document_bounds.right-document_bounds.left)*click_point.horizontal.value/100)
        result.top = Math.round((document_bounds.bottom-document_bounds.top)*click_point.vertical.value/100)
        var x_scale = 1, y_scale = 1
        if (text_element.transform) {
            x_scale = text_element.transform.xx || 1
            y_scale = text_element.transform.yy || 1
        }
        result.right = result.left + Math.round(text_element.bounds.right*x_scale)
        result.bottom = result.top + Math.round(text_element.bounds.bottom*y_scale)
        // Generator.logDebug("_calculateTextBoxBounds", "paragraph text="+Generator.jsonEncode(text_element, true))
        // Generator.logDebug("_calculateTextBoxBounds", "paragraph text bounds: top="+result.top+", left="+result.left+", bottom="+result.bottom+", right="+result.right)
        return result
    },
    /**
     * Get the container (document or artboard) of the layer
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetContainer: function (layer) {
        while (layer) {
            if (Generator.layerIsArtboard(layer) || Generator.layerIsDocument(layer)) {
                return layer
            } else {
                layer = layer._parent
            }
        }
    },
    /**
     * Get the bounds of the layer
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetBounds: function (layer) {
        if (layer) {
            if (Generator.layerIsMasked(layer)) { // TODO: it's a bit unreliable and needs work, just use the pixel bounds until a better method arrives..
                return layer.mask.bounds
            // } else if (false && Generator.layerIsParagraphText(layer)) { // TODO: it's a bit unreliable and needs work, just use the pixel bounds until a better method arrives..
            //     return Generator._calculateTextBoxBounds(layer)
            } else {
                return layer.boundsWithFX || layer.bounds
            }
        }
    },
    /**
     * Calculate union of two bounds
     * @param {Object} bounds_a first bounds
     * @param {Object} bounds_b second bounds
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerBoundsUnion: function (bounds_a, bounds_b) {
        // Generator.logDebug("layerBoundsUnion", "bounds_a="+Generator.jsonEncode(bounds_a, true)+", bounds_b="+Generator.jsonEncode(bounds_b, true))
        if (bounds_a && bounds_b) {
            var result = {
                left: Math.min(bounds_a.left, bounds_b.left),
                top: Math.min(bounds_a.top, bounds_b.top),
                right: Math.max(bounds_a.right, bounds_b.right),
                bottom: Math.max(bounds_a.bottom, bounds_b.bottom),
            }
            // Generator.logDebug("layerBoundsUnion", "union bounds: top="+result.top+", left="+result.left+", bottom="+result.bottom+", right="+result.right)
            return result
        }
        return bounds_a || bounds_b // if we had either, that's the result
    },
    /**
     * Calculate intersection of two bounds
     * @param {Object} bounds_a first bounds
     * @param {Object} bounds_b second bounds
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerBoundsIntersection: function (bounds_a, bounds_b) {
        if (bounds_a && bounds_b) {
            var result = {
                left: Math.max(bounds_a.left, bounds_b.left),
                top: Math.max(bounds_a.top, bounds_b.top),
                right: Math.min(bounds_a.right, bounds_b.right),
                bottom: Math.min(bounds_a.bottom, bounds_b.bottom),
            }
            Generator.logDebug("layerBoundsUnion", "union bounds: top="+result.top+", left="+result.left+", bottom="+result.bottom+", right="+result.right)
            return result
        }
        return bounds_a || bounds_b // if we had either, that's the result
    },
    /**
     * Get the layer extents with x, y, w, h in relation to container bounds and origo in bottom left
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetExtents: function (layer) {
        if (Generator.layerIsArtboard(layer)) {
            var artboard_rect = layer.artboard.artboardRect
            return {x:0, y:0, width: artboard_rect.right-artboard_rect.left, height:artboard_rect.bottom-artboard_rect.top}
        } else {
            var bounds = Generator.layerGetBounds(layer)
            var container = Generator.layerGetContainerBounds(layer)
            var x = bounds.left - container.left
            var y = bounds.bottom  - container.top
            var w = bounds.right - bounds.left
            var h = bounds.bottom - bounds.top
            // Generator.logDebug("getLayerExtents", "id="+layer.id+", bounds="+Generator.jsonEncode(bounds)+", container="+Generator.jsonEncode(container))
            // Generator.logDebug("getLayerExtents", "x="+x+", y="+y+", w="+w+", h="+h+", container_h="+(container.bottom-container.top) )
            return {x: x, y: container.bottom-container.top - y, width: w, height: h}
        }
    },
    _layerGetPluginSettings: function (layer_data, plugin_id) {
        if (layer_data && plugin_id) {
            var settings_data = layer_data.generatorSettings
            if (settings_data) {
                // Generator.logDebug("_layerGetPluginSettings", "layer="+layer_data._url+", settings="+Generator.jsonEncode(settings_data, true) )
                var plugin_settings = settings_data[plugin_id]
                if (plugin_settings) {
    				return Generator.jsonDecode(plugin_settings.json)
                }
            }
        }
    },
    _layerSetPluginSettings: function (layer, settings, plugin_id) {
        if (layer && plugin_id && settings) {
            layer._settingsData = JSON.stringify(settings)
            var params = {
                    key: plugin_id,
                    layerId: layer.id,
                    // Serialize the settings because creating the corresponding ActionDescriptor is harder
                    // Wrap the resulting string as { json: ... } because Photoshop needs an object here
                    settings: { json: layer._settingsData }
                }
            Generator.logDebug("_layerSetPluginSettings", "params="+Generator.jsonEncode(params, true) )
            return Generator._instance.evaluateJSXFile("./jsx/setGeneratorSettings.jsx", params)
        }
    },
    _getLayerTextContent: function (layer) {
        if (Generator.layerIsText(layer)) {
            return layer.text.textKey
        }
    },
    // formatting matches what PS will return
    _fontStyles: { regular: "regular", italic: "italic", light: "light", bold: "bold", lightitalic: "lightitalic", bolditalic: "bolditalic", thin: "light", medium: "regular" },
    _fontAlignments: { left: "left", center: "center", right: "right" },
    _calculateFontStyle: function (text_style) {
        var style = Generator._fontStyles.regular
        if (text_style.fontStyleName) {
            style = Generator._fontStyles[text_style.fontStyleName.toLowerCase().replace(/ /g,'')] || style
        }
        if (text_style.syntheticBold) {
            if (style == Generator._fontStyles.regular) {
                style = Generator._fontStyles.bold
            } else if (style == Generator._fontStyles.light) {
                style = Generator._fontStyles.regular
            }
        }
        if (text_style.syntheticItalic) {
            if (style == Generator._fontStyles.regular) {
                style = Generator._fontStyles.italic
            } else if (style == Generator._fontStyles.light) {
                style = Generator._fontStyles.lightitalic
            } else if (style == Generator._fontStyles.bold) {
                style = Generator._fontStyles.bolditalic
            }
        }
        return style
    },
    /**
     * Get the font information of a text layer
     * @param {Object} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetTextFont: function (layer) {
        if (Generator.layerIsText(layer)) {
            var text_style = layer.text.textStyleRange[0].textStyle // there might be multiple ranges with ".from=0, to=n" but currently we support just one definition per label 
            var paragraph_style = layer.text.paragraphStyleRange[0].paragraphStyle
            Generator.logDebug("_getLayerFillColor: text_style=" +Generator.jsonEncode(text_style, true)+", paragraph_style=" +Generator.jsonEncode(paragraph_style, true))
            return { 
                color: Generator._parseColor(text_style.color), 
                family: text_style.fontName, 
                style: Generator._calculateFontStyle(text_style), 
                size: Math.floor(text_style.size + 0.5 ), 
                text: Generator._getLayerTextContent(layer), 
                alignment: Generator._fontAlignments[paragraph_style.align] || Generator._fontAlignments.center
            }
        }
    },
    /**
     * Get the fill color as a hex string
     * @param {Object} layer Layer-object
     *
     * @return {string}
     *
     * @memberof module:layer
     */
    layerGetFillColor: function (layer) {
        if (Generator.layerIsFill(layer)) {
            // Generator.logDebug("_getLayerFillColor: color=" +Generator.jsonEncode(layer.fill.color, true))
            return Generator._parseColor(layer.fill.color)
        }
    },
    _parseColorComponent: function(c) {
        var hex = Math.floor((c || 0)+0.5).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    _parseColor: function(color) {
        if (color) {
            return "#" + Generator._parseColorComponent(color.red) + Generator._parseColorComponent(color.green) + Generator._parseColorComponent(color.blue);
        } else {
            return "#000000"
        }
    },
    /**
     * Get a layer by index
     * @param {Object} doc_id id of the document of the layer
     * @param {string} layer_index index of the layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetByIndex: function (doc_id, layer_index) {
        if (doc_id && (layer_index || layer_index === 0)) {
            // Generator.logDebug("layerGetByIndex", "index=" + layer_index+", doc_id="+doc_id)
            var doc_index = Generator._layerOrderIndex[doc_id]
            if (doc_index) {
                return doc_index[layer_index]
            }
        }
    },
    /**
     * Get the next layer from the given layer, same layer if the last layer of the document
     * @param {Object} layer reference layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetNextLayer: function (layer) {
        if (layer) {
            var doc_index = Generator._layerOrderIndex[layer._document.id]
            if (doc_index) {
                var layer_index = layer.index+1
                // Generator.logDebug("layerGetNextLayer", "index=" + layer_index)
                while (layer_index < doc_index.length && !doc_index[layer_index]) { // index can have wholes since every group is a virtual layer that is not returned
                    // Generator.logDebug("layerGetNextLayer", "next index=" + layer_index)
                    layer_index++
                }

                if (doc_index[layer_index])
                    return doc_index[layer_index]
                else
                    return layer // if no previous found, original was last
            }
        }
    },
    /**
     * Get the previous layer from the given layer, same layer if the first layer of the document
     * @param {Object} layer reference layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetPreviousLayer: function (layer) {
        if (layer) {
            var doc_index = Generator._layerOrderIndex[layer._document.id]
            if (doc_index) {
                var layer_index = layer.index-1
                // Generator.logDebug("layerGetPreviousLayer", "index=" + layer_index)
                while (layer_index >= 0 && !doc_index[layer_index]) { // index can have wholes since every group is a virtual layer that is not returned
                    // Generator.logDebug("layerGetNextLayer", "next index=" + layer_index)
                    layer_index--
                }

                if (doc_index[layer_index])
                    return doc_index[layer_index]
                else
                    return layer // if no previous found, original was first
            }
        }
    },
    /**
     * Get a layer from a document by id
     * @param {Object} doc_id id of the document of the layer
     * @param {string} layer_id id of the layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetById: function (doc_id, layer_id) {
        if (doc_id == layer_id)
            layer_id = null
        return Generator.layerGetByUid(Generator.layerCalculateUid(doc_id, layer_id))
    },
    /**
     * Get a child layer by the index
     * @param {Object} layer Layer-object
     * @param {number} child_index index of the child
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetChildByIndex: function (layer, child_index) {
        if (layer && (child_index || child_index === 0)) {
            return layer._children[child_index]
        }
    },
    /**
     * Get a layer by the UID
     * @param {string} layer_uid UID of the layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetByUid: function (layer_uid) {
        if (layer_uid) {
            // Generator.logDebug("layerGetByUid", "uid="+layer_uid)
            return Generator._layerDataIndex[layer_uid]
        }
    },
    /**
     * Get a layer by the Url
     * @param {string} layer_url Url of the layer
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetByUrl: function (layer_url) {
        if (layer_url) {
            return Generator._layerUrlIndex[layer_url]
        }
    },
    /**
     * Get a layer ID
     * @param {Object} layer Layer-object
     *
     * @return {string}
     *
     * @memberof module:layer
     */
    layerGetId: function (layer) {
        if (layer) {
            return layer.id
        }
    },
    /**
     * Get a layer UID
     * @param {Object} layer Layer-object
     *
     * @return {string}
     *
     * @memberof module:layer
     */
    layerGetUid: function (layer) {
        if (layer) {
            return layer._uid
        }
    },
    /**
     * Get a layer URL
     * @param {string} layer Layer-object
     *
     * @return {Object}
     *
     * @memberof module:layer
     */
    layerGetUrl: function (layer) {
        if (layer) {
            return layer._url
        }
    },
    /**
     * Layer is an artboard
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsArtboard: function (layer) {
        return layer && !!layer.artboard
    },
    /**
     * Layer is a rectangle without effects
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsBasicRectangle: function (layer) {
        if (layer && Generator.layerIsRectangle(layer)) {
            return !layer.layerEffects
        }
    },
    /**
     * Layer has some content
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsContent: function (layer) {
        return layer && (Generator.layerIsPixels(layer) || Generator.layerIsShape(layer) || Generator.layerIsText(layer) || Generator.layerIsSmartObject(layer))
    },    
    /**
     * Layer is a document
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsDocument: function (layer) {
        return layer && ((layer.type == Generator.LAYER_TYPES.document) || (!layer.type && layer.file && layer.resolution))
    },
    /**
     * Layer is or appears empty (e.g. invisible)
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsEmpty: function (layer) { // TODO: group with properties and no content will not be empty even if that is what we mean
        if (!Generator.layerIsVisible(layer)) {
            return true
        } else if (Generator.layerIsText(layer)) {
            // Generator.logDebug("_isEmpty: text layer " +layer.id+" empty=" + !layer.text.textKey)
            return !layer.text || !layer.text.textKey
        } else {
            var bounds = Generator.layerGetBounds(layer)
            // Generator.logDebug("_isEmpty: layer " +layer.id+" bounds=" + Generator.jsonEncode(bounds))
            return !bounds || (bounds.left == bounds.right) || (bounds.top == bounds.bottom)
        }
       
    },
    /**
     * Layer has a fill
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsFill: function (layer) {
        return layer && !!layer.fill
    },        
    /**
     * Layer is a group
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsGroup: function (layer) {
        return layer && layer.type == Generator.LAYER_TYPES.group
    },
    /**
     * Layer content is contained in given bounds (false if empty)
     * @param {Object} layer Layer-object
     * @param {Object} container_bounds bounds of the container
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsInsideBounds: function (layer, container_bounds) {
        var bounds = Generator.layerGetBounds(layer)
        if (layer && bounds && container_bounds) {
            return bounds.top >= container_bounds.top && bounds.left >= container_bounds.left && bounds.bottom <= container_bounds.bottom && bounds.right <= container_bounds.right
        }        
    },
    /**
     * Layer has a mask
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsMasked: function (layer) {
        return layer.mask && layer.mask.enabled !== false // undefined === 'not disabled'
    },
    /**
     * Layer is a basic art layer (i.e. not a group, artboard or a document)
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsNormal: function (layer) {
        return layer && !Generator.layerIsDocument(layer) && !Generator.layerIsGroup(layer) && !Generator.layerIsArtboard(layer)
    },
    /**
     * Layer is a paragraph text layer 
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsParagraphText: function (layer) {
        // Generator.logDebug("_isParagraphTextLayer: text=" +Generator.jsonEncode(layer.text, true))
        return layer && Generator.layerIsText(layer) && layer.text.textShape[0].char == "box"
    },
    /**
     * Layer has children
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsParent: function (layer) {
        return layer && layer._children && layer._children.length > 0
    },
    /**
     * Layer is pixel data (i.e. not vector)
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsPixels: function (layer) {
        return layer.type == Generator.LAYER_TYPES.art
    },
    /**
     * Layer is a rectangle shape
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsRectangle: function (layer) {
        if (layer && Generator.layerIsShape(layer)) {
            // Generator.logDebug("_isRectangleLayer", Generator.jsonEncode(layer, true, "_"))
            var path_components = layer.path.pathComponents
            if (path_components && path_components.length === 1) {
                return path_components[0].origin.type == "rect"
            }
        }
    },
    /**
     * Layer is a shape
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsShape: function (layer) {
        return layer.type == Generator.LAYER_TYPES.shape
    },
    /**
     * Layer is a smart object
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsSmartObject: function (layer) {
        return layer && !!layer.smartObject
    },        
    /**
     * Layer is a text layer
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsText: function (layer) {
        return layer && layer.type == Generator.LAYER_TYPES.text && layer.text
    },
    /**
     * Layer is visible
     * @param {Object} layer Layer-object
     *
     * @return {bool} 
     *
     * @memberof module:layer
     */
    layerIsVisible: function (layer) {
        return layer.visible === true
    },
    /**
     * @module document
     */
    /**
     * Get the selected layer of a document
     * @param {Object} doc document-object
     * @return {Object} 
     *
     * @memberof module:document
     */
    documentGetActiveLayer: function (doc) {
        if (!doc) {
            doc = Generator.documentGetActive()
        }
        if (doc) {
            // Generator.logDebug("documentGetActiveLayer", "doc=" + doc.id+", selected_layer="+Generator._selectedLayer[doc.id])
            return Generator.layerGetByIndex(doc.id, Generator._selectedLayer[doc.id])
        }
    },
    /**
     * Get document by Id (or Url)
     * @param {Object|string} doc_or_url_or_id document-object or an Url or an id
     *
     * @return {Object}
     *
     * @memberof module:document
     */
    documentGetById: function (doc_or_url_or_id) {
        var result = null
        if (doc_or_url_or_id) {
            var layer = Generator._layerUrlIndex[doc_or_url_or_id]
            if (layer) {
                result = layer._document
            } else {
                result = Generator._documents[doc_or_url_or_id] || Generator._documents[doc_or_url_or_id.id]
            }
        }
        // if (!result) { Generator.logDebug("getDocument ERROR not found: id=" + doc_or_url_or_id) }
        return result
    },
    /**
     * Get all current documents
     *
     * @return {Object[]}
     *
     * @memberof module:document
     */
    documentGetAll: function () {
        return Generator._documents
    },
    /**
     * Get the active document
     *
     * @return {Object}
     *
     * @memberof module:document
     */
    documentGetActive: function () {
        // Generator.logDebug("documentGetActive", "doc=" + Generator._selectedDocument)
        return Generator._documents[Generator._selectedDocument || ""]                
    },
    /**
     * Whether document is active
     * @param {Object} doc document-object
     *
     * @return {bool}
     *
     * @memberof module:document
     */
    documentIsActive: function (doc) {
        return doc && Generator.layerIsDocument(doc) && doc.id == Generator._selectedDocument
    },
    /**
     * Document has artboards
     * @param {Object} doc document-object
     *
     * @return {bool}
     *
     * @memberof module:document
     */
    documentHasArtboards: function (doc) {
        if (Generator.layerIsDocument(doc)) {
            for (var i=0; i<doc._children.length; i++) {
                if (Generator.layerIsArtboard(doc._children[i])) {
                    return true
                }
            }
        }
    },
    getDocumentFlags: { compInfo: false, imageInfo: true, layerInfo: true, expandSmartObjects: false, getTextStyles: true, getFullTextStyles: true, selectedLayers: false, getCompLayerSettings: false, getDefaultLayerFX: true, getPathData: false },
    /**
     * Update document information
     * @param {string} doc_id Document Id
     * @param callback Result callback for the document data
     *
     * @memberof module:document
     */
    documentUpdate: function (doc_id, callback) {
        if (doc_id && !Generator._documentUpdatePending[doc_id]) {
            Generator.logDebug("getDocumentData", "doc_id="+doc_id)
            Generator._documentUpdatePending[doc_id] = true
            Generator._instance.getDocumentInfo(doc_id, Generator.getDocumentFlags).then(
                function(data) {
                    // Generator.logDebug("getDocumentData callback", "")
                    Generator._documentUpdatePending[data.id] = false
                    Generator._parseDocumentData(data)
                    if (callback) { callback(doc_id) }
                }, 
                function(err) { Generator.logError("getDocumentData", err) })
        }
    },
    /**
     * @module delta
     */
    /**
     * Whether layer children have changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaChildrenChanged: function (data, delta) {
        return !!delta.layers
    },
    /**
     * Whether layer content has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaContentChanged: function (data, delta) {
        return !!delta.pixels || delta.visible !== undefined || !!delta.changed || !!delta.clipped || !!Generator.deltaFillChanged(data, delta) || Generator.deltaEffectsChanged(data, delta) || !!delta.blendOptions || !!delta.smartObject || Generator.deltaTextChanged(data, delta) || Generator.deltaMaskChanged(data, delta) || (delta.added && Generator.layerGetBounds(delta) && !Generator.layerIsEmpty(delta) && Generator.layerIsContent(delta)) // BUG: Sometimes (e.g. add text layer) Photoshop returns just an "added=true" delta with no bounds
    },
    /**
     * Whether layer has been created
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaCreated: function (data, delta) {
        return !!delta.added || (!data && delta.id && Generator.layerGetBounds(delta)) // BUG: Sometimes (e.g. grouping layers) Photoshop returns just a layer without added
    },
    /**
     * Whether layer metadata has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentMetaChanged: function (data, delta) {
        return !!delta.metaDataOnly
    },
    /**
     * Whether document selection has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentSelectionChanged: function (data, delta) {
        return !!delta.selection
    },
    /**
     * Whether document has become active
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentActivated: function (data, delta) {
        return !!delta.active
    },
    /**
     * Whether document has closed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentClosed: function (data, delta) {
        return !!delta.closed
    },
    /**
     * Whether document has been saved
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentSaved: function (data, delta) {
        return Generator.deltaDocumentMetaChanged(data, delta) && !Generator.deltaDocumentSelectionChanged(data, delta) && !Generator.deltaDocumentClosed(data, delta) && !Generator.deltaReordered(data, delta) 
    },
    /**
     * Whether document file has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentFileChanged: function (data, delta) {
        return data && !!delta.file && (data.file != delta.file)
    },
    /**
     * Whether document has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaDocumentChanged: function (data, delta) {
        return !!delta.changed || !!delta.path 
    },
    /**
     * Whether layer effects have changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaEffectsChanged: function (data, delta) {
        return !!delta.layerEffects
    },
    /**
     * Whether layer fill has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaFillChanged: function (data, delta) {
        return !!delta.fill
    },
    /**
     * Whether layer mask has changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaMaskChanged: function (data, delta) {
        return !!delta.mask
    },
    /**
     * Whether layer has moved 
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaMoved: function (data, delta) {
        if (data && delta) {
            var old_bounds = Generator.layerGetBounds(data)
            var new_bounds = Generator.layerGetBounds(delta)
            // Generator.logDebug("deltaMoved", "old_bounds="+Generator.jsonEncode(old_bounds)+", new_bounds="+Generator.jsonEncode(new_bounds))
            return old_bounds && new_bounds && !Generator.deltaResized(data, delta) && ((old_bounds.top != new_bounds.top) || (old_bounds.left != new_bounds.left))
        }
    },
    /**
     * Whether layer preferences have changed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaPreferencesChanged: function (data, delta) {
        return !!delta.generatorSettings
    },
    /**
     * Whether layer has been removed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaRemoved: function (data, delta) {
        return !!delta.removed
    },
    /**
     * Whether layer has renamed
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaRenamed: function (data, delta) {
        return !!delta.name && !Generator.deltaCreated(data, delta)
    },
    /**
     * Whether layer has changed in order 
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaReordered: function (data, delta) {
        return delta.index || delta.index === 0
    },
    /**
     * Whether layer has resized
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaResized: function (data, delta) {
        var bounds = Generator.layerGetBounds(delta)
        if (data && bounds) {
            var container_bounds = Generator.layerGetContainerBounds(data)
            return  ((Generator.layerGetWidth(data) != Generator.layerGetWidth(delta)) || ((Generator.layerGetHeight(data) != Generator.layerGetHeight(delta))) || !Generator.layerIsInsideBounds(data, container_bounds) || !Generator.layerIsInsideBounds(delta, container_bounds))
        }
    },
    /**
     *  Whether layer has changed text content
     * @param {Object} data original object
     * @param {Object} delta change object
     *
     * @return {bool} 
     *
     * @memberof module:delta
     */
    deltaTextChanged: function (data, delta) {
        return !!delta.text
    },
    /**
     * @module photoshop
     */
    /**
     * Execute a JSX-script string in Photoshop 
     * @param {string} str JSX-script string
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
    photoshopExecuteScript: function (str, callback, error){
        // var time_stamp = Generator.pluginGetTimestamp()
        // Generator.logDebug("photoshopExecuteScript", "script="+str)
        Generator._instance.evaluateJSXString(str).then(
            function(result){
                // Generator.logDebug("photoshopExecuteScript", "result="+result)
                if (callback) { callback(result) }
            },
            function(err){
                console.error("["+Generator.pluginGetTimestamp()+"] photoshopExecuteScript ERROR: " + err)
                if (error) { error() }
            })
    },
    /**
     * Open a new file in Photoshop
     * @param {string} path Path to file
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
    photoshopOpenDocument: function (path, callback, error) {
        var script = 
        "var result = '';\
        var f = new File('"+path+"');\
        if(f && f.exists){\
            var d = app.open(f);\
            if (d) {\
                result = '{\"id\":'+d.id+',\"name\":\"' + d.name + '\",\"active\":' + (d == app.activeDocument) + '}';\
            }\
        };\
        result+''"
        // Generator.logDebug("photoshopOpenDocument", "script="+script)
        Generator._instance.evaluateJSXString(script).then(callback, error)
    },
    /**
     * Change the active document in Photoshop
     * @param {string} id Id of the document
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
    photoshopSetActiveDocument: function (id, callback, error) {
        var script = 
        "var result='false', i=null, docs='[', delimerator='';\
        for (i = 0; i < app.documents.length; i++) {\
            var d = app.documents[i];\
            if (d.id == '" + id + "') {\
                app.activeDocument = d;\
                result = 'true';\
                break;\
            }\
        }\
        '{\"id\": \""+id+",\"result\":\"+result+\"}'"
        Generator._instance.evaluateJSXString(script).then(callback, error)
    },
    /**
     * Close a document in Photoshop
     * @param {string} id Id of the document
     * @param {bool} save Whether to save doc before closing
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
    photoshopCloseDocument: function (id, save, callback, error) {
        var save_option = "SaveOptions.DONOTSAVECHANGES"
        if (!save) {
            save_option = "SaveOptions.SAVECHANGES"
        }
        var script = 
        "var result='false', i=null, docs='[', delimerator='';\
        for (i = 0; i < app.documents.length; i++) {\
            var d = app.documents[i];\
            if (d.id == '" + id + "') {\
                d.close("+save_option+");\
                result = 'true';\
                break;\
            }\
        }\
        '{\"id\": \""+id+",\"result\":\"+result+\"}'"
        Generator._instance.evaluateJSXString(script).then(callback, error)
    },
    /**
     * Execute a Photoshop action
     * @param {string} set_id Id of the action set
     * @param {string} action_id Id of the action
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
    photoshopExecuteAction: function (set_id, action_id, callback, error) {
        Generator.logDebug("photoshopExecuteAction", "set_id="+set_id+", action_id="+action_id)
        var script = 
        "app.doAction('"+action_id+"', '"+set_id+"')"
        Generator.logDebug("photoshopExecuteAction", "script="+script)
        Generator._instance.evaluateJSXString(script).then(callback, error)
    },
    /**
     * Get all open documents
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:photoshop
     */
	photoshopGetOpenDocuments: function (callback, error) {
		var script =
		"var i=null, docs='[', delimerator='';\
		for (i = 0; i < app.documents.length; i++) {\
            docs += delimerator + '{\"id\":'+app.documents[i].id+',\"name\":\"' + app.documents[i].name + '\",\"active\":' + (app.documents[i] == app.activeDocument) + '}';\
            delimerator = ',';\
        }\
		docs+']'"
		Generator._instance.evaluateJSXString(script).then(callback, error)
    },
    /**
     * @module png
     */
    _convertPngsToGifData: null,
    /**
     * Convert PNG-files on disk to an animated GIF. Updates "pngConvertToGif"-task for progress updates.
     * @param {string} gif_file Path of the created GIF-file
     * @param {string[]} png_files Array of PNG-file paths for animation frames
     * @param {number} fps Playback speed of animation
     * @param {number} loop_count Number of animation repeats, 0 for infinite
     * @param {function} [callback] Result callback
     *
     * @memberof module:png
     */
    pngConvertToGif: function (gif_file, png_files, fps, loop_count, callback) {
        // Generator.logMethod("pngConvertToGif", arguments)
        if (gif_file && png_files && png_files.length > 0) {
            Generator._convertPngsToGifData = { gif_file: gif_file, png_files: png_files, next_file: 0, fps: fps, loop_count: loop_count, callback: callback }
            Generator.pluginSetProgress("pngConvertToGif", 0)
            Generator._convertPngsToGifNext()
        } else {
            Generator.logError("pngConvertToGif", "invalid parameters: gif_file="+gif_file+", png_files="+png_files)
        }
    },
    _convertPngsToGifError: function (err) {
        Generator.logError("_convertPngsToGifError", err)
    },
    _convertPngsToGifNext: function () {
        var data = Generator._convertPngsToGifData
        if (data.next_file < data.png_files.length) {
            Generator.pluginSetProgress("_convertPngsToGifNext", data.next_file/data.png_files.length)
            var f = data.png_files[data.next_file]
            // Generator.logDebug("_convertPngsToGifNext", "file="+f)
            data.next_file++
            Generator._pngLoad(f, Generator._convertPngsToGifFrame, Generator._convertPngsToGifError)            
        } else {
            Generator.pluginSetProgress("pngConvertToGif", 1)
            data.gif.finish()
            if (data.callback) {
                data.callback()
            }
            Generator.pluginSetProgress("pngConvertToGif", null)
            Generator._convertPngsToGifData = null
        }
    },
    _convertPngsToGifFrame: function (png) {
        if (png) {
            // Generator.logDebug("_convertPngsToGifFrame", "png with width="+png.width+", height="+png.height)
            var data = Generator._convertPngsToGifData
            if (!data.gif) {
                data.gif = new Generator._gif(png.width, png.height)
                data.gif.setFrameRate(data.fps)
                data.gif.setRepeat(data.loop_count)
                data.gif.setQuality(10)
                data.gif.pipe(Generator._filesystem.createWriteStream(data.gif_file))
                data.gif.writeHeader()
            }
            data.gif.addFrame(png.data)
            Generator._convertPngsToGifNext()
        }
    },
    _pngLoad: function (file, callback, error) {

        if (file && callback) {
            // var png_data = Generator._filesystem.readFileSync(file)
            var png = new Generator._png()
            png.on('parsed', function() { callback(this) })
            if (error) {
                png.on('error', error)
            }
            Generator._filesystem.createReadStream(file).pipe(png)
        }
    },
    /**
     * Write layers to a PNG-file
     * @param {string} doc_id Document of the layers
     * @param {Object[]} layers Array of layers
     * @param {string} filename Path to filename
     * @param {Object} [bounds] Bounds to use for export if not layer bounds
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     *
     * @memberof module:png
     */
    pngWrite: function (doc_id, layers, filename, bounds, callback, error) {
        if (doc_id && layers && filename) {
            Generator._pixmapExport(doc_id, layers, 
                function(pixmap) {
                    Generator._pixmapWrite(pixmap, filename, bounds, callback, error)
                })
        } else {
            Generator.logError("pngWrite", "invalid parameters: doc_id="+doc_id+", layers="+(!(!layers))+", filename="+filename)
        }
    },
    /**
     * Write layers to a stream
     * @param {string} doc_id Document of the layers
     * @param {Object[]} layers Array of layers
     * @param {stream} stream Writable stream
     * @param {Object} [bounds] Bounds to use for export if not layer bounds
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:png
     */
    pngStream: function (doc_id, layers, stream, bounds, callback, error) {
        if (doc_id && layers && stream) {
            Generator._pixmapExport(doc_id, layers, 
                function(pixmap) {
                    Generator.logDebug("pngStream exported", "pixmap_bounds="+Generator.jsonEncode(pixmap.bounds, true))
                    Generator._pixmapStream(pixmap, stream, bounds, callback, error)
                })
        } else {
            Generator.logError("pngWrite", "invalid parameters: doc_id="+doc_id+", layers="+(!(!layers)))
        }
    },
    pngCreate: function (width, height) {
        if (width && height) {
            return new Generator._png({width: width, height: height, filterType: -1})
        } else {
            return new Generator._png()
        }
    },
    _pixmapWrite: function(pixmap, filename, bounds, callback, error){
        if (pixmap.width>0 && pixmap.height>0) {
            var save_settings = { format:"png32" }
            // Generator.logDebug("_pixmapWrite", "bounds="+Generator.jsonEncode(bounds, true)+", pixmap_bounds="+Generator.jsonEncode(pixmap.bounds, true))
            if (bounds) {
                save_settings.padding = { top: pixmap.bounds.top-bounds.top, left: pixmap.bounds.left-bounds.left, bottom: bounds.bottom-pixmap.bounds.bottom, right: bounds.right-pixmap.bounds.right}
            }
            // Generator.logDebug("_pixmapWrite", "saving pixmap width="+pixmap.width+", height="+pixmap.height+" to png="+filename)
            Generator._instance.savePixmap(pixmap, filename, save_settings).then(callback, error)
        } else {
            Generator.logDebug("_pixmapWrite", "empty pixmap!")
            if (error) { error("empty pixmap") }
            else if (callback) { callback() }
        }
    },
    _pixmapStream: function(pixmap, output_stream, bounds, callback, error){
        if (pixmap.width>0 && pixmap.height>0) {
            var save_settings = { format:"png32" }
            Generator.logDebug("_pixmapStream", "bounds="+Generator.jsonEncode(bounds, true)+", pixmap_bounds="+Generator.jsonEncode(pixmap.bounds, true))
            if (bounds) {
                save_settings.padding = { top: pixmap.bounds.top-bounds.top, left: pixmap.bounds.left-bounds.left, bottom: bounds.bottom-pixmap.bounds.bottom, right: bounds.right-pixmap.bounds.right}
            }
            Generator.logDebug("_pixmapStream", "saving pixmap width="+pixmap.width+", height="+pixmap.height+" to stream")
            Generator._instance.streamPixmap(pixmap, output_stream, save_settings).then(callback, error)
        } else {
            Generator.logDebug("_pixmapStream", "empty pixmap!")
            output_stream.end()
            if (error) { error("empty pixmap") }
            else if (callback) { callback() }
        }
    },
    _pixmapExportSettings: {},
    _pixmapExport: function (doc_id, layer_or_array, callback, error) {
        if (layer_or_array.id) { // it's not an array
            layer_or_array = [layer_or_array]
        } 
        var layer_spec = { firstLayerIndex: layer_or_array[0].index, lastLayerIndex: layer_or_array[0].index }
        var hidden_layers = []
        for (var i=0; i<layer_or_array.length; i++) {
            var current_layer = layer_or_array[i]
            // Generator.logDebug("_pixmapExport", "current_layer="+current_layer.name)
            var current_layer_index = current_layer.index
            layer_spec.firstLayerIndex = Math.min(layer_spec.firstLayerIndex, current_layer_index)
            layer_spec.lastLayerIndex = Math.max(layer_spec.lastLayerIndex, current_layer_index)
            // Generator.logDebug("_exportAssetPng", "current_layer_index="+current_layer_index+", next_layer_index="+next_layer_index)
            if (!Generator.layerIsVisible(current_layer) && !Generator.layerIsGroup(current_layer)) {
                hidden_layers.push(current_layer_index)
            }
            if (i < layer_or_array.length-1) {
                var next_layer_index = layer_or_array[i+1].index
                for (var j=current_layer_index+1; j<next_layer_index; j++) {
                    hidden_layers.push(j)    
                }                
            }
        }
        if (hidden_layers.length > 0) {
            layer_spec.hidden = hidden_layers   
        }            
        Generator.logDebug("_pixmapExport", "layer_spec="+Generator.jsonEncode(layer_spec, true))
        Generator._instance.getPixmap(doc_id, layer_spec, Generator._pixmapExportSettings).then(callback, error)
    },
    _executeFileWithParams: function(path, param, callback, error) {
        try {
            // console.error("_executeFileWithParams: path=" + path+", parameter="+param)
            var data = Generator.fileLoad(Generator.getPlugindirectory + path)
            if (data) {
                Generator.photoshopExecuteScript('(function () { var SHOPMYAPP_SCRIPT_PARAMETER=\'' + param + '\';var SHOPMYAPP_SCRIPT_RESULT=\'bar\';' + data + ';return SHOPMYAPP_SCRIPT_RESULT;}())', callback, error);
                // Generator.photoshopExecuteScript('var SHOPMYAPP_SCRIPT_PARAMETER=\'' + param + '\';var SHOPMYAPP_SCRIPT_RESULT=\'bar\';' + data + '; SHOPMYAPP_SCRIPT_RESULT || ""', callback, error);
            } else {
                console.error("["+Generator.pluginGetTimestamp()+"] _executeFileWithParams FAILED to load file '"+path+"'")
            }
        } catch (e) {
            console.error("Exception in script '" + path + "' with param '"+ param + "':\n\n" + e)
            return ""
        }
    },
    executePlugin: function (name, parameter, callback, error){
        // Generator.logDebug("executePlugin", "name="+name+", parameter="+parameter)
        if (parameter) {
            Generator._executeFileWithParams('shopmyapp_set_parameter.js', parameter, 
                function() {
                    Generator._photoshopExecuteFile(name, callback, error)
                })
        } else {
            Generator._photoshopExecuteFile(name, callback, error)
        }
        return true
    },
    _executeFileWithParams: function (name, callback, error){
        // var time_stamp = Generator.pluginGetTimestamp()
        // Generator.logDebug("executeFile", "name="+name)
        Generator._instance.evaluateJSXFile(Generator.getPlugindirectory + name).then(
            function(result){
                // Generator.logDebug("executeFile", "result="+result)
                if (callback) { callback(result) }
            },
            function(err){
                Generator.logError("_photoshopExecuteFile", err)
                if (error) { error() }
            })
    },
    /**
     * @module file
     */
    /**
     * Get just the name of the file without the path or extension
     * @param {string} path Path of the file
     * @return {string} 
     *
     * @memberof module:file
     */
    fileSanitizeName: function (path) {
        if (path) {
            var result = Generator.fileSanitizePath(path)
            result = Generator.fileGetName(result)
            result = result.replace("."+Generator.fileGetExtension(result), "") // strip extension
            // Generator.logDebug("fileSanitizeName", "name="+result)
            return result
        }
    },
    _fileGetSuffix: function (path, separator) {
        var start = path.lastIndexOf(separator)
        if (start >= 0) {
            return path.substring(start+1)
        } else {
            return null
        }
    },
    /**
     * Turn an absolute path to a relative path with respect to a root folder
     * @param {string} path Path to the file
     * @param {string} root_path Root of the relative path
     * @return {string} 
     *
     * @memberof module:file
     */
    fileParseRelativePath: function (path, root_path) {
        if (path && root_path) {
            Generator.logDebug("fileParseRelativePath", "path="+path+", root="+root_path)
            var path_parts = path.toLowerCase().split("/")
            var root_parts = root_path.toLowerCase().split("/")
            var result = ""
            var i = root_parts.length-2, j = 0
            if (path_parts[0] == ".") {
                j++
            }
            while (path_parts[j] == "..") {
                Generator.logDebug("fileParseRelativePath", "'..' in path, skip folder="+root_parts[i])
                j++;
                i--
            }
            while (i >= 0) {
                result = root_parts[i]+"/"+result
                i--
            }
            while (j < path_parts.length-1) {
                result = result+path_parts[j]+"/"
                j++
            }
            return result+path_parts[path_parts.length-1]

        }
    },
    /**
     * Sanitize a path to forward slashes and optionally to a trailing slash
     * @param {string} path Path to the file
     * @param {bool} trailing_slash Whether path should end to a trailing slash
     * @return {string} 
     *
     * @memberof module:file
     */
    fileSanitizePath: function (path, trailing_slash) {
        if (path) {
            path = path.replace(/\\/gi, "/")
            if (trailing_slash && path[path.length-1] != "/") {
                path = path + "/"
            }
            return path
        }
    },
    /**
     * Get the file name part of a path
     * @param {string} path Path to the file
     * @return {string} 
     *
     * @memberof module:file
     */
    fileGetName: function (path) {
        if (path) {
            return Generator._fileGetSuffix(path, "/") || path // if no path, name is the full thing
        }
    },
    /**
     * Get the file extension of a path
     * @param {string} path Path to the file
     * @return {string} 
     *
     * @memberof module:file
     */
    fileGetExtension: function (path) {
        if (path) {
            return Generator._fileGetSuffix(path, ".") || "" // if no extension it's empty
        }
    },
    /**
     * Get directory part of the path
     * @param {string} path Path to the file
     * @return {string} 
     *
     * @memberof module:file
     */
    fileGetPath: function (path) {
        if (path) {
            return path.replace(Generator.fileGetName(path), "") // remove name
        }
    },
    /**
     * Load and decode a JSON-file
     * @param {string} path Path to the file
     * @return {Object} 
     *
     * @memberof module:file
     */
    fileLoadJson: function(path) {
        var data = Generator.fileLoad(path) 
        if (data) {
            var obj = Generator.jsonDecode(data)
            if (obj) {
                return obj
            } else {
                Generator.logError("fileLoadJson", "decode failed: '"+data+"'")
            }
        }
        return null
    },
    /**
     * Load a file
     * @param {string} path Path to the file
     * @return {string} 
     *
     * @memberof module:file
     */
    fileLoad: function(path, binary) {
        try {
            var encoding
            if (!binary) {
                encoding = "utf8"
            }
            var data = Generator._filesystem.readFileSync(path, encoding)
            if (data || data === "") {
                return data
            } else {
                Generator.logError("fileLoad", "no content loading file '"+path+"'")
            }
        } catch (e) {
            Generator.logError("fileLoad", "EXCEPTION loading file '" + path + "': " + e.message)
        }
        return null
    },
    /**
     * Encode an object as JSON and save it to a file
     * @param {string} path Path to the file
     * @param {Object} data Object to save
     * @param {bool} pretty_print Format JSON as human readable
     *
     * @memberof module:file
     */
    fileSaveJson: function(path, data, pretty_print) {
        var json_data = Generator.jsonEncode(data, pretty_print)
        if (json_data) {
            Generator.fileSave(path, json_data)
        } else {
            Generator.logError("fileSaveJson", "unable to JSON encode data '" + data + "'")
        }
    },
    /**
     * Create a readable stream to a file
     * @param {string} path Path to the file
     * @return {stream} 
     *
     * @memberof module:file
     */
    fileGetReadStream: function(path) {
        if (path && Generator.fileExists(path)) {
            return Generator._filesystem.createReadStream(path)
        }
    },
    /**
     * Create a writable stream to a file
     * @param {string} path Path to the file
     * @return {stream} 
     *
     * @memberof module:file
     */
    fileGetWriteStream: function(path) {
        if (path) {
            return Generator._filesystem.createWriteStream(path)
        }
    },
    /**
     * Save files to a ZIP-archive in a file
     * @param {string[]} file_entries Array of file paths
     * @param {string} path Path to the file
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:file
     */
    fileSaveZip: function(file_entries, path, callback, error) {
        var stream = Generator.fileGetWriteStream(path)
        if (stream) {
            Generator.fileStreamZip(file_entries, stream, callback, error)
        }
    },
    /**
     * Save files to a ZIP-archive and write to a stream
     * @param {string[]} file_entries Array of file paths
     * @param {Object} stream Writable stream
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:file
     */
    fileStreamZip: function(file_entries, stream, callback, error) {
        if (file_entries && stream) {
            Generator.pluginSetProgress("fileStreamZip", 0)
            var zip = new Generator._archiver('zip')
            // zip.setEncoding('base64')
            // zip.pipe(Generator._base64.encode()).pipe(stream, {end:false})
            zip.pipe(stream, {end:false})
            zip.on('end', function() {Generator.logDebug("fileStreamZip - end", "wrote "+zip.pointer()+" bytes"); callback() })
            // zip.on('end', callback)
            zip.on('error', error)
            // zip.on('entry', function(entry_data) {Generator.logDebug("fileStreamZip - entry", Generator.jsonEncode(entry_data, true))})

            for (var i=0; i<file_entries.length; i++) {
                Generator.pluginSetProgress("fileStreamZip", i/file_entries.length)
                var entry = file_entries[i]
                Generator.logDebug("fileStreamZip", "add file="+entry.name)
                zip.file(entry.path, { name: entry.name })
            }
            Generator.pluginSetProgress("fileStreamZip", 1)
            zip.finalize()
            Generator.pluginSetProgress("fileStreamZip", null)
        }
    },
    /**
     * Save content to a file
     * @param {string} path Path to the file
     * @param {string} data Data to save
     * @return {bool}
     *
     * @memberof module:file
     */
    fileSave: function(path, data) {
        try {
            // Generator.logDebug("fileSave", "path="+path+", data="+data)
            Generator._filesystem.writeFileSync(path, data || "")
            return true
        } catch (e) {
            Generator.logError("fileSave", "EXCEPTION saving file '" + path + "': " + e.message)
        }
        return false
    },
    /**
     * Move a file
     * @param {string} old_path Old path to the file
     * @param {string} new_path New path to the file
     * @return {bool}
     *
     * @memberof module:file
     */
    fileMove: function(old_path, new_path) {
        try {
            if (Generator.fileExists(old_path)) {
                Generator.logDebug("fileMove", "old_path="+old_path+", new_path="+new_path)
                Generator._filesystem.renameSync(old_path, new_path)
                return true
            }
        } catch (e) {
            Generator.logError("fileMove", "EXCEPTION moving file '" + path + "': " + e.message)
        }
        return false
    },
    /**
     * Copy a file
     * @param {string} old_path Old path to the file
     * @param {string} new_path New path to the file
     * @return {bool}
     *
     * @memberof module:file
     */
    fileCopy: function(old_path, new_path) {
        try {
            if (Generator.fileExists(old_path)) {
                Generator.logDebug("fileCopy", "old_path="+old_path+", new_path="+new_path)
                Generator._filesystem.copySync(old_path, new_path)
                return true
            }
        } catch (e) {
            Generator.logError("fileCopy", "EXCEPTION copying file '" + old_path + "': " + e.message)
        }
        return false
    },
    /**
     * Delete a file
     * @param {string} path Path to the file
     * @return {bool}
     *
     * @memberof module:file
     */
    fileDelete: function(path) {
        try {
            if (Generator.fileExists(path)) {
                // Generator.logDebug("fileDelete", "path="+path)
                Generator._filesystem.unlinkSync(path)
                return true
            }
        } catch (e) {
            Generator.logError("fileDelete", "EXCEPTION deleting file '" + path + "': " + e.message)
        }
        return false
    },
    /**
     * Delete all files in a directory with given preix
     * @param {string} path Path to the directory
     * @param {string} prefix Prefix of files to delete
     *
     * @memberof module:file
     */
    filesDeleteWithPrefix: function(path, prefix) {
        if (path) {
            var files = Generator.directoryGetFiles(path)
            for (var i=0; i<files.length; i++) {
                var f = files[i]
                if (!prefix || f.indexOf(prefix) == 0) {
                    // Generator.logDebug("filesDeleteWithPrefix", "filename="+f)
                    Generator.fileDelete(path+"/"+f)
                }
            }
        }
    },
    /**
     * Get Node-style file info object
     * @param {string} path Path to the file
     *
     * @memberof module:file
     */
    fileGetInfo: function(path) {
        if (Generator.fileExists(path)) {
            return Generator._filesystem.statSync(path) 
        }
        return null
    },
    /**
     * Get size of the file
     * @param {string} path Path to the file
     *
     * @memberof module:file
     */
    fileGetSize: function(path) {
        if (Generator.fileExists(path)) {
            var file_stat = Generator._filesystem.statSync(path) 
            if (file_stat && file_stat.isFile()) {
                return file_stat.size
            }
        }
        return null
    },
    /**
     * Does the file exist
     * @param {string} path Path to the file
     * @return {bool}
     *
     * @memberof module:file
     */
    fileExists: function(path) {
        var result = Generator._filesystem.existsSync(path)
        // Generator.logDebug("isFile", "path="+path+", result="+result)
        return result
    },
    /**
     * @module directory
     */
    /**
     * Get files in a directory
     * @param {string} path Directory path
     * @return {string[]} Array of filenames
     *
     * @memberof module:directory
     */
    directoryGetFiles: function(path) {
        try {
            if (Generator.fileExists(path)) {
                // Generator.logDebug("directoryGetFiles", "path="+path)
                return Generator._filesystem.readdirSync(path)
            }
        } catch (e) {
            Generator.logError("directoryGetFiles", "EXCEPTION reading directory files '" + path + "': " + e.message)
        }
    },    
    /**
     * Create a directory path (including multiple subdirectories)
     * @param {string} path Directory path
     * @return {bool}
     *
     * @memberof module:directory
     */
    directoryCreatePath: function (path) {
        try {
            if (path) {
                // Generator.logDebug("directoryCreatePath", "path="+path)
                var path_parts = path.split("/")
                var dir = path_parts[0] + "/"
                var i = 0
                while (Generator.fileExists(dir)) {
                    i = i + 1
                    dir = dir + path_parts[i] + "/"
                }
                while (i < path_parts.length) {
                    // Generator.logDebug("directoryCreatePath - create directory", "dir="+path_parts[i])
                    Generator._filesystem.mkdirSync(dir)
                    i = i + 1
                    dir = dir + path_parts[i] + "/"
                }
            }
            return true
        } catch (e) {
            Generator.logError("directoryCreatePath", "EXCEPTION creating directory '" + path + "': " + e.message)
        }
        return false
    },
    /**
     * @module http
     */
    _httpRequest: function(url, method, headers, body, callback, error) {
        try {
            var url_parts = Generator._url.parse(url, false, false)
            var options = { protocol: url_parts.protocol, host: url_parts.hostname, path: url_parts.path, port: url_parts.port || 80, method: method || 'GET', headers: headers  }
            var result = ''
            var http = Generator._http
            if (options.protocol == "https:") {
                http = Generator._https
            }
            if (body) {
                options.headers["Content-Length"] = body.length
                Generator.logDebug("httpRequest", "content length="+body.length)
            }
            // Generator.logDebug("httpRequest", "options="+Generator.jsonEncode(options))
            var request = http.request(options, 
                function (response) {
                    if (callback) {
                        response.on('data', function (chunk) { result += chunk })
                        response.on('end', function () { callback(result) })
                    } else {
                        response.on('data', function () {})                   
                        response.on('end', function () {})                   
                    }
                })
            request.on('error', 
                function (err) {
                    Generator.logError("_httpRequest", err)
                    if (error) { error(err) }
                })            

            return request
        } catch (e) {
            Generator.logError("_httpRequest", e.message)
            if (error) { error(e.message) }            
        }
    },
    /**
     * Execute a HTTP request
     * @param {string} url Request URL
     * @param {string} [method] HTTP method
     * @param {Object} [headers] Request headers
     * @param {string} [body] Request body
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:http
     */
    httpRequest: function(url, method, headers, body, callback, error) {
        var request = Generator._httpRequest(url, method, headers, body, callback, error)
        if (body) {
            if (typeof(body) == "string") {
                request.write(body, 'utf8')
            } else {
                // Generator.logDebug("httpRequest", "binary body")
                request.write(body, 'binary')            
            }
        }
        // Generator.logDebug("httpRequest", "url="+url)
        request.end()
    },
    /**
     * Create a HTTP request stream to write the body on
     * @param {string} url Request URL
     * @param {string} [method] HTTP method
     * @param {Object} [headers] Request headers
     * @param {string} [body] Request body
     * @param {function} [callback] Callback for the result
     * @param {function} [error] Callback for an error
     *
     * @memberof module:http
     */
    httpRequestStream: function(url, method, headers, callback, error) {
        return Generator._httpRequest(url, method, headers, null, callback, error)
    },
    /**
     * @module util
     */
    /**
     * Calculate CRC32 of a data
     * @param {string} data Calculated data
     * @return {string} 
     *
     * @memberof module:util
     */
    utilCrc32: function (data) {
        return Generator._crc(data)
    },
    /**
     * Calculate MD5 of a data
     * @param {string} data Calculated data
     * @return {string} 
     *
     * @memberof module:util
     */
    utilMd5: function (data) {
        return Generator._utilHash(data, "md5")
    },
    _utilHash: function (data, hash_function) {
        if (data && hash_function) {
            var hash = Generator._cryptography.createHash(hash_function)
            hash.update(data)
            return hash.digest("hex")
        }
    },
    /**
     * Generate a random id string
     * @return {string} 
     *
     * @memberof module:util
     */
    utilRandomId: function () {
        return Math.floor(Math.random()*4000000000).toString(16)
    },
    /**
     * @module log
     */
    logMethod: function (func, args) {
        var result = ""
        for (var i=0; i<args.length; i++) {
            result = result+"\nparam"+i+"="+args[i]
        }
        console.log("["+Generator.pluginGetTimestamp()+" "+func+"] " + result)
    },
    _log: function (func, status, message) {
        if (typeof(message) != "string") {
            message = Generator.jsonEncode(message)
        }
        var s = "["+Generator.pluginGetTimestamp()+" "+func+status+"] "+message
        console.log(s)
        return s
    },
    /**
     * Log a debug message
     * @param {string} title Log title
     * @param {string} message Log message
     *
     * @memberof module:log
     */
    logDebug: function (title, message) {
        Generator._log(title, "", message)
    },
    /**
     * Log an info message
     * @param {string} title Log title
     * @param {string} message Log message
     *
     * @memberof module:log
     */
    logInfo: function (title, message) {
        Generator._log(title, " INFO", message)
    },
    /**
     * Log a warning message
     * @param {string} title Log title
     * @param {string} message Log message
     *
     * @memberof module:log
     */
    logWarning: function (title, message) {
        Generator._log(title, " WARNING", message)
    },
    /**
     * Log an error message
     * @param {string} title Log title
     * @param {string} message Log message
     *
     * @memberof module:log
     */
    logError: function (title, message) {
        Generator._errors.push(Generator._log(title, " ERROR", message))
    },
    /**
     * Get all logged errors
     *
     * @return {string[]}
     *
     * @memberof module:log
     */
    logGetErrors: function () {
        return Generator._errors
    },
    /**
     * @module json
     */
    _jsonEncodeFilter: function(hide_prefix) {
        if (hide_prefix) {
            var test_regex = new RegExp("^"+hide_prefix)
            var filter_func = function(name, val) {
                    if (!test_regex.test(name)) {
                        return val
                    } else {
                        return undefined
                    }       
                }
            return filter_func
        }
    },
    _jsonEncodeTabs: function(pretty_print) {
        if (pretty_print) { return 2 }
        else { return 0 }
    },
    /**
     * Encode an object as JSON
     * @param {Object} obj_data
     * @param {bool} [pretty_print] Human readable JSON formatting
     * @param {Object} [hide_prefix] Hide all property names starting with prefix
     * @return {string}
     *
     * @memberof module:json
     */
    jsonEncode: function(obj_data, pretty_print, hide_prefix) {
        if (!obj_data) {
            return ""
        } else {
            try {
                return JSON.stringify(obj_data, Generator._jsonEncodeFilter(hide_prefix), Generator._jsonEncodeTabs(pretty_print))
            } catch(e) {
                Generator.logError("jsonEncode", "exception: "+e)
            }
        }
    },
    /**
     * Decode an object as JSON
     * @param {string} json_data JSON data
     * @return {Object}
     *
     * @memberof module:json
     */
    jsonDecode: function(json_data) {
        if (json_data) {
            try {
                return (JSON.parse(json_data))
            } catch(e) {
                Generator.logError("jsonDecode", "exception: "+e)
            }
        }
    },
    _addLayerChild: function (parent, child) {
        if (parent && child) {
            if (child._parent) {
                Generator._removeLayerChild(child._parent, child)
            }
            var i = 0, children = parent._children
            while (i < children.length && children[i].index < child.index) {
                Generator.logDebug("_addLayerChild", "skip child="+children[i].index+", new child="+child.index)
                i++
            }
            children.splice(i, 0, child)
            child._parent = parent
            // Generator._printLayerChildren(parent)
        }
    },
    _removeLayerChild: function (parent, child) {
        if (parent && child) {
            var i = 0, children = parent._children
            while (i < children.length) {
                if (children[i] == child) {
                    children.splice(i, 1)
                    // Generator._printLayerChildren(parent)
                    return true
                }
                i++
            }
        }
        return false
    },
    _parseOpenDocuments: function(result){
        Generator.logDebug("_parseOpenDocuments", "data=" + Generator.jsonEncode(result, true)+", length="+result.length)
        if (result) {
            var active_doc = null
            for (var i=0; i<result.length; i++) {
                var doc = result[i]
                Generator.logDebug("_parseOpenDocuments", "id="+doc.id+", name="+doc.name+", active="+doc.active.toString())
                if (doc.active) {
                    Generator._onDocumentSelect(doc.id)
                }
                if (!Generator.documentGetById(doc.id)) {
                    Generator.documentUpdate(doc.id)
                }
            }
        }
    },    
    _layerUpdateOrderIndex: function (layer) {
        var doc_index = Generator._layerOrderIndex[layer._document.id]
        doc_index[layer.index] = layer
    },
    _parseDocumentData: function (data) {
        Generator.logDebug("_parseDocumentData", "id="+data.id) 
        data.id = data.id.toString() // normalize to string
        data.type = Generator.LAYER_TYPES.document
        data.name = Generator.fileSanitizeName(data.file)
        data._path = Generator.fileSanitizePath(data.file)
        data._url = "//"+data.name+"/"
        data._uid = Generator.layerCalculateUid(data.id, null)
        data._settings = Generator._layerGetPluginSettings(data, Generator._pluginid)
        data._children = []
        data._deltas = {}
        data._document = data // convenience to not have special treatment for doc
        Generator._layerDataIndex[data.id] = data
        Generator._layerOrderIndex[data.id] = []
        Generator._layerUrlIndex[data._url] = data
        Generator._documents[data.id] = data

        // Generator.logDebug("_parseDocumentData", "active="+data.active) 
        if (data.layers) {
            for (var i=0; i<data.layers.length; i++) {
                Generator._parseLayerData(data, data.layers[i], data)
            }
            delete data.layers
        }
        Generator.logDebug("_parseDocumentData", "document="+Generator.jsonEncode(data, true, "_")) // print last so .layers converted to ._childrent that is not printed
        Generator._onDocumentUpdate(data) // trigger event downstream
        if (Generator._selectedDocumentPending == data.id) { 
            Generator._onDocumentSelect(data.id)
        }
        Generator._onSelectionChange(data.id, data.selection) 
        Generator._handlePhotoshopEvent("onDocumentUpdate", data) 
    },
    _parseLayerData: function (doc, layer, parent) {
        // Generator.logDebug("_parseLayerData", "id="+layer.id) 
        layer.id = layer.id.toString()
        layer._uid = Generator.layerCalculateUid(doc.id, layer.id)
        layer._document = doc
        layer._children = []
        layer._deltas = {}
        layer._url = parent._url + layer.name
        layer._settings = Generator._layerGetPluginSettings(layer, Generator._pluginid)
        if (Generator.layerIsGroup(layer)) {
            layer._url = layer._url + "/"
        }
        Generator._addLayerChild(parent, layer)

        Generator._layerUrlIndex[layer._url] = layer
        Generator._layerDataIndex[layer._uid] = layer
        Generator._layerUpdateOrderIndex(layer)
        Generator._layerOrderIndex[doc.id][layer.index] = layer
		// Generator.logDebug("_parseLayerData", "layer_id="+layer._uid+", index="+layer.index)

        // ._url must be set calculation in children will go OK         
        if (layer.layers) {
            for (var i=0; i<layer.layers.length; i++) {
                // Generator.logDebug("_parseLayerData", "layer_id="+layer._uid)
                Generator._parseLayerData(doc, layer.layers[i], layer)
            }
        }
    },

    _parseDocumentChanges: function (delta) {
        // Generator.logDebug("_parseDocumentChanges", "id="+delta.id) 
        delta.id = delta.id.toString() // normalize to string
        if (Generator.deltaDocumentClosed(null, delta)) {  
            return // already handled in close event
        }
        var doc = Generator.documentGetById(delta.id)
        if (doc) {            
            if (Generator.deltaDocumentActivated(null, delta)) {  
                Generator._onDocumentSelect(delta.id)
            }
            if (Generator.deltaDocumentSelectionChanged(null, delta)) {
                Generator._onSelectionChange(delta.id, delta.selection)
            }
            if (Generator.deltaPreferencesChanged(null, delta)) {
                doc._settings = Generator._layerGetPluginSettings(delta, Generator._pluginid)
                Generator.logDebug("_parseDocumentChanges - update settings!", Generator.jsonEncode(doc._settings))
            }
            var layers = delta.layers
            if (layers) {
                for (var i=0; i<layers.length; i++) {
                    // Generator.logDebug("_parseLayerData", "layer_id="+layer._uid)
                    Generator._parseLayerChanges(doc, layers[i])
                }
                delete delta.layers
            }
            Generator._handlePhotoshopEvent("onDocumentChange", delta) 
        } else {
            Generator.logDebug("_parseDocumentChanges - doc not found!", "id="+delta.id) 
            Generator.documentUpdate(delta.id)
        }
    },
    _copyLayerChanges: function (layer, delta) {
        var target = layer._deltas
        for (var id in delta) {
            if (id != "layers" || id != "id") {
                // Generator.logDebug("_copyLayerChanges", "layer_id="+delta.id+", id="+id+", value="+delta[id])
                target[id] = delta[id]
            }
        }
    },
    _parseLayerChanges: function (doc, delta) {
        // Generator.logDebug("_parseLayerChanges", "doc="+doc.id+", id="+delta.id) 
        delta.id = delta.id.toString()
        var layer = Generator.layerGetById(doc.id, delta.id)
        if (layer) {
            Generator._copyLayerChanges(layer, delta)
            if (Generator.deltaPreferencesChanged(layer, delta)) {
                layer._settings = Generator._layerGetPluginSettings(delta, Generator._pluginid)
                Generator.logDebug("_parseLayerChanges - update settings!", Generator.jsonEncode(layer._settings))
            }
            if (delta.layers) {
                for (var i=0; i<delta.layers.length; i++) {
                    // Generator.logDebug("_parseLayerData", "layer_id="+delta._uid)
                    Generator._parseLayerChanges(doc, delta.layers[i])
                }
            }
        }
    },
    _deleteLayerData: function (layer, recursive_call) {
        if (layer) {
            // Generator.logDebug("_deleteLayerData", "layer="+layer._url)
            if (recursive_call) {
                for (var i=0; i<layer._children.length; i++) {
                    Generator._deleteLayerData(layer._children[i], true)
                }
            }
            delete Generator._layerUrlIndex[layer._url]
            delete Generator._layerDataIndex[layer._uid]

            Generator._removeLayerChild(layer._parent, layer)
        }
    },

	
}//			******************** generator.js ********************

module.exports = Generator