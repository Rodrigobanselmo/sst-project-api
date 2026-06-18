-- Data de emissão formal do documento (distinta de created_at/updated_at de auditoria)
ALTER TABLE "RiskFactorDocument" ADD COLUMN "documentDate" TIMESTAMP(3);
