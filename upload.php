<?php
// upload.php: Handles file uploads to img/video folder
$targetDir = "img/video/";
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}
if (isset($_FILES["file"])) {
    $fileName = basename($_FILES["file"]["name"]);
    $targetFile = $targetDir . $fileName;
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
        echo json_encode(["success" => true, "filename" => $fileName, "url" => $targetFile]);
    } else {
        echo json_encode(["success" => false, "error" => "Upload failed."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No file uploaded."]);
}
?>
