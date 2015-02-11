<?php

require_once(dirname(__FILE__) . "/postgres.php");
require_once(dirname(__FILE__) . "/inputvalidation.php");

/*
 * Return true if the given username is valid for registering an account.
 */
function validate_registration_username($username) {
	global $errormessages;
	$validated = true;

	$dbconn = dbConnect();	
	pg_prepare($dbconn, "check_username_existance", 'SELECT * FROM appuser WHERE name = $1');

	// Check if empty
	if (!empty($username)) {
		// Whitelist input
		if (whitelist_input($username, MIN_LEN_USERNAME, MAX_LEN_USERNAME)) {
			// Check if username exists in db
			$resultobj_username = pg_execute($dbconn, "check_username_existance", array($username));
			if (pg_fetch_array($resultobj_username)) {
				$errormessages[] = "Username exists";
				$validated = false;
			}
		} else {
			$errormessages[] = "Enter a username between " .  MIN_LEN_USERNAME . " and " .  MAX_LEN_USERNAME . " alpha-numeric characters";
			$validated = false;
		}
	} else {
		$errormessages[] = "Must have a username";
		$validated = false;
	}	
	
	dbClose($dbconn);
	return $validated;
}

/*
 * Return true if the given email is valid for registering an account.
 */
function validate_registration_email($email) {
	global $errormessages;
	$validated = true;

	$dbconn = dbConnect();
	pg_prepare($dbconn, "check_email_existance", 'SELECT * FROM appuser WHERE email = $1');

	// Check if empty
	if (!empty($email)) {
		// Whitelist input
		if (whitelist_input($email, MIN_LEN_EMAIL, MAX_LEN_EMAIL)) {
			// Check if email exists in db
			$resultobj_email = pg_execute($dbconn, "check_email_existance", array($email));
			if (pg_fetch_array($resultobj_email)) {
				$errormessages[] = "Email exists";
				$validated = false;
			}
		} else {
			$errormessages[] = "Enter an email between " .  MIN_LEN_EMAIL . " and " .  MAX_LEN_EMAIL . " characters";
			$validated = false;
		}
	} else {
		$errormessages[] = "Must have an email";
		$validated = false;
	}

	dbClose($dbconn);
	return $validated;
}

/*
 * Return tru if the given password is valid for registering an account.
 */
function validate_registration_password($password, $confirm_password) {
	global $errormessages;
	$validated = true;

	// Password
	if (!empty($password) and !empty($confirm_password)) {		
		// Check if passwords match
		if ($password !== $confirm_password) {
			$errormessages[] = "Passwords do not match";
			$validated = false;
		} else {
			// Whitelist input (same password, only need to check one)
			if (!whitelist_input($password, MIN_LEN_PASSWORD, MAX_LEN_PASSWORD)) {
				$errormessages[] = "Enter a password between " .  MIN_LEN_PASSWORD . " and " .  MAX_LEN_PASSWORD . " alpha-numeric characters";
				$validated = false;
			}
		}
	} else {
		$errormessages[] = "Must have confirmed password";
		$validated = false;
	}

	return $validated;
}


/*
 * Validates the registration information and sets the appropriate error
 * messages. Return true on successful validation, false otherwise.
 */
function validate_registration_info($username, $email, $password, $confirm_password) {
	$valid_username = validate_registration_username($username);
	$valid_email = validate_registration_email($email);
	$valid_password = validate_registration_password($password, $confirm_password);

	return $validated;
}


/*
 * Insert user into the database. Return true on successful insert, false otherwise.
 */
function register_newuser($username, $email, $password, $confirm_password) {
	global $errormessages;
	$insert_status = false;

	$valid = validate_registration_info($username, $email, $password, $confirm_password);

	$dbconn = dbConnect();	
	pg_prepare($dbconn, "insert_user_info", 'INSERT INTO appuser (name, email, joindate, validated, lastlogin, highscore) VALUES ($1, $2, $3, false, $4, 0)');
	pg_prepare($dbconn, "insert_user_password", 'INSERT INTO appuser_passwords (userid, password) VALUES ((SELECT id FROM appuser WHERE name = $1 AND email = $2), $3)');

	if ($valid) {
		// Registration information is valid
		$timestamp = date('Y-m-d H:i:s');

		$result = pg_execute($dbconn, "insert_user_info", array($username, $email, $timestamp, $timestamp));
		if ($result) {
			$result = pg_execute($dbconn, "insert_user_password", array($username, $email, $password));
			if ($result) {
				$insert_status = true;
			} else {
				$errormessages[] = "Could not insert password into appuser_password: " . pg_last_error();
				// TODO(sdsmith): unroll the initial successful insert.
			}
		} else {
			$errormessages[] = "Could not insert user into appuser: " . pg_last_error();
		}
	}

	dbClose($dbconn);
	return $insert_status;
}

?>
