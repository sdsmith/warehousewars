<?php

define("MIN_LEN_USERNAME", 3);
define("MAX_LEN_USERNAME", 20);
define("MIN_LEN_PASSWORD", 8);
define("MAX_LEN_PASSWORD", 50);
define("MIN_LEN_EMAIL", 5);
define("MAX_LEN_EMAIL", 50);

/*
 * Return true if all characters in the given input passed whitelisting, false
 * otherwise.
 * Whitelists all alphanumeric characters and underscores, as well as makes sure
 * it is between the given range.
 */
function whitelist_input($input, $minlength, $maxlength) {
	$valid = false;
	
	// Check length
	if ($minlength <= $input.length && $input.length <= $maxlength) {
		// Check string content
		if (preg_match("/[\w\d]+/", $input, $matched) !== false) {
			$valid = $input === $matched[0];
		}
	}
	
	return $valid;
}
?>
