<?php


	$info = $_POST['info'];
	$data = $_POST['data'];
	$captions = $_POST['captions'];

	$mail_to  = $info['mail_to'];
	$email_title  = $info['email_title'];


	$headers  = "From: test\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html;charset=utf-8 \r\n";

	// Формирование тела письма
	$msg  = "<html><body style='font-family:Arial,sans-serif;'>";
	$msg .= "<h2 style='font-weight:bold;border-bottom:1px dotted #ccc;'>".$email_title."</h2>\r\n";
	foreach ( $data as $key => $value ) {
    	$msg .= "<p><strong>".$captions[$key]."</strong> ".$value."</p>\r\n";
    }
	$msg .= "</body></html>";

	// отправка сообщения
	if(mail($mail_to, $email_title, $msg, $headers)) {
		echo "true";
	} else {
		echo "false";
	}
?>