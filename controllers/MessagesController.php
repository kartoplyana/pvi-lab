<?php

class MessagesController extends Controller {
    public function index() {
        $this->view('students/messages', []);
    }
}
