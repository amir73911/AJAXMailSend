<?php

	$sendto  = isset($_POST['mail_to']) ? $_POST['mail_to'] : '';
	$name = isset($_POST['name']) ? $_POST['name'] : '';
	$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
	$email = isset($_POST['email']) ? $_POST['email'] : '';

	$email_title = isset($_POST['email_title']) ? $_POST['email_title'] : '';

	// Формирование заголовка письма
	$subject  = $email_title;

	$headers  = "From: test\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

	// Формирование тела письма
	$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
	$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>".$email_title."</h2>\r\n";
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