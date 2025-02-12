/*
  Warnings:

  - Changed the type of `deliveryDetails` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryDetails",
ADD COLUMN     "deliveryDetails" JSONB NOT NULL;
