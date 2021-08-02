<?php
//fix plus sign in KML variable
	preg_match_all('/(\w+)=([^&]+)/', $_SERVER["QUERY_STRING"], $pairs);
	$_GET = @array_combine($pairs[1], $pairs[2]);
//fix plus sign in KML variable


if (isset($_GET['type'])) $type = htmlspecialchars($_GET['type']); else $type = 'hybrid';
if (isset($_GET['center'])) $center = htmlspecialchars($_GET['center']); else $center = '57.53157,57.22842';
if (isset($_GET['zoom'])) $zoom = (int)htmlspecialchars($_GET['zoom']); else $zoom = 13;


if (isset($_GET['kml']))
	$kml = htmlspecialchars($_GET['kml']);
else
	$kml = '';
	
if (isset($_GET['placemark']) && preg_match ("/\d{1,3}\.\d{1,6},\d{1,3}\.\d{1,6}/", htmlspecialchars($_GET['placemark'])))
		$placemark = htmlspecialchars($_GET['placemark']);
else
	$placemark = '';
	
	
function fileTime ($file) {
	date_default_timezone_set('UTC');
	if ($file == '2014+-messages.php') {
		$time = date("Y-m-d_H:i", filemtime("$_SERVER[DOCUMENT_ROOT]/2014-257/blog.xml")).'gmt';
	}
	else {		
		$time = date("Y-m-d_H:i", filemtime("$_SERVER[DOCUMENT_ROOT]/kml-files/$file")).'gmt';
	}
	return $time;
}
	

?>