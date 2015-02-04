<?php

/*
 * Return true if all characters in the given input passed whitelisting, false
 * otherwise.
 * Whitelists all alphanumeric characters and underscores.
 */
function whitelist_input($input) {
	if (preg_match("/[\w\d]+/", $input, $matched) !== false) {
		return $input === $matched[0];
	}
	return false;
}
?>
