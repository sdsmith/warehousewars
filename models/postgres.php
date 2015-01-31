<?php
/*
 * Postgres database interaction api.
 */

$dbconn = NULL;


function dbConnect() {
	global $dbconn;	
	if (!isset($dbconn)) {
		$dbconn = pg_connect("host=localhost dbname=smiths61 user=smiths61 password=59882") or die("Could not connect: " . pg_last_error());
	}
}

function dbClose() {
	global $dbconn;
	if (isset($dbconn)) {
		pg_close($dbconn);
	}
}
?>
