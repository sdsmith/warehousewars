<?php
/*
 * Library for game related statistics.
 */



/*
 * Update the highscore for the given user in the appuser table.
 */
function update_user_highscore($userid, $highscore) {
	$dbconn = dbConnect();

	if (!pg_prepare($dbconn, "update_user_highscore", "UPDATE appuser SET highscore = $1 WHERE id = $2")) {
		die("Error: " . pg_last_error());
	}

	// Update highscore
	$result = pg_execute($dbconn, "update_user_highscore", array($highscore, $userid));
	if (!$result) {
		die("Error: " . pg_last_error());
	}

	dbClose($dbconn);
}

/*
 * Insert the given information into the game statistics table.
 */
function insert_gamestats($userid, $score, $maxlevel, $kills, $deaths, $steps) {
	$dbconn = dbConnect();
	
	if (!pg_prepare($dbconn, "insert_gamestats", "INSERT INTO ww_appuser_stats (userid, time, score, maxlevel, kills, deaths, steps) VALUES ($1, $2, $3, $4, $5, $6, $7)")) {
		die("Error: " . pg_last_error());
	}
	
	// Create current timestamp
	$timestamp = date('Y-m-d H:i:s');

	// Insert into database
	$result = pg_execute($dbconn, "insert_gamestats", array($userid, $timestamp, $score, $maxlevel, $kills, $deaths, $steps));
	if (!$result) {
		die("Error: " . pg_last_error());
	}

	dbClose($dbconn);
}

/*
 * Return array of the top $number highscores along with their associated info.
 * Return is formated in a 2d array of (score, username) elements.
 */
function get_highscores($number) {
	$highscores = array();

	$dbconn = dbConnect();

	if (!pg_prepare($dbconn, "highscores", "SELECT appuser.name, top.score, top.time, top.kills, top.deaths, top.steps FROM appuser, (SELECT * FROM ww_appuser_stats ORDER BY score DESC LIMIT $1) AS top WHERE appuser.id = top.userid ORDER BY top.score DESC")) { 
		die("Error: " . pg_last_error());
	}
	$resultobj = pg_execute($dbconn, "highscores", array($number));
	if (!$resultobj) {
		die("Error: " . pg_last_error());
	}

	$row = pg_fetch_array($resultobj);
	while ($row) {
		$highscores[] = array($row['score'], $row['kills'], $row['deaths'], $row['steps'] ,$row['time'], $row['name']);
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
		$highscores_html .= "<table border='3'>\n";
		$highscores_html .= "\t<tr>\n\t\t<td>Score</td><td>Kills</td><td>Deaths</td><td>Steps Taken</td><td>Played</td><td>Username</td>\n\t</tr>\n";

		foreach ($highscorearray as $entry) {
			$highscores_html .= "\t<tr>\n\t\t<td>" . $entry[0] . "</td><td>" . $entry[1] . "</td><td>" . $entry[2] . "</td><td>" . $entry[3] . "</td><td>" . $entry[4] . "</td><td>" . $entry[5] . "</td>\n\t</tr>\n";
		}

		$highscores_html .= "</table>\n";
	}
	$highscores_html .= "</div>\n";

	return $highscores_html;
}
?>
