-- FASE 1: Multi-vendor data model refactor
-- Changes: Rename ArtistProfile → Seller, add new fields, create ModelFile & QuoteRequest

-- Step 1: Create new enums
CREATE TYPE "SellerVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');
CREATE TYPE "QuoteRequestStatus" AS ENUM ('PENDING', 'QUOTED', 'ACCEPTED', 'REJECTED', 'PRODUCTION', 'COMPLETED');

-- Step 2: Add new columns to ArtistProfile before renaming
ALTER TABLE "ArtistProfile" ADD COLUMN "storeName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ArtistProfile" ADD COLUMN "verificationStatus" "SellerVerificationStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "ArtistProfile" ADD COLUMN "stripeAccountId" TEXT;

-- Step 3: Rename ArtistProfile to Seller
ALTER TABLE "ArtistProfile" RENAME TO "Seller";

-- Step 4: Rename column in Seller table (displayName → storeName if needed, but we added storeName, so rename displayName)
ALTER TABLE "Seller" RENAME COLUMN "displayName" TO "storeNameOld";
UPDATE "Seller" SET "storeName" = "storeNameOld" WHERE "storeNameOld" IS NOT NULL AND "storeName" = '';
ALTER TABLE "Seller" DROP COLUMN "storeNameOld";

-- Step 5: Update foreign key references in Product table
ALTER TABLE "Product" RENAME COLUMN "artistId" TO "sellerId";
ALTER TABLE "Product" ALTER COLUMN "sellerId" SET NOT NULL;

-- Step 6: Rename foreign key constraint in Product
ALTER TABLE "Product" DROP CONSTRAINT "Product_artistId_fkey";
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE;

-- Step 7: Create ModelFile table
CREATE TABLE "ModelFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'unknown',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ModelFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Step 8: Create QuoteRequest table
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "modelFileId" TEXT,
    "material" TEXT,
    "notes" TEXT,
    "quotedPrice" DOUBLE PRECISION,
    "status" "QuoteRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "QuoteRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "QuoteRequest_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE,
    CONSTRAINT "QuoteRequest_modelFileId_fkey" FOREIGN KEY ("modelFileId") REFERENCES "ModelFile"("id") ON DELETE SET NULL
);

-- Step 9: Add sellerId to Order table
ALTER TABLE "Order" ADD COLUMN "sellerId" TEXT;
-- Set sellerId to first seller (or backfill logic)
UPDATE "Order" SET "sellerId" = (SELECT id FROM "Seller" LIMIT 1) WHERE "sellerId" IS NULL;
ALTER TABLE "Order" ALTER COLUMN "sellerId" SET NOT NULL;

-- Step 10: Add foreign key for Order.sellerId
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE;

-- Step 11: Add sellerId and seller FK to OrderItem
ALTER TABLE "OrderItem" ADD COLUMN "sellerId" TEXT;
-- Backfill from product.sellerId
UPDATE "OrderItem" oi SET "sellerId" = (SELECT "sellerId" FROM "Product" WHERE "id" = oi."productId")
  WHERE "sellerId" IS NULL;
ALTER TABLE "OrderItem" ALTER COLUMN "sellerId" SET NOT NULL;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE;

-- Step 12: Create index on ModelFile.userId for faster lookups
CREATE INDEX "ModelFile_userId_idx" ON "ModelFile"("userId");

-- Step 13: Create index on QuoteRequest for common queries
CREATE INDEX "QuoteRequest_buyerId_idx" ON "QuoteRequest"("buyerId");
CREATE INDEX "QuoteRequest_sellerId_idx" ON "QuoteRequest"("sellerId");
CREATE INDEX "QuoteRequest_status_idx" ON "QuoteRequest"("status");

-- Step 14: Update User relationships references (if Prisma needs relation hints)
-- This is handled by Prisma relations, no SQL needed

-- Step 15: Drop old foreign key in Review if it still references ArtistProfile
-- Review doesn't directly reference ArtistProfile, so no changes needed

-- Step 16: Verify User.role values can be SELLER (should already work with existing enum)
-- No SQL change needed

-- End of migration
