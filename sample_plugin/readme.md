# Photoshop Generator Sample
This is a sample Photoshop Generator plugin that uses photoshop-generator-core node module that enables HTTP access to Photoshop:
- Open documents (list, change active, close)
- Layer metadata (bounds, children, etc.)
- Layer content 

To deploy the sample plugin 
1) Save generator_sample.js in a new folder 
2) Install the module in the folder ('npm install photoshop-generator-core')
3) Copy folder to $Photoshop/Plug-ins/Generator
4) Start Photoshop and open a document
5) Open http://localhost:8083/ in a browser