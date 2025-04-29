<?php
class Router {
    public function direct($url) {
        $url = explode('/', trim($url, '/'));

        $controllerName = ucfirst($url[0] ?? 'students') . 'Controller';
        $method = $url[1] ?? 'index';

        if (class_exists($controllerName)) {
            $controller = new $controllerName;
            if (method_exists($controller, $method)) {
                return $controller->$method();
            } else {
                echo "Метод $method не знайдено в $controllerName";
            }
        } else {
            echo "Контролер $controllerName не знайдено";
        }
    }
}
