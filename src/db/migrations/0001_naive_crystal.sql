CREATE TABLE "culturas_plantadas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"fazenda_id" serial NOT NULL,
	"safra_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "fazendas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cidade" varchar(100) NOT NULL,
	"estado" varchar(2) NOT NULL,
	"area_total" numeric(10, 2) NOT NULL,
	"area_agricultavel" numeric(10, 2) NOT NULL,
	"area_vegetacao" numeric(10, 2) NOT NULL,
	"produtor_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "safras" (
	"id" serial PRIMARY KEY NOT NULL,
	"ano" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);

ALTER TABLE "culturas_plantadas" ADD CONSTRAINT "culturas_plantadas_fazenda_id_fazendas_id_fk" FOREIGN KEY ("fazenda_id") REFERENCES "public"."fazendas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "culturas_plantadas" ADD CONSTRAINT "culturas_plantadas_safra_id_safras_id_fk" FOREIGN KEY ("safra_id") REFERENCES "public"."safras"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fazendas" ADD CONSTRAINT "fazendas_produtor_id_produtores_id_fk" FOREIGN KEY ("produtor_id") REFERENCES "public"."produtores"("id") ON DELETE cascade ON UPDATE no action;