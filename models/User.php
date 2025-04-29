<?php
require_once __DIR__ . '/../core/Database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function findByEmailAndPassword($email, $password) {
        $stmt = $this->db->prepare("SELECT studentId FROM users WHERE email = :email AND `password` = :password");
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':password', $password, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function setOnlineStatus($userId, $status) {
        $stmt = $this->db->prepare('UPDATE users SET isOnline = :status WHERE studentId = :id');
        $stmt->execute([
            ':status' => $status,
            ':id' => $userId
        ]);
    }
}
?>
