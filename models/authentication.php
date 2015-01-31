<?php
require_once "postgres.php";

/* Library provided globals */
$authenticated = &$_SESSION['authenticated'];

/* Session variables set on successful login */
$user_name = &$_SESSION['username'];
$user_id = &$_SESSION['userid'];
$user_highscore = &$_SESSION['highscore'];

/*
 * Authenticates the given user/password with the database. Return array of
 * user data from 'appuser' corresponding to the authenticated user, or false
 * on fail.
 */
function authenticate_user($username, $password) {
	dbConnect();
	// NOTE(sdsmith): Used delayed pg_prepare in future.
	$prepare_ret = pg_prepare($dbconn, "credential_check", 'SELECT * FROM appuser, appuser_passwords WHERE appuser.name = $1 and appuser_passwords.password = $2');
	if ($prepare_ret) {
		$resultobj = pg_execute($dbconn, "credential_check", array($username, $password));
		if ($resultobj) {
			$result_as_array = pg_fetch_array($resultobj);
			if ($result_as_array != false) {
				// There was a result, so we are authenticated.
				$autheduserdata = $result_as_array;

				// Sanity check: confirm there was only one credential match.
				if ($result_as_array = pg_fetch_array($result)) {
					die("Multiple user credential matches");
				}

				// Properly authenticated
				return $autheduserdata;

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

	return false;
}


/*
 * Attempts to log user into the application. If success, populates the session
 * with data regarding that specific user. Return true if succeeded, false ow.
 */
function login($username, $password) {
	global $authenticated;

	$authed = authenticate_user($username, $password);
	if ($authed) {
		$user_name = $cred_username;
		$user_id = $authed['id'];
		$user_highscore = $authed['highscore'];
		$authenticated = true;
	}
	
	return $authenticated;
}


/*
 * Log user out of the application by destroying session information. Return 
 * true if logout was a success, false otherwise.
 */
function logout() {
	return session_destory();
}
?>
