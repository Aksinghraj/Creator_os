import { artifacts, users } from "./schema";
import { relations } from "drizzle-orm";

export const artifactRelations = relations(artifacts, ({ one }) => ({
	user: one(users, {
		fields: [artifacts.userId],
		references: [users.id],
	}),
}));
