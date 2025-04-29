<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'core/Router.php';
require_once 'core/Controller.php';
require_once 'core/Database.php';

spl_autoload_register(function ($class) {
    foreach (['controllers', 'models'] as $folder) {
        $path = "$folder/$class.php";
        if (file_exists($path)) {
            require_once $path;
            break;
        }
    }
});

$router = new Router();
$router->direct($_GET['url'] ?? '');
