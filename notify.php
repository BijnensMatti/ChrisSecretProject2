<?php
$payload = array(
    'apikey' => "23789EUFHUEHJNCJZUE_EIF9EJGIEJSICJEI3+%*%323"
    'url' => 'https://example.com/breaking-news/',
    'content' => 'Check this out! #flightdeal'
);
echo "before curl";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://pushapp.pro/publisherapi/pushes/");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
echo "test123 pls";
$result = curl_exec($ch);
?>
