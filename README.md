# Photoshop Generator Core

## Introduction
This is a wrapper module for Photoshop Generator, an Adobe Node.js based extension technology for Photoshop, which allows a real time updates and export of changes in a PSD-file.

For more information about creating Photoshop plugins see
https://github.com/adobe-photoshop/generator-core

Package photoshop-generator-core functions as a wrapper for the Generator APIs delivering
- An abstraction for the internal data types 
- Cache and an easy access for layer data
- Extendible HTTP server for communicating with Photoshop panels, local apps and cloud services
- Convenience functions for accssing e.g.
  - Layer data
  - Layer changes
  - Files and directories
  - Photoshop
  - Operating system
  - HTTP methods

## Documentation
Photoshop Generator Core offers the following method collections for interacting with Photoshop
- [**plugin**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_plugin): configure and manage plugin
- [**photoshop**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_photoshop): interact with Photoshop
- [**layer**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_layer): access Photoshop layers
- [**document**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_document): access Photoshop documents
- [**delta**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_delta): helper functions for testing what changes have occured
- [**server**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_server): create a local webserver to interact with Photoshop panels 
- [**file**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_file): access filesystem files
- [**directory**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_directory): access filesystem directories
- [**http**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_http): make http requests
- [**system**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_system): access operating system 
- [**json**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_json): JSON encode/decode
- [**log**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_log): logging
- [**png**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_png): export layer content as PNG's 
- [**util**](https://github.com/RationalMatta/photoshop-generator-core/tree/master/documentation#module_util): utility functions

## Sample Plugin
There is sample Generator plugin about using photoshop-generator-core that enables HTTP access to Photoshop:
- Github: https://github.com/RationalMatta/photoshop-generator-sample
- NPM: https://www.npmjs.com/package/photoshop-generator-sample

## Changelog
### v4.2.2
- Fixed layer order management. Photoshop sometimes skips index change events and its detected and document data refetched when it happens
- Added layerGetDepth

### v4.1.3
- New methods layerGetNextLayer and layerGetPreviousLayer for finding the next/previous entry in the layer list
- Cleaned up debug printing
- Fixed layerdata indexing (e.g. used by layerGetByIndex)

### v4.01
V4.0.1 is a backwards incompatible change to v3.x and will require code changes
- Changed the format of the serverSetRequestHandler callback to support body data and different kinds API structures. The new callback gets following parameters:
 - Path: Array of strings of the request path split by '/'
 - Params: Object of the URL-parameters
 - Body: HTTP body data
 - Request: http.ClientRequest Node-object
 - Response: http.ServerResponse Node-object
- Changed layer UID-format from the simple "DOC_ID:LAYER_ID" to a proper URNs "document:DOC_ID" and "layer:DOC_ID:LAYER_ID"
