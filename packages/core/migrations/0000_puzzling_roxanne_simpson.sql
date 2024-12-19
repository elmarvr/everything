CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`deletedAt` integer
);
