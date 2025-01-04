-- AlterTable
ALTER TABLE "RiskFactorDataRecComments" ADD COLUMN     "previous_status" "StatusEnum",
ADD COLUMN     "previous_valid_date" TIMESTAMP(3),
ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "textType" DROP NOT NULL;
