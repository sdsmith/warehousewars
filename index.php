<?php
session_save_path("/student/smiths61/wwwsess/ww/");
session_start();

$state = &$_SESSION['state'];
$authenticated = &$_SESSION['authenticated'];
$user_name = &$_SESSION['user_name'];
$user_id = &$_SESSION['userid'];
$user_highscore = &$_SESSION['highscore'];

$dbconn = NULL;

$errormessage = array();


// NOTE(sdsmith): make sure to clear actions when switching views, 		
// otherwise unexpected redirects could occur.
// TODO(sdsmith): Write a function that you would call to change view. 
// Default behavior for func would be to wipe actions, unless optional 
// override was given.

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




// First visit
if (!isset($state)) {
	$state = "home_guest";
}


// Determine current state to serve content
$action = &$_POST['action'];
switch ($state) {
	case "home_guest":
		// Homepage for unauthenticated user
		$view = "home.php";
		$authenticated = false;
		
		if ($action == "login") {
			// User is logging in; check credentials against the database.
			$cred_username = $_POST['login_username'];
			$cred_password = $_POST['login_password'];

			dbConnect();
			// NOTE(sdsmith): Used delayed pg_prepare in future.
			$prepare_ret = pg_prepare($dbconn, "credential_check", 'SELECT * FROM appuser, appuser_passwords WHERE appuser.name = $1 and appuser_passwords.password = $2');
			if ($prepare_ret) {
				$resultobj = pg_execute($dbconn, "credential_check", array($cred_username, $cred_password));
				if ($resultobj) {
					$result_as_array = pg_fetch_array($resultobj);
					if ($result_as_array != false) {
						// There was a result, so we are authenticated.

						$autheduserdata = $result_as_array;

						// Sanity check: confirm there was only one credential match.
						if ($result_as_array = pg_fetch_array($result)) {
							$authenticated = false;
							die("Multiple user credential matches");
						}

						// Properly authenticated; do post authentication setup below
						$authenticated = true;
						$state = "home_authenticated";
						$user_id = $autheduserdata['id'];
						$user_name = $cred_username;
						$user_highscore = $autheduserdata['highscore'];
					} else {
						// Did not authenticate
						$errormessage[] = "Invalid Credentials";
					}
				} else {
					die("Query failed: " . pg_last_error());
				}
			} else {
				die("Prepared statement failed: " . pg_last_error());
			}

			dbClose();
			break;

		} elseif ($action == "register_user") {
			// NOTE(sdsmith): this relies on it falling through.
			// TODO(sdsmith): make determin state function and call it when new state needs to be decoded.
			$view = "register.php";
			$state = "registration";
			$action = "";
		}

	case "home_authenticated":
		// Homepage for authenticated user
		$view = "home.php";

		if ($action == "logout") {
			$authenticated = false;
			session_destroy();
			$state = "home_guest";
		}

		break;

	case "registration":
		// Registration page
		$view = "register.php";
		
		if ($action == "registration_submit") {
			// Perform check of registration data; if valid, insert into db
			$reg_username = &$_POST['reg_username'];
			$reg_email = &$_POST['reg_email'];
			$reg_password = &$_POST['reg_password'];
			$reg_confirm_password = &$_POST['reg_confirm_password'];

			dbConnect();
			pg_prepare($dbconn, "check_username_existance", 'SELECT * FROM appuser WHERE name = $1');
			pg_prepare($dbconn, "check_email_existance", 'SELECT * FROM appuser WHERE email = $1');
			pg_prepare($dbconn, "insert_new_user", 'INSERT INTO appuser (name, email, joindate, validated, lastlogin, highscore) VALUES ($1, $2, $3, false, $3, 0); INSERT INTO appuser_passwords (userid, password) VALUES ((SELECT id FROM appuser WHERE name = $1 AND email = $2), $4');
			
			// TODO(sdsmith): Run check_user_info_existance to make sure 	
			// there are no results. If their are, determine what is 		
			// incorrect and tell the user. If there are no matches, insert
			// new user into database and redirect to login page with 
			// username filled in.
			$resultobj_username = pg_execute($dbconn, "check_username_existance", array($reg_username));
			$resultobj_email = pg_execute($dbconn, "check_email_existance", array($reg_email));

			$validated = true;
			// Check if username exists in db
			if (!empty($reg_username)) {
				if (pg_fetch_array($resultobj_username)) {
					$errormessage[] = "Username exists";
					$validated = false;
				}
			} else {
				$errormessage[] = "Must have a username";
				$validated = false;
			}

			// Check if email exists in db
			if (!empty($reg_email)) {
				if (pg_fetch_array($resultobj_email)) {
					$errormessage[] = "Email exists";
					$validated = false;
				}
			} else {
				$errormessage[] = "Must have an email";
				$validated = false;
			}

			// Check if passwords match
			if (!empty($reg_password) and !empty($reg_confirm_password)) {
				if ($reg_password !== $reg_confirm_password) {
					$errormessage[] = "Passwords do not match";
					$validated = false;
				}
			} else {
				$errormessage[] = "Must have confirmed password";
				$validated = false;
			}
			
			if ($validated) {
				// Registration information is valid
				$timestamp = date('Y-m-d H:i:s');

				pg_execute($dbconn, "insert_new_user", array($reg_username, $reg_email, $timestamp, $reg_password));

				// Bring user back to front page and pre-populate form
				$view = "home.php";
				$state = "home_guest";
				$_POST['login_username'] = $reg_username;
				$action = "";
			}

			dbClose();

		} elseif ($action == "home") {
			$view = "home.php";
			$action = "";
		}

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

		<?php if (!empty($errormessage)) : ?>
		<div id='errormessage'>
			<?php 
			foreach ($errormessage as $error) {
				echo $error . "<br/>";
			}
			?>
		</div>
		<?php endif ?>

		<?php include($view) ?>

	</body>
</html>
