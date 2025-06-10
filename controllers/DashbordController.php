<?php
class DashbordController extends Controller {
    public function index() {
        $this->view('students/dashbord', []);
    }
}
