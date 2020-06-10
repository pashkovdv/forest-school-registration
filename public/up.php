<?php
header('Access-Control-Allow-Origin: *');
error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$upload_handler = new UploadHandler([
    // MUST MATCH the 'Allow-Control-Allow-Headers' header from client request
    // even if actual control is not used
    'access_control_allow_headers' => ['x-requested-with'],
    'image_versions' => []
    /* Additional configuration options */
]);