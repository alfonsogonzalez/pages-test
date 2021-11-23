//sdfsdf
//
document.getElementById( "propagate_button" ).addEventListener( "click", propagate_orbit );

const MU = 398600.0;

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

/*
function rk4_step( f, t, y, h ) {
	k1 = f( t, y )
	k2 = f( t + 0.5 * h, add( y, scale( k1, 0.5 * h )
	k3 = f( t + 0.5 * h, add( y, scale( k2, 0.5 * h  )
	k4 = f( t +       h, add( y, scale( k3, h )

	return y + h / 6.0 * ( k1 + 2 * k2 + 2 * k3 + k4 )
}
*/

function norm( v ) {
	sum = 0;
	for ( var n = 0; n < v.length; n++ ){
		sum += v[ n ] * v[ n ];
	}
	return Math.sqrt( sum );
}

function euler_step( f, t, y, h ) {
	dy = f( t, y );
	return add( y, scale( dy, h ) );
}

function two_body_ode( t, y ) {
	r = y.slice( 0, 3 );
	a = scale( r, -MU / Math.pow( norm( r ), 3 ) );
	return [ y[ 3 ], y[ 4 ], y[ 5 ], a[ 0 ], a[ 1 ], a[ 2 ] ];
}

const dt = 1;
const total_time = 15000;
const n_steps    = total_time / dt;
const maxval     = 9000;

function propagate_orbit() {

	rx = parseFloat( document.getElementById( "rx" ).value );
	ry = parseFloat( document.getElementById( "ry" ).value );
	rz = parseFloat( document.getElementById( "rz" ).value );
	vx = parseFloat( document.getElementById( "vx" ).value );
	vy = parseFloat( document.getElementById( "vy" ).value );
	vz = parseFloat( document.getElementById( "vz" ).value );

	console.log( rx, ry, rz, vx, vy, vz );

	states = Array( n_steps ).fill( Array( 6 ) );
	states[ 0 ] = [ rx, ry, rz, vx, vy, vz ];
	rx = Array( n_steps );
	ry = Array( n_steps );
	rz = Array( n_steps );

	for ( var n = 1; n < n_steps; n++ ) {
		states[ n ] = euler_step( two_body_ode, n, states[ n - 1 ], dt );
		rx[ n ] = states[ n ][ 0 ];
		ry[ n ] = states[ n ][ 1 ];
		rz[ n ] = states[ n ][ 2 ];
	}

	var trace1 = {
	  x: rx,
	  y: ry,
	  z: rz,
	  mode: 'lines',
	  marker: {
	    color: '#1f77b4',
	    size: 12,
	    symbol: 'circle',
	    line: {
	      color: 'rgb(0,0,0)',
	      width: 0
	    }},
	  line: {
	    color: '#1f77b4',
	    width: 4
	  },
	  type: 'scatter3d'
	};

	var layout = {
	  title: '3D Line Plot',
	  autosize: false,
	  width: 500,
	  height: 500,
	  bgcolor: ( 0, 0, 0 ),
	  margin: {
	    l: 0,
	    r: 0,
	    b: 0,
	    t: 65
	  },
	  plot_bgcolor: "black",
	  paper_bgcolor: "#0000",
	  scene: {
		  xaxis: { range: [ -maxval, maxval ] },
		  yaxis: { range: [ -maxval, maxval ] },
		  zaxis: { range: [ -maxval, maxval ] },
		  aspectratio: { x: 1, y: 1, z: 1 }
	}
	};

Plotly.newPlot( 'tester', [ trace1 ], layout );

}

propagate_orbit();
