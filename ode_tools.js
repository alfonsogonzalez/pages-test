

function euler_step( f, t, y, h ) {
	dy = f( t, y );
	return add( y, scale( dy, h ) );
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
