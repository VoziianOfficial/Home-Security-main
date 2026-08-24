<?php

declare(strict_types=1);

/* =========================================================
   SECURENEST — CONTACT FORM
   ========================================================= */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');


/* =========================================================
   RESPONSE
   ========================================================= */

function sendResponse(
    bool $success,
    string $message,
    int $status = 200
): void {
    http_response_code($status);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message
        ],
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    );

    exit;
}


/* =========================================================
   REQUEST METHOD
   ========================================================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(
        false,
        'Method not allowed.',
        405
    );
}


/* =========================================================
   GET SITE VALUES FROM CONFIG.JS
   ========================================================= */

function getConfigString(
    string $key,
    string $fallback
): string
{
    $configPath =
        __DIR__ . '/config/config.js';

    if (!is_file($configPath)) {
        return $fallback;
    }

    $configContent =
        file_get_contents($configPath);

    if ($configContent === false) {
        return $fallback;
    }

    $pattern =
        '/' . preg_quote($key, '/') . '\s*:\s*["\']([^"\']+)["\']/i';

    if (
        preg_match(
            $pattern,
            $configContent,
            $matches
        ) === 1
    ) {
        return trim($matches[1]);
    }

    return $fallback;
}


function getRecipientEmail(): string
{
    $email =
        filter_var(
            getConfigString(
                'email',
                'hello@securenest-home.com'
            ),
            FILTER_VALIDATE_EMAIL
        );

    if ($email !== false) {
        return $email;
    }

    return 'hello@securenest-home.com';
}


/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(string $value): string
{
    $value =
        trim($value);

    $value =
        strip_tags($value);

    return preg_replace(
        '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u',
        '',
        $value
    ) ?? '';
}


function cleanHeader(string $value): string
{
    $value = cleanText($value);

    return str_replace(
        ["\r", "\n"],
        '',
        $value
    );
}


/* =========================================================
   HONEYPOT
   ========================================================= */

$website =
    cleanText(
        (string) (
            $_POST['website'] ?? ''
        )
    );

if ($website !== '') {
    sendResponse(
        true,
        getConfigString(
            'formSuccessMessage',
            'Thank you! Your request has been sent successfully.'
        )
    );
}


/* =========================================================
   FORM DATA
   ========================================================= */

$name =
    cleanText(
        (string) (
            $_POST['name'] ?? ''
        )
    );

$emailRaw =
    cleanHeader(
        (string) (
            $_POST['email'] ?? ''
        )
    );

$service =
    cleanText(
        (string) (
            $_POST['service'] ?? ''
        )
    );

$message =
    cleanText(
        (string) (
            $_POST['message'] ?? ''
        )
    );


/* =========================================================
   VALIDATION
   ========================================================= */

if ($name === '') {
    sendResponse(
        false,
        'Please enter your name.',
        422
    );
}

if (
    strlen($name) > 100
) {
    sendResponse(
        false,
        'Name is too long.',
        422
    );
}

$email =
    filter_var(
        $emailRaw,
        FILTER_VALIDATE_EMAIL
    );

if ($email === false) {
    sendResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}

if (
    strlen($service) > 150
) {
    sendResponse(
        false,
        'Service name is too long.',
        422
    );
}

if ($message === '') {
    sendResponse(
        false,
        'Please enter your message.',
        422
    );
}

if (
    strlen($message) > 5000
) {
    sendResponse(
        false,
        'Message is too long.',
        422
    );
}


/* =========================================================
   EMAIL
   ========================================================= */

$recipient =
    getRecipientEmail();

$brandName =
    getConfigString(
        'brandName',
        'SecureNest'
    );

$successMessage =
    getConfigString(
        'formSuccessMessage',
        'Thank you! Your request has been sent successfully.'
    );

$subject =
    'New Home Security Request';

$lines = [
    'New request from the ' . $brandName . ' website',
    '',
    'Name: ' . $name,
    'Email: ' . $email
];

if ($service !== '') {
    $lines[] =
        'Service: ' . $service;
}

$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message;
$lines[] = '';
$lines[] =
    'Sent from: ' .
    (
        $_SERVER['HTTP_HOST'] ??
        'website'
    );

$emailBody =
    implode(
        PHP_EOL,
        $lines
    );


/* =========================================================
   MAIL HEADERS
   ========================================================= */

$host =
    preg_replace(
        '/[^a-z0-9.-]/i',
        '',
        (string) (
            $_SERVER['HTTP_HOST'] ??
            'localhost'
        )
    );

if (
    $host === '' ||
    $host === 'localhost'
) {
    $fromEmail =
        'no-reply@localhost';
} else {
    $fromEmail =
        'no-reply@' . $host;
}

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . cleanHeader($brandName) . ' Website <' . $fromEmail . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION
];


/* =========================================================
   SEND
   ========================================================= */

$sent =
    @mail(
        $recipient,
        $subject,
        $emailBody,
        implode(
            "\r\n",
            $headers
        )
    );

if (!$sent) {
    sendResponse(
        false,
        'Unable to send your request right now. Please try again later.',
        500
    );
}


/* =========================================================
   SUCCESS
   ========================================================= */

sendResponse(
    true,
    $successMessage
);
