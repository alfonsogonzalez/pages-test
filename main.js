//sdfsdf
//
document.getElementById( "propagate_button" ).addEventListener( "click", propagate_orbits );

const N_STATE_VECTOR_INPUTS = 2;
const N_COES_INPUTS         = 2;
const N_TOTAL_ORBITS        = N_STATE_VECTOR_INPUTS + N_COES_INPUTS;
const COLORS                = [ 'magenta', 'cyan', 'lime', 'red' ];
const BASIS_VECTORS_SCALE   = 2.0;
const MAX_VAL_SCALE         = 2.5;

function make_basis_vectors( radius ) {
	return [
		{
			x: [ 0, radius * BASIS_VECTORS_SCALE ], y: [ 0, 0 ], z: [ 0, 0 ],
			mode: 'lines+markers', line: { color: 'white', width: 5 },
			type: 'scatter3d', marker: { size: 5, color: 'red' }, name: 'X'
		},
		{
			x: [ 0, 0 ], y: [ 0, radius * BASIS_VECTORS_SCALE ], z: [ 0, 0 ],
			mode: 'lines+markers', line: { color: 'white', width: 5 },
			type: 'scatter3d', marker: { size: 5, color: 'green' }, name: 'Y'
		},
		{
			x: [ 0, 0 ], y: [ 0, 0 ], z: [ 0, radius * BASIS_VECTORS_SCALE ],
			mode: 'lines+markers', line: { color: 'white', width: 5 },
			type: 'scatter3d', marker: { size: 5, color: 'blue' }, name: 'Z'
		}
	]
}

function make_sphere( radius ) {
	xx    = [];
	yy    = [];
	zz    = [];
	phi   = linspace( 0,     Math.PI / 2, 15 );  
	theta = linspace( 0, 2 * Math.PI,     15 ); 

	for ( i = 0; i < theta.length; i++ ) {
	    for ( j = 0; j < phi.length; j++ ){
	        xx.push( Math.cos( theta[ i ] ) * Math.sin( phi[ j ] ) );
	        yy.push( Math.sin( theta[ i ] ) * Math.sin( phi[ j ] ) );   
	        zz.push( Math.cos( phi[ j ] ) );
	    }
	}
	xx = scale( xx, radius );
	yy = scale( yy, radius );
	zz = scale( zz, radius );

	const dataitem = {
	    x: xx, y: yy, z: zz,
	    opacity: 0.5,
	    color  : 'blue',
	    type   : 'mesh3d',
	}
	var data = [
	    dataitem,
	    { ...dataitem, z: zz.map( v => -v ) }
	];
	return data;
}

function make_trace( states, n, max_val ) {
	rx      = states.map( function( a ){ return a[ 0 ] } );
	ry      = states.map( function( a ){ return a[ 1 ] } );
	rz      = states.map( function( a ){ return a[ 2 ] } );
	max_x   = Math.max( ...rx.map( a => Math.abs( a ) ) );
	max_y   = Math.max( ...ry.map( a => Math.abs( a ) ) );
	max_z   = Math.max( ...rz.map( a => Math.abs( a ) ) );
	max_val = Math.max( max_x, max_y, max_z, max_val );

	return [ {
	  x     : rx, y : ry, z : rz,
	  mode  : 'lines',
	  line  : {
	    color: COLORS[ n ],
	    width: 4
	  },
	  type: 'scatter3d',
	  name: 'Orbit ' + n
	}, max_val ];
}

function propagate_orbits() {
	let states_list  = [];
	let traces       = [];
	let max_val      = 0;
	let n_orbit      = 0;
	let idxs         = [];

	for( var n = 0; n < N_STATE_VECTOR_INPUTS; n++ ) {
		if ( document.getElementById( 'active' + n ).checked ) {
			rx = parseFloat( document.getElementById( "rx" + n ).value );
			ry = parseFloat( document.getElementById( "ry" + n ).value );
			rz = parseFloat( document.getElementById( "rz" + n ).value );
			vx = parseFloat( document.getElementById( "vx" + n ).value );
			vy = parseFloat( document.getElementById( "vy" + n ).value );
			vz = parseFloat( document.getElementById( "vz" + n ).value );
			dt = parseFloat( document.getElementById( "dt" + n ).value );
			state  = [ rx, ry, rz, vx, vy, vz ];
			tspan  = state2period( state ) *
				parseFloat( document.getElementById( "sim-time" + n ).value );
			states_list.push( propagate_orbit( state, tspan, dt, MU ) );
			idxs.push( n_orbit );
		}
		n_orbit++;
	}

	for( var n = 0; n < N_COES_INPUTS; n++ ) {
		if ( document.getElementById( 'active-k' + n ).checked ) {
			sma   = parseFloat( document.getElementById( "sma"  + n ).value );
			ecc   = parseFloat( document.getElementById( "ecc"  + n ).value );
			inc   = parseFloat( document.getElementById( "inc"  + n ).value );
			ta    = parseFloat( document.getElementById( "ta"   + n ).value );
			aop   = parseFloat( document.getElementById( "aop"  + n ).value );
			raan  = parseFloat( document.getElementById( "raan" + n ).value );
			dt    = parseFloat( document.getElementById( "dt-k" + n ).value );
			state = coes2state( [ sma, ecc, inc * d2r, ta * d2r, aop * d2r, raan * d2r ] );
			tspan = state2period( state.valueOf() ) *
				parseFloat( document.getElementById( "sim-time-k" + n ).value );
			states_list.push( propagate_orbit( state, tspan, dt, MU ) );
			idxs.push( n_orbit );
		}
		n_orbit++;
	}

	for( var n = 0; n < idxs.length; n++ ) {
		vals    = make_trace( states_list[ n ], idxs[ n ], max_val );
		max_val = Math.max( max_val, vals[ 1 ] );
		traces.push( vals[ 0 ] );
	}
	max_val      *= MAX_VAL_SCALE;
	sphere_data   = make_sphere( 6378.0 );
	basis_vectors = make_basis_vectors( 6378.0 );
	traces.push( sphere_data[ 0 ] );
	traces.push( sphere_data[ 1 ] );
	traces.push( basis_vectors[ 0 ] );
	traces.push( basis_vectors[ 1 ] );
	traces.push( basis_vectors[ 2 ] );

	var layout = {
	  title        : 'Orbits',
	  autosize     : false,
	  width        : 500,
	  height       : 500,
	  bgcolor      : ( 0, 0, 0 ),
	  margin       : { l: 0, r: 0, b: 0, t: 65 },
	  plot_bgcolor : "black",
	  paper_bgcolor: "#0000",
	  scene        : {
		  xaxis: { range: [ -max_val, max_val ] },
		  yaxis: { range: [ -max_val, max_val ] },
		  zaxis: { range: [ -max_val, max_val ] },
		  aspectratio: { x: 1, y: 1, z: 1 }
		}
	};
	Plotly.newPlot( 'plot-3d', traces, layout );
}

propagate_orbits();
