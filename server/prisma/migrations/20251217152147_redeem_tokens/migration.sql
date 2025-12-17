-- DropIndex
DROP INDEX "AnalyticsEvent_couponId_idx";

-- DropIndex
DROP INDEX "Redemption_couponId_idx";

-- DropIndex
DROP INDEX "Share_couponId_idx";

-- CreateTable
CREATE TABLE "RedeemToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedeemToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RedeemToken_tokenHash_key" ON "RedeemToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RedeemToken_shareId_idx" ON "RedeemToken"("shareId");

-- CreateIndex
CREATE INDEX "RedeemToken_couponId_idx" ON "RedeemToken"("couponId");

-- AddForeignKey
ALTER TABLE "RedeemToken" ADD CONSTRAINT "RedeemToken_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedeemToken" ADD CONSTRAINT "RedeemToken_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
