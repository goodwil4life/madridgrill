<?php
if(!isset($_POST["nl_sub"])){
	//WELCOME AJAX CONTACT FORM MAILER

	//Stripping tags so if even user writes tags like <div></div> or <a href=""></a>, these are just getting cleared.
	//Making ready the content for e-mail by the way
	$mailContent = '';
	foreach($_POST as $key => $val){

		$_POST[$key] = strip_tags($val);
		$mailContent .= $key.' : '.$_POST[$key].'<br>';
	}

	/**
	 * This example shows making an SMTP connection with authentication.
	 */

	//SMTP needs accurate times, and the PHP time zone MUST be set
	//This should be done in your php.ini, but this is how to do it if you don't have access to that
	date_default_timezone_set('Etc/UTC');

	require 'PhpMailer_CLASS/PHPMailerAutoload.php';

	$mail = new PHPMailer;

	#$mail->SMTPDebug = 3;                          // Enable verbose debug output
	$mail->isSMTP();                                // Set mailer to use SMTP
	$mail->Host         = 'SMTP_SERVER_ADDRESS';    // Specify main SMTP server
	$mail->SMTPAuth     = true;                     // Enable SMTP authentication
	$mail->Username     = 'SMTP_USERNAME';          // SMTP username
	$mail->Password     = 'SMTP_PASSWORD';          // SMTP password
	$mail->SMTPSecure   = 'tls';                    // Enable TLS encryption, `ssl` also accepted
	$mail->Port         = 587;                      // TCP port to connect to

	$mail->setFrom('SENDER_EMAIL_ADDRESS', 'Mailer');
	$mail->addAddress('EMAIL_RECEIVER_ADDRESS', 'Joe User');    // Add a recipient

	$mail->isHTML(true);                                        // Set email format to HTML

	$mail->Subject = 'MAIL_SUBJECT';
	$mail->Body    = $mailContent;
	$mail->AltBody = $mailContent;

	$mail->SMTPOptions = array(
		'ssl' => array(
			'verify_peer' => false,
			'verify_peer_name' => false,
			'allow_self_signed' => true
		)
	);

	//send the message, check for errors
	if (!$mail->send()) {
		echo "Mailer Error: " . $mail->ErrorInfo;
	} else {
		echo '<center style="font-family: sans-serif; font-size: 12px; font-weight: bold; line-height: 1.5; opacity: .54;">We received your message. We\'ll get back to you as soon as possible. Thank you for contacting us.</center>';
	}
}

