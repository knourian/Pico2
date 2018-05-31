var fs = require( 'fs' )
var struggle = fs.readFileSync( __dirname + '/struggle.txt', 'utf-8' )

console.log( mirror(struggle, 45, true ) );
console.log( '--------------------' );
console.log( mirror(struggle, 90, false ) );

function mirror( str, gap, keep ) {

  var lines = str.split( '\n' )
  var longest = 0
    
  lines.forEach(function( line ) {
    if ( longest < line.length ) longest = line.length
  })

  lines.forEach( function( line, i ) {

    var delta = longest - line.length + gap
    var fill = ' '
    var mirrored
    
    while( delta ) { line += fill; delta--; }

    mirrored = line.split( '' ).reverse().join( '' )
    
    if ( keep ) {

      lines[ i ] = line + mirrored

    } else {

      delta = line.length;
      while( delta ) { line = fill + mirrored; delta--; }
      lines[ i ] = mirrored
      
    }

  } )

  return lines.join( '\n' )
}