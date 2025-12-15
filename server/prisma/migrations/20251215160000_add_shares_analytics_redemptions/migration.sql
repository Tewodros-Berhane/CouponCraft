-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT,
    "config" JSONB,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "redemptions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customerRef" TEXT,
    "context" JSONB,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Share_couponId_idx" ON "Share"("couponId");
CREATE INDEX "AnalyticsEvent_couponId_idx" ON "AnalyticsEvent"("couponId");
CREATE INDEX "Redemption_couponId_idx" ON "Redemption"("couponId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
