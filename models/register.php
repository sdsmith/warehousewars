<?php

require_once("/student/smiths61/www/ww/models/postgres.php");


/*
 * Validates the registration information and sets the appropriate error
 * messages. Return true on successful validation, false otherwise.
 */
function validate_registration_info($username, $email, $password, $confirm_password) {
	global $errormessages;
	$dbconn = dbConnect();
	
	pg_prepare($dbconn, "check_username_existance", 'SELECT * FROM appuser WHERE name = $1');
	pg_prepare($dbconn, "check_email_existance", 'SELECT * FROM appuser WHERE email = $1');
	

	$validated = true;
	// Check if username exists in db
	if (!empty($username)) {
		$resultobj_username = pg_execute($dbconn, "check_username_existance", array($username));
		if (pg_fetch_array($resultobj_username)) {
			$errormessages[] = "Username exists";
			$validated = false;
		}
	} else {
		$errormessages[] = "Must have a username";
		$validated = false;
	}

	// Check if email exists in db
	if (!empty($email)) {
		$resultobj_email = pg_execute($dbconn, "check_email_existance", array($email));
		if (pg_fetch_array($resultobj_email)) {
			$errormessages[] = "Email exists";
			$validated = false;
		}
	} else {
		$errormessages[] = "Must have an email";
		$validated = false;
	}

	// Check if passwords match
	if (!empty($password) and !empty($confirm_password)) {
		if ($password !== $confirm_password) {
			$errormessages[] = "Passwords do not match";
			$validated = false;
		}
	} else {
		$errormessages[] = "Must have confirmed password";
		$validated = false;
	}
	
	dbClose($dbconn);
	return $validated;
}


/*
 * Insert user into the database. Return true on successful insert, false otherwise.
 */
function register_newuser($username, $email, $password, $confirm_password) {
	global $errormessages;
	$insert_status = false;
	$dbconn = dbConnect();
	
	pg_prepare($dbconn, "insert_user_info", 'INSERT INTO appuser (name, email, joindate, validated, lastlogin, highscore) VALUES ($1, $2, $3, false, $3, 0)');
	pg_prepare($dbconn, "insert_user_password", 'INSERT INTO appuser_passwords (userid, password) VALUES ((SELECT id FROM appuser WHERE name = $1 AND email = $2), $4');

	$valid = validate_registration_info($username, $email, $password, $confirm_password);

	if ($valid) {
		// Registration information is valid
		$timestamp = date('Y-m-d H:i:s');

		$result = pg_execute($dbconn, "insert_user_info", array($username, $email, $timestamp));
		if ($result) {
			$result = pg_execute($dbconn, "insert_user_password", array($password));
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

	var_dump($insert_status);
	echo "is what register_user will return<br/>";
	dbClose($dbconn);
	return $insert_status;
}

?>
