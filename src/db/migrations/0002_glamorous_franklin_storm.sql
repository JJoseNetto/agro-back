
CREATE TYPE "role" AS ENUM('admin', 'user', 'manager');

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

INSERT INTO "users" ("email", "password", "nome", "role") 
VALUES ('admin@sistema.com', '$2b$10$rQZ8J8H8H8H8H8H8H8H8HuK', 'Sistema Admin', 'admin');

ALTER TABLE "produtores" ADD COLUMN "user_id" integer;

UPDATE "produtores" SET "user_id" = 1 WHERE "user_id" IS NULL;

ALTER TABLE "produtores" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "produtores" ADD CONSTRAINT "produtores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;