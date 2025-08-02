CREATE TABLE "produtores" (
	"id" serial PRIMARY KEY,
	"nome" varchar(255) NOT NULL,
	"cpf_ou_cnpj" varchar(18) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
