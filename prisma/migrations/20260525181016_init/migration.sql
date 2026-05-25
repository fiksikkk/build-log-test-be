-- AlterTable
ALTER TABLE "measurement_units" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "work_log_entries" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "work_types" ALTER COLUMN "updated_at" DROP DEFAULT;
