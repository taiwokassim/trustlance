<?php

//Your Mysql Config
$servername = "sql213.infinityfree.com";
$username = "if0_41878645";
$password = "heuYGozEDfH";
$dbname = "if0_41878645_job";

//Create New Database Connection
$conn = new mysqli($servername, $username, $password, $dbname);

//Check Connection
if($conn->connect_error) {
	die("Connection Failed: ". $conn->connect_error);
}