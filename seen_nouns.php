<?php

// Get the noun sent from the JavaScript file
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['noun'])) {
    $noun = strtolower($data['noun']); // Convert noun to lowercase
    $jsonFile = 'seen.json';

    // Read existing JSON data from file
    $jsonData = json_decode(file_get_contents($jsonFile), true);

    // Increment the count for the existing noun or add a new entry
    $jsonData[$noun] = ($jsonData[$noun] ?? 0) + 1;

    // Write updated JSON data back to file
    file_put_contents($jsonFile, json_encode($jsonData));

    // Respond with success message
    echo json_encode(['message' => 'Noun stored successfully']);
} else {
    // Respond with error message if noun is not provided
    echo json_encode(['error' => 'Noun not provided']);
}

?>
