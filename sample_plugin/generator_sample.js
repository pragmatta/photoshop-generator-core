"use strict";
var Generator = require("photoshop-generator-core")

var SamplePlugin = {
    MODULE_ID: "SamplePlugin",
    APP_ID: "PHOTOSHOP_GENERATOR_SCORE",
    EXAMPLE_SCRIPT: "/example.jsx",
    POLL_TIMEOUT: 30000,
    // TEMP_FILE_PREFIX: "_",
    SERVER_PORT: 8083, // default setting value -> string
    TEMP_FILE_PREFIX: "_scriptserver_",
    SUFFIX_META: ".json",
    SUFFIX_IMAGE: ".png",
    SUFFIX_AUDIO: ".mp3",
    SUFFIX_CODE: ".lua",

    _state: { 
        server: null,
        sessionid: null,
        plugindirectory: null,
        isfirstrun: null,
        timestamp:0, 
        timestamp_documents: 0,
        settings: {},
        scripts: {},
        actions: {},
        documents: {}, 
    },
    _polls: [],
    _taskDirectories: {},
    _scriptDirectoryWatchers: {},
    _taskQueue: [],

    initialize: function (generator_instance, generator_config) {
        Generator.logDebug("SamplePlugin.initialize", "")
        Generator.pluginInitialize(generator_instance, generator_config, SamplePlugin.APP_ID, SamplePlugin.SERVER_PORT)

        Generator.pluginSetEventHandler("onDocumentClose", SamplePlugin.onDocumentClose)
        Generator.pluginSetEventHandler("onDocumentSelect", SamplePlugin.onDocumentSelect)
        Generator.pluginSetEventHandler("onDocumentUpdate", SamplePlugin.onDocumentUpdate)
        Generator.pluginSetEventHandler("onDocumentChange", SamplePlugin.onDocumentChange)
        // Generator.pluginSetEventHandler("onActionsComplete", SamplePlugin.stateUpdate)

        Generator.serverSetRequestHandler("", SamplePlugin.handleRequestDefault)
        Generator.serverSetRequestHandler("documents", SamplePlugin.handleRequestDocuments)
        Generator.serverSetRequestHandler("layerdata", SamplePlugin.handleRequestLayerdata)
        Generator.serverSetRequestHandler("layercontent", SamplePlugin.handleRequestLayercontent)
        Generator.serverSetRequestHandler("errors", SamplePlugin.handleRequestErrors)
        Generator.serverSetRequestHandler("poll", SamplePlugin.handleRequestPoll)
    },
    start: function () {
        Generator.logDebug("SamplePlugin.start", "")        
        Generator.pluginStart()

        SamplePlugin._sessionid = Generator.pluginGetSessionId()
        SamplePlugin.stateUpdate(true, true, false)
    },

    onDocumentClose: function(doc_id) {
        SamplePlugin.stateUpdate(false, true, false) // closing active doc also updates selection
    },
    onDocumentSelect: function(id) {
        Generator.logDebug("onDocumentSelect", "id=" + id)
        SamplePlugin.stateUpdate(false, true, false)
    },
    onDocumentChange: function (document_delta) {
        Generator.logDebug("onDocumentChange", Generator.jsonEncode(document_delta, true, "_"))        
        SamplePlugin.stateUpdate(false, true, false)
    },
    onDocumentUpdate: function (document_data) {
        // Generator.logDebug("onDocumentUpdate", "doc="+document_data.id)        
        SamplePlugin.stateUpdate(false, true, false)
    },
    stateUpdate: function(update_settings, update_documents, flush_updates) {
        Generator.logDebug("stateUpdate", "documents="+update_documents+", flush updates="+flush_updates)
        var update_all = !update_settings && !update_documents && !flush_updates // allow func to be called with no params to update all
        var state = SamplePlugin._state 
        state.server = SamplePlugin.APP_ID
        state.sessionid = SamplePlugin._sessionid
        state.plugindirectory = Generator.pluginGetHomeDirectory()
        state.isfirstrun = SamplePlugin._isfirstrun
        state.timestamp = Generator.pluginGetTimestamp()
        state.settings = SamplePlugin._settings
        state.scripts = SamplePlugin._scripts
        state.actions = SamplePlugin._actions
        // Generator.logDebug("stateUpdate", Generator.jsonEncode(state, true))

        SamplePlugin._stateUpdateDocuments(update_all || update_documents)
        if (SamplePlugin._stateUpdateTimer) {
            clearTimeout(SamplePlugin._stateUpdateTimer)
        }
        if (flush_updates) {
            SamplePlugin._handleRequestPollFinalize()
        } else {
            SamplePlugin._stateUpdateTimer = setTimeout(SamplePlugin._handleRequestPollFinalize, 150) // sometimets lots of update events happen in queue and we want to wait that all have happened
        }
    },
    _stateUpdateDocuments: function(updated) {
        if (updated) {
            var docs = {}
            var open_docs = Generator.documentGetAll() 
            // Generator.logDebug("_stateUpdateDocuments", "open_docs="+Generator.jsonEncode(open_docs, true, "_"))
            for (var doc_id in open_docs) {
                var doc = open_docs[doc_id]
                if (doc) {
                    docs[doc_id] = { id: doc_id, name: doc.name, url: doc._url, path: doc._path, isactive: Generator.documentIsActive(doc) }
                }
            }
            // Generator.logDebug("_stateUpdateDocuments", Generator.jsonEncode(docs, true))
            SamplePlugin._state.timestamp_documents = SamplePlugin._state.timestamp // already updated
            SamplePlugin._state.documents = docs // right now no filtering/copying but might need to add it later
        }
    },
    _handleRequestSuccess: function (response, body) {
        var data = (body || "").toString()
        Generator.logDebug("_handleRequestSuccess", "body length="+data.length)
        response.writeHead(200, "OK", {'Content-Type': 'text/plain', 'Content-Length': data.length })
        response.write(data)
        response.end()
    },
    _handleRequestError: function (response, status, message, body) {
        var data = (body || message || "").toString()
        response.writeHead(status, message, {'Content-Type': 'text/plain', 'Content-Length': data.length })
        response.write(data)
        response.end()
    },
    handleRequestDefault: function (operation, params, request, response) {
        return SamplePlugin._state
    },
    handleRequestPoll: function (operation, params, request, response) {
        // Generator.logDebug("handleRequestPoll", "timestamp_param="+params.timestamp+", timestamp_state="+SamplePlugin._state.timestamp)
        if (!params.timestamp || params.timestamp >= SamplePlugin._state.timestamp) {
            SamplePlugin._polls.push(response)
            if (!SamplePlugin._pollTimeout) {
                SamplePlugin._pollTimeout = setTimeout(SamplePlugin._handleRequestPollTimeout, SamplePlugin.POLL_TIMEOUT)
            }
            return null
        } else {
            return Generator.jsonEncode(SamplePlugin._state, true)
        }
    },
    _handleRequestFileStream: function (response, path) {
        var file_size = Generator.fileGetSize(path)
        if (file_size) {
            if (path.search(SamplePlugin.SUFFIX_IMAGE) > 0) {
                response.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': file_size})
            } else if (path.search(SamplePlugin.SUFFIX_AUDIO) > 0) {
                response.writeHead(200, {'Content-Type': 'audio/mpeg', 'Content-Length': file_size})
            } else if (path.search(SamplePlugin.SUFFIX_META) > 0) {
                response.writeHead(200, {'Content-Type': 'audio/mpeg', 'Content-Length': file_size})
            } else if (path.search(SamplePlugin.SUFFIX_CODE) > 0) {
                response.writeHead(200, {'Content-Type': 'audio/mpeg', 'Content-Length': file_size})
            } else {
                response.writeHead(200, {'Content-Type': 'application/octet-stream', 'Content-Length': file_size})
            } 
            var file_stream = Generator.fileGetReadStream(path)
            if (file_stream) {
                file_stream.pipe(response)
            }
        } else {
            SamplePlugin._handleRequestError(response, 403, "File not found: "+path)
        }
    },
    _handleRequestLayerStream: function (response, doc, layer) {
        var size = Generator.layerGetWidth(layer)*Generator.layerGetHeight(layer)*4 // dumm estimate of the output png size, http transfer will continue until end
        Generator.logDebug("_handleRequestLayerStream", "size="+size)
        response.writeHead(200, {'Content-Type': 'image/png'})
        Generator.pngStream(doc.id, layer, response)
    },
    _handleRequestPollTimeout: function() {
        SamplePlugin._pollTimeout = null // timeout triggered, don't try cancel is in _handleRequestPollFinalize
        SamplePlugin._handleRequestPollFinalize() 
    },
    _handleRequestPollFinalize: function() {
        if (SamplePlugin._pollTimeout) {
            clearTimeout(SamplePlugin._pollTimeout)
            SamplePlugin._pollTimeout = null
        }
        if (SamplePlugin._polls.length > 0) {
            var response_data = Generator.jsonEncode(SamplePlugin._state, true)
            // Generator.logDebug("_handleRequestPollFinalize", "")
            for (var i=0; i<SamplePlugin._polls.length; i++) {
                SamplePlugin._polls[i].end(response_data)    
            }
            SamplePlugin._polls = []
        }
    },
    _handleRequestDocumentOpen: function (path, response) {
        Generator.photoshopOpenDocument(path, 
            function (result) {
                if (result) {
                    result.url = "//"+result.name+"/"
                    result.path = path
                    result.isbusy = false
                    result.isenabled = false
                    response.writeHead(200, {'Content-Type': 'application/json' })
                    response.write(Generator.jsonEncode(result, true))
                    response.end()
                } else {
                    Generator.logDebug("_handleRequestDocumentOpen - photoshopOpenDocument error", "result="+result)
                    SamplePlugin._handleRequestError(response, 500, 'Unknown error opening file')
                }
            }, function () { SamplePlugin._handleRequestError(response, 500, 'Photoshop failed to open file') })
    },
    handleRequestDocuments: function (operation, params, request, response) {
        // Generator.logDebug("handleRequestDocuments", "params="+Generator.jsonEncode(params, true))
        // Generator.logDebug("handleRequestDocuments", "operation="+Generator.jsonEncode(operation, true))
        if (operation.id) { // request has a document id
            var doc = Generator.documentGetById(operation.id || "")
            if (!doc) {
                SamplePlugin._handleRequestError(response, 403, 'Document not found: '+operation.id) // no such doc
            } else {
                if (operation.method) { // there's a method to execute on the document
                    // Generator.logDebug("handleRequestDocuments", "request="+Generator.jsonEncode(request, true))
                    var result = false
                    if (operation.method == "activate") { // make this the active doc
                        result = SamplePlugin.documentSetActive(doc)

                    } else if (operation.method == "close") { // close this document
                        Generator.logDebug("onServerSetDocuments", "close doc_id="+doc._uid)
                        Generator.photoshopCloseDocument(doc._uid, false)
                        result = true
                    }
                    return '{"id":"'+doc._uid+'","operation":"'+operation.method+'","result":'+result+'}'
                } else {
                    SamplePlugin._handleRequestFileStream(response, doc._path)
                }
            }
        } else { // there's no doc id so either a request for a list or open
            if (request.method == "POST" || request.method == "PUT") { // 
                if (params.filepath && Generator.fileExists(params.filepath)) {
                    SamplePlugin._handleRequestDocumentOpen(params.filepath, response)
                } else {
                    SamplePlugin._handleRequestError(response, 403, 'File not found: '+params.path)
                }
            } else {
                return SamplePlugin._state.documents
            }
        }
    },  
    handleRequestLayercontent: function (operation, params, request, response) {
        // Generator.logDebug("handleRequestLayercontent", "params="+Generator.jsonEncode(params, true))
        Generator.logDebug("handleRequestLayercontent", "operation="+Generator.jsonEncode(operation, true))
        if (operation.id) { // request needs a document id and a layer id
            var doc = Generator.documentGetById(operation.id)
            if (!doc) {
                SamplePlugin._handleRequestError(response, 403, 'Document not found: '+operation.id) // no such doc
            } else {
                var layer = Generator.layerGetById(doc.id, operation.method || "")
                if (!layer) {
                    SamplePlugin._handleRequestError(response, 403, 'Layer not found: '+operation.method) // no such layer
                } else {
                    SamplePlugin._handleRequestLayerStream(response, doc, layer)
                }
            }
        } else {
            SamplePlugin._handleRequestError(response, 500, 'Layer id not defined!')
        }
    },  
    _parseLayerdata: function (doc, layer) {
        var children = []
        var i = 0
        var child = Generator.layerGetChildByIndex(layer, i)
        while (child) {
            children.push(child.id)
            i++
            child = Generator.layerGetChildByIndex(layer, i)
        }
        var layer_data = {
            id: layer.id,
            is_selected: layer == Generator.documentGetActiveLayer(doc),
            is_empty: Generator.layerIsEmpty(layer),
            children: children
        }
        if (!layer_data.is_empty) {
            layer_data.bounds = Generator.layerGetBounds(layer)
        }
        return layer_data
    },
    handleRequestLayerdata: function (operation, params, request, response) {
        // Generator.logDebug("handleRequestLayerdata", "params="+Generator.jsonEncode(params, true))
        // Generator.logDebug("handleRequestLayerdata", "operation="+Generator.jsonEncode(operation, true))
        if (operation.id) { // request needs a document id and a layer id
            var doc = Generator.documentGetById(operation.id)
            if (!doc) {
                SamplePlugin._handleRequestError(response, 403, 'Document not found: '+operation.id) // no such doc
            } else {
                var layer = doc // if no layer, the doc is "the layer"
                if (operation.method) {
                    layer = Generator.layerGetById(doc.id, operation.method)
                }
                if (!layer) {
                    SamplePlugin._handleRequestError(response, 403, 'Layer not found: '+operation.method) // no such layer
                } else {
                    return SamplePlugin._parseLayerdata(doc, layer)
                }
            }
        } else {
            SamplePlugin._handleRequestError(response, 500, 'Layer id not defined!')
        }
    },  
    documentSetActive: function (doc_or_url_or_id) {
        if (doc_or_url_or_id) {
            var doc = Generator.documentGetById(doc_or_url_or_id)
            if (doc && !Generator.documentIsActive(doc)) {
                Generator.photoshopSetActiveDocument(doc._uid)
                return true
            }
        }
        return false
    },

      
}

function init(generator, config) {
    process.nextTick(function () {
        SamplePlugin.initialize(generator, config)
        SamplePlugin.start()
    })
}

exports.init = init
