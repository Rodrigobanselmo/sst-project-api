-- AlterTable
ALTER TABLE "CompanyCharacterization" ADD COLUMN     "activities" TEXT[],
ADD COLUMN     "luminosity" TEXT,
ADD COLUMN     "moisturePercentage" TEXT,
ADD COLUMN     "noiseValue" TEXT,
ADD COLUMN     "temperature" TEXT;

-- AlterTable
ALTER TABLE "CompanyEnvironment" ADD COLUMN     "activities" TEXT[];
