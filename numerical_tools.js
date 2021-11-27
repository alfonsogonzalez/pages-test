/*

*/

d2r = Math.PI / 180.0;
r2d = 180.0 / Math.PI;

function add( v0, v1 ) {
	a = Array( v0.length );
	for ( var n = 0; n < v0.length; n++ ) {
		a[ n ] = v0[ n ] + v1[ n ];
	}
	return a;
}

function mult( v0, v1 ) {
	a = Array( v0.length );
	for ( var n = 0; n < v0.length; n++ ) {
		a[ n ] = v0[ n ] * v1[ n ];
	}
	return a;
}

function scale( v0, v1 ) {
	a = Array( v0.length );
	for ( var n = 0; n < v0.length; n++ ) {
		a[ n ] = v0[ n ] * v1;
	}
	return a;
}

function norm( v ) {
	sum = 0;
	for ( var n = 0; n < v.length; n++ ){
		sum += v[ n ] * v[ n ];
	}
	return Math.sqrt( sum );
}

function linspace( start, stop, n ) {
    var arr  = [];
    var step = ( stop - start ) / ( n - 1 );
    for ( var i = 0; i < n; i++ ) {
      arr.push( start + ( step * i ) );
    }
    return arr;
}

function Cx( a ) {
	sa = Math.sin( a );
	ca = Math.cos( a );
	return math.matrix( [ 
		[ 1,  0,   0 ],
		[ 0, ca, -sa ],
		[ 0, sa,  ca ]
	] )
}

function Cy( a ) {
	sa = Math.sin( a );
	ca = Math.cos( a );
	return math.matrix( [
		[  ca, 0, sa ],
		[   0, 1,  0 ],
		[ -sa, 0, ca ]
	] )
}

function Cz( a ) {
	sa = Math.sin( a );
	ca = Math.cos( a );
	return math.matrix( [ 
		[ ca, -sa, 0 ],
		[ sa,  ca, 0 ],
		[  0,   0, 1 ]
	] )
}
