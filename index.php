<?php
session_save_path("/student/smiths61/wwwsess/ww/");
session_start();

$state = &$_SESSION['state'];
$authenticated = &$_SESSION['authenticated'];
$user_name = &$_SESSION['user_name'];
$user_highscore = &$_SESSION['user_highscore'];

$errormessage = "";

$dbconn = NULL;

function dbconnect() {
	return $connection = pg_connect("host=localhost dbname=smiths61 user=smiths61 password=59882") or die("Could not connect: " . pg_last_error());
}



// First visit
if (!isset($state)) {
	$state = "home_guest";
}

// NOTE(sdsmith): make sure to set the dbconn variable when required
//in the state setup. May want to change this behavior. (initial 
// reasoning was maximize connection use.

// Determine current state to serve content
switch ($state) {
	case "home_guest":
		// Homepage for unauthenticated user
		$view = "home.php";
		$authenticated = false;

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
if (isset($dbconn)) {
	pg_close($dbconn);
}
