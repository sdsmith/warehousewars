<?php
/*
 * Library for game related statistics.
 */


/*
 * Return array of the top $number highscores along with their associated info.
 * Return is formated in a 2d array of (score, username) elements.
 */
function get_highscores($number) {
	$highscores = array();

	$dbconn = dbConnect();

	if (!pg_prepare($dbconn, "highscores", "SELECT * FROM appuser ORDER BY highscore LIMIT $1")) {
		die("Error: " . pg_last_error());
	}
	$resultobj = pg_execute($dbconn, "highscores", array($number));
	if (!$resultobj) {
		die("Error: " . pg_last_error());
	}

	$row = pg_fetch_array($resultobj);
	while ($row) {
		$highscores[] = array($row['highscore'], $row['name']);
		$row = pg_fetch_array($resultobj);
	}

	dbClose($dbconn);

	return $highscores;
}


/*
 * Return html formatted highscores from the array object created by 
 * get_highscores. Will return empty string if there are no highscores.
 */
function display_highscores($highscorearray) {
	$highscores_html = "<div id=\"highscore_table\">\n<h3>Highscores - Top " . count($highscorearray) . "</h3>\n";
	
	if (!empty($highscorearray)) {
		$highscores_html .= "<table>\n";

		foreach ($highscorearray as $entry) {
			$highscores_html .= "\t<tr>\n\t\t<td>" . $entry[0] . "</td><td>" . $entry[1] . "</td>\n\t</tr>";
		}

		$highscores_html .= "</table>\n";
	}
	$highscores_html .= "</div>\n";

	return $highscores_html;
}
?>
