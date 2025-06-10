<?php
class Student {
    public $id;
    public $group;
    public $firstName;
    public $lastName;
    public $birthday;

    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getPaginated($limit, $offset) {
        $stmt = $this->db->prepare("SELECT students.*, users.isOnline 
            FROM students 
            LEFT JOIN users ON students.id = users.studentId
            LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM students");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTotalCount() {
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM students");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }    

    public function create($newStudent) {
        $stmt = $this->db->prepare("INSERT INTO students(`group`, firstName, lastName, gender, birthday) VALUES(:group, :firstName, :lastName, :gender, :birthday)");
        $stmt->bindValue(':group', $newStudent->group, PDO::PARAM_STR);
        $stmt->bindValue(':firstName', $newStudent->firstName, PDO::PARAM_STR);
        $stmt->bindValue(':lastName', $newStudent->lastName, PDO::PARAM_STR);
        $stmt->bindValue(':gender', $newStudent->gender, PDO::PARAM_STR);
        $stmt->bindValue(':birthday', $newStudent->birthday, PDO::PARAM_STR);
        
        return $stmt->execute();
    }

    public function edit($currentStudent) {
        $stmt = $this->db->prepare("UPDATE students SET `group`=:group, firstName=:firstName, lastName=:lastName, gender=:gender, birthday=:birthday WHERE id=:id");
        $stmt->bindValue(':id', (int)$currentStudent->id, PDO::PARAM_INT);
        $stmt->bindValue(':group', $currentStudent->group, PDO::PARAM_STR);
        $stmt->bindValue(':firstName', $currentStudent->firstName, PDO::PARAM_STR);
        $stmt->bindValue(':lastName', $currentStudent->lastName, PDO::PARAM_STR);
        $stmt->bindValue(':gender', $currentStudent->gender, PDO::PARAM_STR);
        $stmt->bindValue(':birthday', $currentStudent->birthday, PDO::PARAM_STR);
        
        return $stmt->execute();
    }

    public function delete($idsArray) {
        $in  = str_repeat('?,', count($idsArray) - 1) . '?';
        $stmt = $this->db->prepare("DELETE FROM students WHERE id IN ($in)");
        return $stmt->execute($idsArray);
    }

    public function exists($firstName, $lastName) {
        $stmt = $this->db->prepare('SELECT 1 FROM students WHERE firstName = :first_name AND lastName = :last_name LIMIT 1');
        $stmt->execute([
            ':first_name' => $firstName,
            ':last_name' => $lastName,
        ]);
    
        return $stmt->fetchColumn() !== false;
    }
       
    public function existsEdit($firstName, $lastName, $excludeId) {
        $query = 'SELECT * FROM students WHERE firstName = :first_name AND lastName = :last_name';
        $params = [
            ':first_name' => $firstName,
            ':last_name' => $lastName
        ];
    
        $query .= ' AND id != :id';
        $params[':id'] = $excludeId;
    
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
    
        $existingStudent = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($existingStudent) {
            http_response_code(422);
            echo json_encode([
                'status' => 'failure',
                'errors' => [
                    'duplicate' => 'A student with such a name already exists'
                ]
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
    
    public function findByUserId($userId) {
        $stmt = $this->db->prepare("SELECT firstName, lastName FROM students WHERE id = :i");
        $stmt->bindValue("i", $userId);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllWithUsers() {
        $stmt = $this->db->prepare('
            SELECT students.*, users.isOnline 
            FROM students 
            JOIN users ON students.id = users.studentId
        ');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}