import { pgTable, foreignKey, pgPolicy, bigint, uuid, text, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const historyManga = pgTable("history_manga", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "history_manga_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: uuid("user_id"),
	chapter: text(),
	volume: text(),
	mangaTitle: text("manga_title"),
	title: text(),
	mangaId: text("manga_id"),
	chapterId: text("chapter_id"),
	cover: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "history_manga_user_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can delete their own manga history", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
	pgPolicy("Users can update their own manga history", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Users can insert their own manga history", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Users can select their own manga history", { as: "permissive", for: "select", to: ["authenticated"] }),
]);

export const historyAnime = pgTable("history_anime", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "history_anime_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: uuid("user_id"),
	cover: text(),
	animeTitle: text("anime_title"),
	title: text(),
	animeId: text("anime_id"),
	episodeId: text("episode_id"),
	episode: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "history_anime_user_id_fkey"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: uuid("user_id"),
	name: text(),
	email: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	animePreferences: text("anime_preferences"),
	mangaPreferences: text("manga_preferences"),
	profileImage: text("profile_image"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [table.id],
			name: "users_user_id_fkey"
		}).onDelete("cascade"),
	unique("users_email_key").on(table.email),
	pgPolicy("Users can delete their own records", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
	pgPolicy("Users can update their own records", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Users can insert their own records", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Users can select their own records", { as: "permissive", for: "select", to: ["authenticated"] }),
]);
