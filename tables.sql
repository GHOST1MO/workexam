-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 04, 2020 at 03:34 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejsexam`
--

-- --------------------------------------------------------

--
-- Table structure for table `directory`
--

CREATE TABLE `directory` (
  `dir_id` int(11) NOT NULL,
  `parent_path` varchar(250) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `directory`
--

INSERT INTO `directory` (`dir_id`, `parent_path`, `name`) VALUES
(1, '/', 'temp'),
(111, '/', 'abd'),
(112, '/abd', 'asdfghj'),
(124, '/abd', 'abdin');

-- --------------------------------------------------------

--
-- Table structure for table `dirprivilege`
--

CREATE TABLE `dirprivilege` (
  `username` varchar(100) NOT NULL,
  `dir_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dirprivilege`
--

INSERT INTO `dirprivilege` (`username`, `dir_id`) VALUES
('Abd', 1),
('Abd', 111),
('Abd', 112),
('abd', 124);

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `file_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(25) NOT NULL DEFAULT '0',
  `dir_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `token` varchar(16) NOT NULL,
  `username` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`token`, `username`) VALUES
('8LuWrGEnPqTsBRIj', 'abd'),
('q7mrnxrM2uPNeJGn', 'abd'),
('rsHO9UEd6zRB6klD', 'abd');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `fname`, `lname`) VALUES
('Abd', '1', 'abd', 'MO');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `directory`
--
ALTER TABLE `directory`
  ADD PRIMARY KEY (`dir_id`);

--
-- Indexes for table `dirprivilege`
--
ALTER TABLE `dirprivilege`
  ADD PRIMARY KEY (`username`,`dir_id`),
  ADD KEY `pdirId_to_dir` (`dir_id`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `dir_id` (`dir_id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `directory`
--
ALTER TABLE `directory`
  MODIFY `dir_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dirprivilege`
--
ALTER TABLE `dirprivilege`
  ADD CONSTRAINT `pdirId_to_dir` FOREIGN KEY (`dir_id`) REFERENCES `directory` (`dir_id`),
  ADD CONSTRAINT `pusername_to_user` FOREIGN KEY (`username`) REFERENCES `user` (`username`);

--
-- Constraints for table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `dirId_to_dir` FOREIGN KEY (`dir_id`) REFERENCES `directory` (`dir_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
