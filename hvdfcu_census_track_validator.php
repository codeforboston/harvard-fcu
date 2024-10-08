<?php

/**
 * Plugin Name: HarvardFCU Census Trac Validator
 * Plugin URI: https://www.harvard-fcu.com/
 * Description: Validate if an address is within the approved census trac for assistance
 * Version: 0.3
 * Text Domain: hvd-fcu-census-track
 * Author: CodeForBostonGang
 * Author URI: https://www.codeforboston.org/
 */
$Content = '';

function getCensusTract($addr)
{
	$url = "https://geocoding.geo.census.gov/geocoder/geographies/address";

	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$headers = array(
		"Content-Type: application/x-www-form-urlencoded",
	);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	$query_string_data = array(
		'street' =>  $addr["street"],
		'city' =>  $addr["city"],
		'state' =>  $addr["state"],
		'zip' =>  $addr["zip"],
		'benchmark' =>  'Public_AR_Census2020',  // Use the 2020 Census benchmark
		'vintage' =>  'Census2020_Census2020',  // Census 2020 vintage data
		'layers' =>  'tract',  // Specify layers for census tract
		'format' =>  'json'  // Get the response in JSON format
	);
	curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($query_string_data));

	$resp = curl_exec($curl);
	$info = curl_getinfo($curl);
	curl_close($curl);

	$r = json_decode($resp);
	return (count($r->result->addressMatches) > 0) ? $r->result->addressMatches[0]->geographies->{'Census Tracts'}[0]->GEOID : "INVALID";
}

function getResponse($address)
{
	$Content = '';
	$census_tract_list =  explode("\n", file_get_contents(plugin_dir_path(__FILE__) . "tracts.csv"));
	if (in_array(getCensusTract(parse_address($address)), $census_tract_list)) {
		$Content .= "<div style='color: green'>Success! Your address is within the list of census tracts we can support</div>";
	} else {
		$Content .= "<div style='color: red'>Unfortunately, that address is not supported by Harvard-FCU</div>";
	}
	return $Content;
}

function parse_address($address_string)
{
	$parts = preg_split('/\s+/', str_replace(',', ' ', $address_string));
	return [
		"street" => implode(' ', array_slice($parts, 0, count($parts) - 3)),
		"city" => $parts[count($parts) - 3],
		"state" => $parts[count($parts) - 2],
		"zip" => $parts[count($parts) - 1]
	];
}

$css_styles = "
<style>
h3.success {
        color: #26b158;
}

h3.failure {
        color: red;
}

</style>
";

function validate_census_tract($atts)
{

	$Content = $css_styles;
	$census_tract_list =  explode("\n", file_get_contents(plugin_dir_path(__FILE__) . "tracts.csv"));

	$Content .= '<form method="POST">';
	$Content .= '<input type="text" size="80" name="address" id="address" />';
	$Content .= '<div class="wp-block-button"><input type="submit" class="wp-block-button__link wp-element-button" value="Check" /></div>';
	$Content .= '</form>';

	if (isset($_POST['address'])) {
		$Content .= getResponse($_POST['address']);
	}

	return $Content;
}

add_shortcode('validate_census_tract', 'validate_census_tract');

#echo getResponse('77 Massachusetts Ave, cambridge ma 02139');
#echo getResponse('148 Winthrop Shore Drive, winthrop, ma 02152');
#echo getResponse('148 Winthrop Shore Drive, cambridge ma 02139');