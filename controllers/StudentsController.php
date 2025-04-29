<?php
class StudentsController extends Controller {
    public function index() {
        //$students = $this->model('Student')->getAll();
        $this->view('students/index', []);
    }

    public function getAll() {
        //$studentModel = new Student();
        //$students = $studentModel->getAllWithUsers();

        header('Content-Type: application/json; charset=utf-8');
    
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $perPage = isset($_GET['limit']) ? (int)$_GET['limit'] : 4;
        $offset = ($page - 1) * $perPage;
    
        $studentModel = $this->model('Student');
        //$students = $studentModel->getAllWithUsers(); // Повертає студентів + isOnline
        $students = $studentModel->getPaginated($perPage, $offset);
        $total = $studentModel->getTotalCount();
        $totalPages = ceil($total / $perPage);
    
        echo json_encode([
            'data' => $students,
            'meta' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $total,
                'totalPages' => $totalPages
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
    
    public function add() {
        header('Content-Type: application/json; charset=utf-8');
    
        $student = json_decode(file_get_contents("php://input"), true);
    
        $errors = [];
    
        $validGroups = ['PZ-21', 'PZ-22', 'PZ-23', 'PZ-24', 'PZ-25', 'PZ-26', 'PZ-27'];
        if (!in_array($student['group'], $validGroups)) {
            $errors['group'] = 'Invalid group selected';
        }
    
        $regexName = '/^[A-Z][A-Za-z]+(-[A-Za-z]+)*$/';
    
        if (!preg_match($regexName, $student['firstName'])) {
            $errors['firstName'] = 'Invalid first name format';
        }
    
        if (!preg_match($regexName, $student['lastName'])) {
            $errors['lastName'] = 'Invalid last name format';
        }
    
        if (!in_array($student['gender'], ['Male', 'Female', 'M', 'F'])) {
            $errors['gender'] = 'Invalid gender selected';
        }
    
        if (empty($student['birthday'])) {
            $errors['birthday'] = 'Birthday is required';
        } else {
            $minDate = strtotime('1955-01-01');
            $maxDate = strtotime('2009-10-31');
            $birthday = strtotime($student['birthday']);
    
            if ($birthday < $minDate || $birthday > $maxDate) {
                $errors['birthday'] = 'Birthday must be between 1955-01-01 and 2009-10-31';
            }
        }
    
        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'errors' => $errors
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            return;
        }
    
        $studentModel = $this->model('Student');

        if ($studentModel->exists($student['firstName'], $student['lastName'])) {
            http_response_code(422);
            echo json_encode([
                'status' => 'failure',
                'errors' => [
                    'duplicate' => 'A student with such a name already exists'
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }

        $success = $studentModel->create((object)$student);
    
        echo json_encode([
            'success' => $success
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }    

    public function edit() {
        header('Content-Type: application/json; charset=utf-8');

        $student = json_decode(file_get_contents("php://input"), true);

        $studentModel = $this->model('Student');

        if ($studentModel->existsEdit($student['firstName'], $student['lastName'], $student['id'])) {
            http_response_code(422);
            echo json_encode([
                'status' => 'failure',
                'errors' => [
                    'duplicate' => 'A student with such a name already exists'
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }

        $success = $studentModel->edit((object)$student);

        echo json_encode([
            'success' => $success
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    public function delete() {
        header('Content-Type: application/json; charset=utf-8');

        $ids = json_decode(file_get_contents("php://input"), true);
        $studentModel = $this->model('Student');
        $success = $studentModel->delete($ids);

        echo json_encode([
            'success' => $success
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
}
