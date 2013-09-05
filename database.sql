SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `invent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `node_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `parent` int(11) NOT NULL DEFAULT '0',
  `SN` varchar(50) COLLATE utf8_bin NOT NULL,
  `des` varchar(150) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `node_id` (`node_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `invent_type` (
  `invent_type` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`invent_type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


INSERT INTO `invent_type` (`invent_type`, `name`) VALUES
(1, 'Splice'),
(2, 'Patch-panel'),
(3, 'Box');


CREATE TABLE IF NOT EXISTS `lines` (
  `line_id` int(11) NOT NULL AUTO_INCREMENT,
  `frm_pt_id` int(11) NOT NULL,
  `to_pt_id` int(11) NOT NULL,
  `frm_inv` int(11) NOT NULL,
  `to_inv` int(11) NOT NULL,
  `type_line_id` int(11) NOT NULL,
  `lenght` int(11) NOT NULL,
  `clients` tinyint(1) NOT NULL DEFAULT '0',
  `who` int(11) NOT NULL,
  `when` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`line_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='Відображає лінії';

CREATE TABLE IF NOT EXISTS `LineStrings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `line_id` int(11) NOT NULL,
  `ord` int(11) NOT NULL,
  `x` varchar(20) COLLATE utf8_bin NOT NULL,
  `y` varchar(20) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `point` (
  `pt_id` int(11) NOT NULL AUTO_INCREMENT,
  `city` text NOT NULL,
  `street` text NOT NULL,
  `house` varchar(10) NOT NULL,
  `room` varchar(10) NOT NULL DEFAULT ' ',
  `type_pnt_id` int(11) NOT NULL,
  `coord_n` varchar(20) NOT NULL,
  `coord_e` varchar(20) NOT NULL,
  `comment` varchar(50) NOT NULL,
  `added_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `who_add` int(11) NOT NULL,
  `des` varchar(400) NOT NULL DEFAULT ' ',
  PRIMARY KEY (`pt_id`),
  UNIQUE KEY `pt_id` (`pt_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `type_lines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `comm` varchar(50) NOT NULL,
  `color` varchar(10) NOT NULL DEFAULT '#000000',
  `width` int(11) NOT NULL DEFAULT '2',
  `opacity` float NOT NULL DEFAULT '0.5',
  `modules` tinyint(4) NOT NULL,
  `fibers` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `type_points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `comm` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `usr_id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(30) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `name` varchar(30) NOT NULL,
  `rights` varchar(100) NOT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `usr_coord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE IF NOT EXISTS `joins` (
          `invent_id` int(11) NOT NULL,
          `id_fib_from` varchar(20) COLLATE utf8_bin NOT NULL,
          `fib_num_from` int(11) NOT NULL,
          `id_fib_to` varchar(20) COLLATE utf8_bin NOT NULL,
          `fib_num_to` int(11) NOT NULL,
           KEY `invent_id` (`invent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

ALTER TABLE `invent` ADD INDEX ( `node_id` );

ALTER TABLE `invent` ADD `options` VARCHAR( 40 ) NOT NULL; 

ALTER TABLE `invent_type` ADD `connect` VARCHAR( 50 ) NOT NULL DEFAULT '0';

