<?php
/*
 * Main application front-end controller.
 */
define("APP_ROOT_PATH", dirname(__FILE__));
session_save_path(APP_ROOT_PATH . "/sess");
session_start();


require_once(APP_ROOT_PATH . "/models/authentication.php");
require_once(APP_ROOT_PATH . "/models/register.php");
require_once(APP_ROOT_PATH . "/models/inputvalidation.php");
require_once(APP_ROOT_PATH . "/models/gamestats.php");

// Get current request's action
$action = &$_POST['action'];

$errormessages = array();

$state = &$_SESSION['state'];
$action = &$_SESSION['action'];
$view = &$_SESSION['view'];


// TODO(sdsmith): Each state of the machine can be associated with a view.
// Eventually refactor the system to just require state change where the view
// associated with it will be defined in a config file.


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

	if (isset($new_state)) {
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
		$errormsgstring = "<div id=\"errormessages\">\n";

		foreach ($errormessages as $error) {
			$errormsgstring .= $error . "<br/>\n";
		}
		$errormsgstring .= "</div>\n";
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
	global $errormessages;

	// First visit
	if (!isset($state)) {
		set_state("home_guest");
	}


	// Determine current state to serve content
	switch ($state) {
		case "home_guest":
			// Homepage for unauthenticated user
			set_view("home_guest.html");
			$authenticated = false;
			
			// TODO(sdsmith): FOR TESTING ONLY
			set_view("ww.html");
			$authenticated = true;
			break;
			//////////////////////////////////

			if ($action == "login") {
				// User is logging in; check credentials against the database.
				$cred_username = $_POST['login_username'];
				$cred_password = $_POST['login_password'];
				
				// Validate input
				if (whitelist_input($cred_username) and whitelist_input($cred_password)) {
					if (login($cred_username, $cred_password)) {
						// Authenticate
						set_view("home.html", "home_authenticated");
					}
				} else {
					$_POST['login_username'] = "";
					$errormessages[] = "Please enter alpha-numeric characters only.";
				}
			} elseif ($action == "register_user") {
				// Go to registration page
				set_view("register.html", "registration");
			}
			break;

		case "registration":
			// Registration page
			set_view("register.html");

			if ($action == "registration_submit") {
				$reg_username = &$_POST['reg_username'];
				$reg_email = &$_POST['reg_email'];
				$reg_password = &$_POST['reg_password'];
				$reg_confirm_password = &$_POST['reg_confirm_password'];
				
				if (register_newuser($reg_username, $reg_email, $reg_password, $reg_confirm_password)) {
					// Successfully registered new user
					// Bring user back to front page and pre-populate form
					set_view("home_guest.html", "home_guest", true);
					$_POST['login_username'] = $reg_username;
				}

			} elseif ($action == "home") {
				// Sanity check: make sure user is not authenticated
				if ($authenticated) {
					die("Authenticated user was on the registration page");
				}

				set_view("home_guest.html", "home_guest", true);
			}
			break;

		case "home_authenticated":
			// Homepage for authenticated user
			set_view("home.html");

			if (!$authenticated) {
				die("Unauthenticated user on authenticated only page");
			}

			if ($action == "logout") {
				logout();
				set_view("home_guest.html", "home_guest");
			} elseif ($action == "play_warehouse_wars") {
				set_view("ww.html", "warehouse_wars");
			} elseif ($action == "settings") {
				set_view("settings.html", "settings");
			}

			break;

		case "settings":
			set_view("settings.html");

			if (!$authenticated) {
				die("Unauthenticated user on authenticated only page");
			}

			if ($action == "settings_submit") {
				// TODO(sdsmith): confirm inputs and update database if valid.
			} elseif ($action == "home") {
				set_view("home.html", "home_authenticated");
			}

			break;

		case "warehouse_wars":
			// Page for playing warehouse wars
			set_view("ww.html");
			
			if (!$authenticated) {
				die("Unauthenticated user on authenticated only page");
			}

			if ($action == "home") {
				set_view("home.html", "home_authenticated");
			} elseif ($action == "gamestats_submit") {
				// Game statistics are being submitted
				// Use gamestats.php to handle input.
				$score = $_POST['gamestats_score'];
				$kills = $_POST['gamestats_kills'];
				$deaths = $_POST['gamestats_deaths'];
				$steps = $_POST['gamestats_steps'];
				$maxlevel = 0;

				// Insert game results into the database
				insert_gamestats($_SESSION['userid'], $score, $maxlevel, $kills, $deaths, $steps);

				// Update user's highscore if necessary
				if ($score > $_SESSION['highscore']) {
					update_user_highscore($_SESSION['userid'], $score);
					$_SESSION['highscore'] = $score;
				}
			}

			break;
	}
}


/* MAIN { */
/* Action machine based on state and user input */
$action = $_POST['action'];
actionController();
/* } */

?>

<?php include($view) ?>



