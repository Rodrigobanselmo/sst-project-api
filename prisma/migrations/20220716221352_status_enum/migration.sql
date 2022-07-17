-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusEnum" ADD VALUE 'PROCESSING';
ALTER TYPE "StatusEnum" ADD VALUE 'EXPIRED';
ALTER TYPE "StatusEnum" ADD VALUE 'VALID';
ALTER TYPE "StatusEnum" ADD VALUE 'INVALID';
ALTER TYPE "StatusEnum" ADD VALUE 'ERROR';
