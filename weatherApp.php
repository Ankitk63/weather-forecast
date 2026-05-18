<?php
include "config.php";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["lat"]) && isset($_POST["lon"])) {
        $lat = $_POST["lat"];
        $lon = $_POST["lon"];
        $url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=metric";
    } else {
        $location = $_POST["location-name"];
        $url = "https://api.openweathermap.org/data/2.5/weather?q=$location&appid=$apiKey&units=metric";
    }

    $response = file_get_contents($url);
    $data = json_decode($response, true);
    if (!$data || $data["cod"] != 200) {
        echo json_encode([
            "error" => "City not found or API error"
        ]);
        exit;
    }
    echo json_encode([
        "location" => $data["name"],
        "temp" => $data["main"]["temp"],
        "temp_min" => $data["main"]["temp_min"],
        "temp_max" => $data["main"]["temp_max"],
        "feels_like" => $data["main"]["feels_like"],
        "desc" => $data["weather"][0]["description"],
        "humidity" => $data["main"]["humidity"],
        "wind" => $data["wind"]["speed"],
        "pressure" => $data["main"]["pressure"],
        "visibility" => $data["visibility"],
        "main" => $data["weather"][0]["main"],
        "sunrise" => $data["sys"]["sunrise"],
        "sunset" => $data["sys"]["sunset"],
        "currentTime" => $data["dt"] 
    ]);
}