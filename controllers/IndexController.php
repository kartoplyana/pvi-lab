<?php
class IndexController extends Controller {
    public function index() {
        header("Location: /pvi/students");
        exit;
    }
}
