PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "updatedAt", "createdAt", "deletedAt") SELECT "id", "name", "email", "updatedAt", "createdAt", "deletedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;