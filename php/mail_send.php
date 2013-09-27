<?php
$sendto  = $_POST['to_mail'];
$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
// Формирование заголовка письма
$subject  = "Заказ звонка от ".$name;
$headers  = "From: test\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html;charset=utf-8 \r\n";
// Формирование тела письма
$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>Новое сообщение</h2>\r\n";
$msg .= "<p><strong>От кого:</strong> ".$name."</p>\r\n";
$msg .= "<p><strong>E-mail:</strong> ".$email."</p>\r\n";
$msg .= "<p><strong>Номер:</strong> ".$phone."</p>\r\n";
$msg .= "</body></html>";

// отправка сообщения
if(mail($sendto, $subject, $msg, $headers)) {
	echo "true";
} else {
	echo "false";
}

?>