# Photoshop Generator Core

## Introduction
This is a wrapper module for Photoshop Generator, an Adobe Node.js based extension technology for Photoshop, which allows a real time updates and export of changes in a PSD-file.

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


## Sample Plugin
As an example there is simple Generator plugin that enables HTTP access to Photoshop:
- Documents (list, change active, close)
- Layer metadata (bounds, children, etc.)
- Layer content 
