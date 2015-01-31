<?php
/*
 * Main application front-end controller.
 */
session_save_path("/student/smiths61/wwwsess/ww/");
session_start();

require_once("/student/smiths61/www/ww/models/authentication.php");


// Get current request's action
$action = &$_POST['action'];

$errormessages = array();


$state = &$_SESSION['state'];
$action = &$_SESSION['action'];
$view = &$_SESSION['view'];


/*
 * Set the current view from the 'views' folder. Can include new state to set 
 * the system to with $new_state, and tell the system to reset the current 
 * action with reset_action.
 */
function set_view($new_view, $new_state=NULL, $reset_action=false) {
	global $view;
	global $action;
	global $state;
	$view = "views/" . $new_view;

	if (isset($state)) {
		set_state($new_state);
	}

	if ($reset_action) {
		$action = NULL;
	}
}

/*
 * Set the current system state.
 */
function set_state($new_state) {
	global $state;
	
	$state = $new_state;	
}

/*
 * Set current system action.
 */
function set_action($new_action) {
	global $action;
	
	$action = $new_action;
}

/*
 * Return html that displays all error messages in the errormessages array.
 */
function display_errormessages() {
	global $errormessages;
	$errormsgstring = "";

	if (!empty($errormessages)) {
		$errormsgstring .= "<div id='errormessages'>\n";

		foreach ($errormessages as $error) {
			$errormsgstring .= $error . "<br/>";
		}
		$errormsgstring .= "</div>";
	}
	
	return $errormsgstring;
}

/*
 * Causes the system to perform appropriate operations based on the current
 * state of the system. This takes into account authentication state, system
 * state, and system action.
 */
function actionController() {
	global $authenticated;
	global $state;
	global $action;
	global $view;

	// First visit
	if (!isset($state)) {
		set_state("home_guest");
	}

	// Determine current state to serve content
	switch ($state) {
		case "home_guest":
			echo "home_guest";
			// Homepage for unauthenticated user
			set_view("home.html");
			$authenticated = false;
		
			if ($action == "login") {
				echo "action: login";
				// User is logging in; check credentials against the database.
				$cred_username = $_POST['login_username'];
				$cred_password = $_POST['login_password'];
				$authed = authenticate_user($cred_username, $cred_password);

				if (login($cred_username, $cred_password)) {
					// Authenticate
					set_state("home_authenticated");
				}
			} elseif ($action == "register_user") {
				// Go to registration page
				set_view("register.html", "registration");
				actionController();
			}
			break;

		case "home_authenticated":
			echo "home_authenticated";
			// Homepage for authenticated user
			set_view("home.html");

			if ($action == "logout") {
				logout();
			}

			break;

		case "registration":
			echo "registration";
			// Registration page
			set_view("register.html");
		
			if ($action == "registration_submit") {
				$reg_username = &$_POST['reg_username'];
				$reg_email = &$_POST['reg_email'];
				$reg_password = &$_POST['reg_password'];
				$reg_confirm_password = &$_POST['reg_confirm_password'];

				if (register_newuser($reg_username, $reg_email, $password, $confirm_password)) {
					// Successfully registered new user
					// Bring user back to front page and pre-populate form
					set_view("home.html", "home_guest", true);
					$_POST['login_username'] = $reg_username;
					actionController();
				}

			} elseif ($action == "home") {
				// Sanity check: make sure user is not authenticated
				if ($authenticated) {
					die("Authenticated user was on the registration page");
				}

				set_view("home.html", "home_guest", true);
			}
			break;
	}
}


/* Action machine based on state and user input */
$action = $_POST['action'];
actionController();

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
