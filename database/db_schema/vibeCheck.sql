CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usr_username` varchar(100) NOT NULL,
  `usr_salt` varchar(100) NOT NULL,
  `usr_password` varchar(300) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `user`;

CREATE TABLE IF NOT EXISTS `vibe` (
  `vib_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `vib_name` varchar(100) NOT NULL,
  `vib_floor` int(10) unsigned NOT NULL,
  `usr_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`vib_id`),
  FOREIGN KEY (`usr_id`) REFERENCES user (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `vibe`;

CREATE TABLE IF NOT EXISTS `leaderboard` (
  `ldb_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ldb_ranking` int(10) unsigned NOT NULL,
  `usr_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ldb_id`),
  FOREIGN KEY (`usr_id`) REFERENCES user (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `leaderboard`;