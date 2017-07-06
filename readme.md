# Photoshop Generator Core

## Introduction
This is a wrapper module for Photoshop Generator, an Adobe Node.js based extension technology for Photoshop, which allows a real time updates and export of changes in a PSD-file.

For more information about creatin Photoshop plugins see
https://github.com/adobe-photoshop/generator-core/wiki/JSON-event-format

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

## API Documentation
Photoshop Generator Core offers the following method collections for interacting with Photoshop
- [**plugin**](http://htmlpreview.github.com/?https://github.com/RationalMatta/photoshop-generator-core/blob/master/documentation/module-plugin.html)
- [**plugin**](documentation#module-plugin)


## Sample Plugin
As an example there is simple Generator plugin that enables HTTP access to Photoshop:
- Open documents (list, change active, close)
- Layer metadata (bounds, children, etc.)
- Layer content 

To deploy the sample plugin 
1) Save generator_sample.js in a new folder 
2) Install the module in the folder ('npm install photoshop-generator-core')
3) Copy folder to $Photoshop/Plug-ins/Generator
4) Start Photoshop and open a document
5) Open http://localhost:8083/ in a browser


