CREATE TABLE "culturas_plantadas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"fazenda_id" integer NOT NULL,
	"safra_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fazendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cidade" varchar(100) NOT NULL,
	"estado" varchar(2) NOT NULL,
	"area_total" numeric(10, 2) NOT NULL,
	"area_agricultavel" numeric(10, 2) NOT NULL,
	"area_vegetacao" numeric(10, 2) NOT NULL,
	"produtor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "produtores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cpf_ou_cnpj" varchar(18) NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "produtores_cpf_ou_cnpj_unique" UNIQUE("cpf_ou_cnpj")
);
--> statement-breakpoint
CREATE TABLE "safras" (
	"id" serial PRIMARY KEY NOT NULL,
	"ano" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "culturas_plantadas" ADD CONSTRAINT "culturas_plantadas_fazenda_id_fazendas_id_fk" FOREIGN KEY ("fazenda_id") REFERENCES "public"."fazendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "culturas_plantadas" ADD CONSTRAINT "culturas_plantadas_safra_id_safras_id_fk" FOREIGN KEY ("safra_id") REFERENCES "public"."safras"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fazendas" ADD CONSTRAINT "fazendas_produtor_id_produtores_id_fk" FOREIGN KEY ("produtor_id") REFERENCES "public"."produtores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produtores" ADD CONSTRAINT "produtores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;