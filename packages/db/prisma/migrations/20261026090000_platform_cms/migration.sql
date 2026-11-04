-- Additive platform configuration and read-only provider-event ledger.
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'platform',
    "draft" JSONB NOT NULL,
    "published" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlatformSettings_singleton_check" CHECK ("id" = 'platform'),
    CONSTRAINT "PlatformSettings_version_check" CHECK ("version" >= 0)
);
CREATE TABLE "PlatformRevision" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "publisherId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlatformRevision_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PlatformRevision_version_check" CHECK ("version" > 0)
);
CREATE TABLE "TransactionRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "creatorId" TEXT,
    "subscriptionId" TEXT,
    "provider" TEXT NOT NULL,
    "externalEventId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TransactionRecord_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "TransactionRecord_amount_check" CHECK ("amountMinor" >= 0),
    CONSTRAINT "TransactionRecord_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
    CONSTRAINT "TransactionRecord_kind_check" CHECK ("kind" IN ('CHARGE','REFUND')),
    CONSTRAINT "TransactionRecord_status_check" CHECK ("status" IN ('PENDING','SUCCEEDED','FAILED'))
);
CREATE UNIQUE INDEX "PlatformRevision_version_key" ON "PlatformRevision"("version");
CREATE INDEX "PlatformRevision_publishedAt_idx" ON "PlatformRevision"("publishedAt");
CREATE UNIQUE INDEX "TransactionRecord_provider_externalEventId_key" ON "TransactionRecord"("provider","externalEventId");
CREATE INDEX "TransactionRecord_occurredAt_id_idx" ON "TransactionRecord"("occurredAt","id");
CREATE INDEX "TransactionRecord_currency_status_kind_idx" ON "TransactionRecord"("currency","status","kind");
CREATE INDEX "TransactionRecord_userId_idx" ON "TransactionRecord"("userId");
CREATE INDEX "TransactionRecord_creatorId_idx" ON "TransactionRecord"("creatorId");
CREATE INDEX "TransactionRecord_subscriptionId_idx" ON "TransactionRecord"("subscriptionId");
ALTER TABLE "PlatformRevision" ADD CONSTRAINT "PlatformRevision_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionRecord" ADD CONSTRAINT "TransactionRecord_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Corrections and provider status changes must be recorded as new verified events.
CREATE FUNCTION "reject_immutable_record_change"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'Published revisions and transaction ledger entries are immutable';
END;
$$;
CREATE TRIGGER "TransactionRecord_immutable" BEFORE UPDATE OR DELETE ON "TransactionRecord" FOR EACH ROW EXECUTE FUNCTION "reject_immutable_record_change"();
CREATE TRIGGER "PlatformRevision_immutable" BEFORE UPDATE OR DELETE ON "PlatformRevision" FOR EACH ROW EXECUTE FUNCTION "reject_immutable_record_change"();
