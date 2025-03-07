/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: clone_kbboot
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;
/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: clone_kaboot
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `user_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(300) NOT NULL,
  PRIMARY KEY (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES
('admin','$2b$10$QUTwHpBfh4RRWSYX9gNvFOx.Xe/nhT4P/c7QHtJMqjdddOEpNaiYu','admin@example.com'),
('user1','hashed_password_2','user1@example.com');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canva`
--

DROP TABLE IF EXISTS `canva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `canva` (
  `canva_id` int NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(100) NOT NULL,
  `ngay_tao` datetime NOT NULL,
  PRIMARY KEY (`canva_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canva`
--

LOCK TABLES `canva` WRITE;
/*!40000 ALTER TABLE `canva` DISABLE KEYS */;
INSERT INTO `canva` VALUES
(5,'dart','2025-03-06 16:55:41'),
(6,'fluter','2025-03-07 07:46:54'),
(7,'New canva','2025-03-07 13:38:18');
/*!40000 ALTER TABLE `canva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cau_hoi`
--

DROP TABLE IF EXISTS `cau_hoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cau_hoi` (
  `cau_hoi_id` int NOT NULL AUTO_INCREMENT,
  `canva_id` int NOT NULL,
  `noi_dung` text NOT NULL,
  `dinh_dang` enum('htmldecode','markdown') NOT NULL,
  `thoi_gian` int NOT NULL,
  PRIMARY KEY (`cau_hoi_id`),
  KEY `canva_id` (`canva_id`),
  CONSTRAINT `cau_hoi_ibfk_1` FOREIGN KEY (`canva_id`) REFERENCES `canva` (`canva_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cau_hoi`
--

LOCK TABLES `cau_hoi` WRITE;
/*!40000 ALTER TABLE `cau_hoi` DISABLE KEYS */;
INSERT INTO `cau_hoi` VALUES
(30,5,'Từ khóa nào được dùng để khai báo hằng số compile-time, không thay đổi được giá trị trong Dart?','markdown',30),
(31,5,'Để khai báo một biến kiểu số nguyên trong Dart, ta sử dụng từ khóa ______','markdown',30),
(32,5,'Đoạn code lên lỗi ở dòng nào.\n\n```dart\nvoid main() {\n    var x = 10;\n    x = \'hello\';\n    print(x);\n}\n```','markdown',30),
(33,5,'Đoạn code nào sau đây sẽ gây lỗi?\n','markdown',30),
(34,5,'điền vào chỗ trống:\n`List<​___> numbers = <​___>[ 1, 2, 3 ];`','markdown',30),
(35,5,'Kết quả của đoạn code này?\n```dart\nvoid main() {\nint i =0;\nwhile (I < 5)\n    print(i);\n    i++;\n}    \n```','markdown',30),
(36,5,'Kiểu dữ liệu Sets khác với List chỗ nào?','markdown',30),
(37,5,'Điều nào sai về từ khóa final?','markdown',30),
(38,5,'Hoàn thành đoạn code sau:\n```dart\nvoid main(____<String> args) {\n    print(\'Tên bạn là: ${args[0]}\');\n```','markdown',30),
(39,5,'Điền vào chỗ trống để khai báo hàm hợp lệ::\n\n```dart\n______ sayHello(String name) {\n    return \"hello, $name!\";\n}\n```','markdown',30),
(40,5,'điền vào chỗ trống, để kết quả ra 1,2,3,4\nvar numbers = [1,2,3,4];\nnumbers._____((num) {print(num);});','markdown',30),
(41,5,'điều vào chỗ trống:\n```dart\ntry {\n    var x = 10 ~/ 0;\n} ​ ____  (e) {\n    print(\"lỗi\");\n}\n```','markdown',30),
(43,6,'Flutter là gì?','markdown',30),
(44,6,'Ngôn ngữ lập trình chính được sử dụng trong Flutter là gì?','markdown',30),
(45,6,'Trong Flutter, “widget” là gì?\n','markdown',30),
(46,6,'“Hot Reload” trong Flutter có ý nghĩa là gì?\n','markdown',30),
(47,6,'Widget “gốc” (root widget) thường được sử dụng để khởi tạo một ứng dụng Flutter là gì?\n','markdown',30),
(48,6,'Để xây dựng bố cục theo chiều dọc, Flutter sử dụng widget nào?','markdown',30),
(49,6,'Flutter có thể phát triển ứng dụng cho các nền tảng nào sau đây?\n','markdown',30),
(50,6,'Widget nào cung cấp giao diện cơ bản với các phần như AppBar, Body, loatingActionButton,...?','markdown',30);
/*!40000 ALTER TABLE `cau_hoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lua_chon`
--

DROP TABLE IF EXISTS `lua_chon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lua_chon` (
  `lua_chon_id` int NOT NULL AUTO_INCREMENT,
  `cau_hoi_id` int NOT NULL,
  `noi_dung` text NOT NULL,
  `dung` tinyint(1) NOT NULL,
  PRIMARY KEY (`lua_chon_id`),
  KEY `cau_hoi_id` (`cau_hoi_id`),
  CONSTRAINT `lua_chon_ibfk_1` FOREIGN KEY (`cau_hoi_id`) REFERENCES `cau_hoi` (`cau_hoi_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lua_chon`
--

LOCK TABLES `lua_chon` WRITE;
/*!40000 ALTER TABLE `lua_chon` DISABLE KEYS */;
INSERT INTO `lua_chon` VALUES
(44,30,'const',1),
(45,30,'final',0),
(46,30,'var',0),
(47,30,'static',0),
(48,31,'double',0),
(49,31,'long',0),
(50,31,'init',1),
(51,31,'String',0),
(52,32,'`var x = 10;`',0),
(53,32,'`x = \'hello\';`',1),
(54,32,'`print(x);`',0),
(55,32,'không lỗi',0),
(56,33,'`const x = 10;`',0),
(57,33,'`final y = 20;`',0),
(58,33,'final z = \'Hello\';',0),
(59,33,'`const now = DateTime.now();`',1),
(60,34,'`int` - `int`',1),
(61,34,'`float` - `float`',0),
(62,34,'`var` - `int`',0),
(63,34,'`const` - `var`',0),
(64,35,'1,2,3,4,5',0),
(65,35,'0,1,2,3,4',0),
(66,35,'0,1,2,3,4,5,6,...',1),
(68,36,'Sets không cho phép phần tử trùng lặp và không duy trì thứ tự, trong khi List cho phép trùng lặp và có thứ tự.',1),
(69,36,'Sets cho phép phần tử trùng lặp và có thứ tự.',0),
(70,36,'List không cho phép phần tử trùng lặp và không duy trì thứ tự.',0),
(71,36,'Sets và List đều cho phép phần tử trùng lặp và có thứ tự.',0),
(72,37,'final không yêu cầu biết giá trị tại compile-time.',0),
(73,37,'Biến final có thể có giá trị khác nhau trong mỗi lần chạy chương trình.',0),
(74,37,'Biến final có thể được khởi tạo sau.',0),
(75,37,'Biến final có thể được gán lại.',1),
(76,38,'List',1),
(77,38,'Set',0),
(78,38,'var',0),
(79,38,'const',0),
(80,39,'int',0),
(81,39,'String',1),
(82,39,'List',0),
(83,39,'var',0),
(84,40,'push',0),
(85,40,'append',0),
(86,40,'delete',0),
(87,40,'forEach',1),
(88,41,'finally',0),
(89,41,'throw',0),
(90,41,'on',1),
(91,41,'catch',1),
(97,43,'Ngôn ngữ lập trình độc lập',0),
(98,43,'Framework phát triển ứng dụng đa nền tảng\n',0),
(99,43,'Hệ quản trị cơ sở dữ liệu',0),
(100,43,'Trình duyệt web',0),
(101,44,'JavaScript',0),
(102,44,'Kotlin',0),
(103,44,'Dart',1),
(104,44,'Swift',0),
(105,45,'Một kiểu dữ liệu',0),
(106,45,'Một thành phần giao diện người dùng\n',1),
(107,45,'Một thư viện xử lý mạng\n',0),
(108,45,'Một công cụ kiểm thử',0),
(109,46,'Tự động tải lại giao diện khi thay đổi code mà không cần khởi động lại ứng dụng\n',1),
(110,46,'Phương pháp tối ưu hóa hiệu năng của ứng dụng',0),
(111,46,'Công cụ gỡ lỗi của Flutter\n',0),
(112,46,'Cách cập nhật thư viện bên ngoài\n\n',0),
(113,47,'MaterialApp',1),
(114,47,'Text',0),
(115,47,'Column',0),
(116,47,'ListView',0),
(117,48,'Row',0),
(118,48,'Column',1),
(119,48,'Stack',0),
(120,48,'GridView',0),
(121,49,'Android',0),
(122,49,'iOS',0),
(123,49,'Web',0),
(124,49,'Tất cả các nền tảng trên\n\n',1),
(125,50,'Scaffold',1),
(126,50,'SafeArea',0),
(127,50,'MaterialApp',0),
(128,50,'Container',0);
/*!40000 ALTER TABLE `lua_chon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `player` (
  `uuid` varchar(36) NOT NULL,
  `session_id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(300) NOT NULL,
  `std` varchar(12) NOT NULL,
  `point` int NOT NULL DEFAULT '0',
  `thoi_gian_vao` datetime NOT NULL,
  `thoi_gian_ket_thuc` datetime DEFAULT NULL,
  `bai_lam` json NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `player_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `session` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `code_join` varchar(10) NOT NULL,
  `canva_id` int NOT NULL,
  `thoi_gian_bat_dau` datetime DEFAULT NULL,
  `trang_thai` enum('doi','dang_choi','ket_thu') NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `canva_id` (`canva_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`canva_id`) REFERENCES `canva` (`canva_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES
(7,'New session','123',5,'2025-03-06 17:22:36','doi'),
(8,'New session','ZVSKJKYBEU',5,'2025-03-06 20:42:41','doi'),
(9,'New session','NSFSZIFTKR',5,NULL,'doi'),
(10,'New session','HKPYQBSZEU',6,'2025-03-07 08:17:37','dang_choi'),
(11,'New session','1UNxA5UIAd',5,'2025-03-07 11:43:06','ket_thu'),
(12,'New session','X6NJrgwUjZ',6,NULL,'doi'),
(13,'New session','1yxtndxnrr',6,NULL,'doi'),
(14,'New session','EChxwPqLk3',6,NULL,'doi'),
(15,'New session','0BdSeaLxHd',6,NULL,'doi'),
(16,'New session','Q751kZgQq3',6,NULL,'doi');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-03-07 15:15:27
