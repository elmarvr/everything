CREATE TABLE `list_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`listId` integer,
	`userId` integer,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`listId`) REFERENCES `list`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`deletedAt` integer
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`githubId` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "githubId", "updatedAt", "createdAt", "deletedAt") SELECT "id", "name", "email", "githubId", "updatedAt", "createdAt", "deletedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;