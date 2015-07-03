<?php

$loader = require '../../vendor/autoload.php';

$htmlBody = '';
$error = [];

$result = [];

if ($_POST['q']) {

    $json = file_get_contents('../../api_keys.json');
    $api_key = json_decode($json);

    $client = new Google_Client();
    $client->setDeveloperKey($api_key->youtube->DEVELOPER_KEY);

    $youtube = new Google_Service_YouTube($client);
    try {

        $searchResponse = $youtube->search->listSearch('id,snippet', array(
            'q' => $_POST['q'],
            'maxResults' => 50
        ));

        $videos = [];

        foreach ($searchResponse['items'] as $searchResult) {
            switch ($searchResult['id']['kind']) {
                case 'youtube#video':
                    $vid = array(
                        'id' => $searchResult['id'],
                        'vidData' => $searchResult['snippet'],
                        'thumb' => $searchResult['snippet']['thumbnails']['high']['url']
                    );
                    array_push($videos, $vid);
                    break;
            }
        }

        $htmlBody = $searchResponse;

        $result['code'] = 200;
        $result['data'] = $videos;


    } catch (Google_Service_Exception $e) {
        $result['data'] = $e->getMessage();
        $result['code'] = 404;
        $htmlBody = 'error';
    } catch (Google_Exception $e) {
        $result['data'] = $e->getMessage();
        $result['code'] = 404;
        $htmlBody = 'error';
    }
}

echo json_encode($result);
