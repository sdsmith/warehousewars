<?php
session_save_path("/student/smiths61/wwwsess/ww/");
session_start();

$state = &$_SESSION['state'];
$authenticated = &$_SESSION['authenticated'];
$user_name = &$_SESSION['user_name'];
$user_highscore = &$_SESSION['user_highscore'];

$errormessage = "";

$dbconn = NULL;


/* Open global connection to database */
function dbConnect() {
	global $dbconn;	
	if (!isset(dbconn)) {
		$dbconn = pg_connect("host=localhost dbname=smiths61 user=smiths61 password=59882") or die("Could not connect: " . pg_last_error());
	}
}

/* Close global connection to database */
function dbClose() {
	global $dbconn;
	if (isset($dbconn)) {
		pg_close($dbconn);
	}
}




// First visit
if (!isset($state)) {
	$state = "home_guest";
}

// Determine current state to serve content
switch ($state) {
	case "home_guest":
		// Homepage for unauthenticated user
		$view = "home.php";
		$authenticated = false;
		
		if 
		break;

	case "home_authenticated":
		// Homepage for authenticated user
		$view = "home.php";

		break;

	case "registration":
		// Registration page
		$view = "register.php";

		break;
}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>Warehouse Wars Online</title>
	</head>
	<body>
		<h1>Warehouse Wars Online</h1>
		<hr/>

		<?php include($view) ?>
	</body>
</html>


<?php
// This is 'just in case' code, to make sure that the database connection is
// always closed on page exit.
if (isset($dbconn)) {
	pg_close($dbconn);
}
?>
