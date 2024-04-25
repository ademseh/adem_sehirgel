<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require $_SERVER['DOCUMENT_ROOT'] . '/project2/vendor/autoload.php';

if (
    isset($_GET["name"])
    && isset($_GET["email"])
    && isset($_GET["subject"])
    && isset($_GET["message"])
) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'ademsehirgel@tokeryazilim.com';
        $mail->Password   = 'Kako3842!';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Bu satırı değiştirdik
        $mail->Port       = 587; // Port'u 587 olarak değiştirdik

        $mail->setFrom('ademsehirgel@tokeryazilim.com', 'Adem Sehirgel');
        $mail->addAddress('ademsehirgel@tokeryazilim.com', 'Adem Sehirgel');

        $mail->isHTML(true);
        $mail->Subject = 'New Form!!!';
        $mail->Body    = '
        Name: ' . $_GET["name"] . ' <br>
        Email: ' . $_GET["email"] . '<br>
        Subject: ' . $_GET["subject"] . '<br>
        Message: ' . $_GET["message"];
        
        $mail->send();

        header("location: /project2/index.html?isEmailSended=true");
    } catch (Exception $e) {
        header("location: /project2/index.html?isEmailSended=false");
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    header("location: /project2/index.html?isEmailSended=false");
}
?>
