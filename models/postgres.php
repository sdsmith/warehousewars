<?php
/*
 * Postgres database interaction api.
 */


/*
 * Return a connection to the database.
 */
function dbConnect() {	
	$dbconn = pg_connect("host=localhost dbname=warehousewars_online user=wwo_tester password=tester");
	if ($dbconn) {
		return $dbconn;
	}
	die("Could not connect to database: " . pg_last_error());
}

/*
 * Close the given connection to the database. Return true ifsuccessful, false
 * otherwise.
 */
function dbClose($dbconn) {
	if (isset($dbconn)) {
		return pg_close($dbconn);
	} else {
		die("Error: attempted to close an unset connection - " . pg_last_error());
	}
}
?>
