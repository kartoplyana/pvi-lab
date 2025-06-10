<?php
class Controller {
    public function model($name) {
        require_once "models/$name.php";
        return new $name;
    }

    public function view($view, $data = []) {
        extract($data);
        require "views/$view.php";
    }
}
