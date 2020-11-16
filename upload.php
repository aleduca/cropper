<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');

$name = $_FILES['file']['name'];
$temp = $_FILES['file']['tmp_name'];

echo (move_uploaded_file($temp, './uploads/' . $name)) ? json_encode('uploaded') : json_encode('error');
