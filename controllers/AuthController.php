<?php
session_start();
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Student.php';

class AuthController extends Controller {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->view('students/login', []);
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
        
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
        
            $userModel = new User();
            $studentModel = new Student();
        
            $user = $userModel->findByEmailAndPassword($email, $password);
        
            if ($user) {
                $student = $studentModel->findByUserId($user['studentId']);
        
                if ($student) {
                    $_SESSION['student_name'] = $student['firstName'];
                    $_SESSION['student_surname'] = $student['lastName'];
                    $_SESSION['user_id'] = $user['studentId'];

                    $userModel->setOnlineStatus($user['studentId'], 1);
        
                    echo json_encode(['success' => true, 
                        'first_name' => $student['firstName'],
                        'last_name' => $student['lastName']]);
                    exit;
                } else {
                    echo json_encode(['success' => false, 'message' => 'Student not found']);
                    exit;
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
                exit;
            }
        }
    }

    public function logout() {
        if (isset($_SESSION['user_id'])) {
            $userModel = new User();
            $userModel->setOnlineStatus($_SESSION['user_id'], 0);
        }
        session_unset(); // Видаляє всі змінні сесії
        session_destroy(); // Знищує саму сесію

        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
        exit;
    }
}
?>
