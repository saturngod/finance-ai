CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` double,
	`category` varchar(255),
	`currency` varchar(255),
	`date` datetime,
	`description` varchar(255),
	`merchant` varchar(255),
	`type` varchar(255),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_idx` UNIQUE(`category`)
);
