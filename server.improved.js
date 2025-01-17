const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'model': 'toyota', 'year': 1999, 'mileage': 205724},
  { 'model': 'dodge', 'year': 2004, 'mileage': 172057 },
  { 'model': 'ford', 'year': 1987, 'mileage': 299690} 
]


const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/'  || request.url === "/?" ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    // ... do something with the data here!!!
    var inD =  JSON.parse( dataString ) 
    console.log(inD)
    if(inD.action === "add"){
      nC = {model: inD.model, year: inD.year, mileage: inD.mileage}
      appdata.push(nC)
    }
    console.log(appdata)
    if(inD.action === "delete"){
      const trashBin = appdata.splice(inD.index, 1)
    }
    theYear = new Date().getFullYear()
    for(k = 0; k<appdata.length; k++){
      appdata[k].milesPerYear = parseInt(appdata[k].mileage / (theYear - appdata[k].year))
    }
    console.log(appdata)
    var rb = JSON.stringify(appdata)
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(rb)
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
