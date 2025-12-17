-- CreateIndex
CREATE INDEX "AnalyticsEvent_couponId_idx" ON "AnalyticsEvent"("couponId");

-- CreateIndex
CREATE INDEX "Redemption_couponId_idx" ON "Redemption"("couponId");

-- CreateIndex
CREATE INDEX "Share_couponId_idx" ON "Share"("couponId");
