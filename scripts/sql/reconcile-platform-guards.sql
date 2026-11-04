-- Recovery for a database created with `prisma db push`, after a schema diff
-- confirms it matches prisma/schema. Run once before baselining migrations.
-- This file is intentionally separate from the normal migration path.
BEGIN;
ALTER TABLE "PlatformSettings"
  ADD CONSTRAINT "PlatformSettings_singleton_check" CHECK ("id" = 'platform'),
  ADD CONSTRAINT "PlatformSettings_version_check" CHECK ("version" >= 0);
ALTER TABLE "PlatformRevision"
  ADD CONSTRAINT "PlatformRevision_version_check" CHECK ("version" > 0);
ALTER TABLE "TransactionRecord"
  ADD CONSTRAINT "TransactionRecord_amount_check" CHECK ("amountMinor" >= 0),
  ADD CONSTRAINT "TransactionRecord_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
  ADD CONSTRAINT "TransactionRecord_kind_check" CHECK ("kind" IN ('CHARGE','REFUND')),
  ADD CONSTRAINT "TransactionRecord_status_check" CHECK ("status" IN ('PENDING','SUCCEEDED','FAILED'));
CREATE FUNCTION "reject_immutable_record_change"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'Published revisions and transaction ledger entries are immutable';
END;
$$;
CREATE TRIGGER "TransactionRecord_immutable" BEFORE UPDATE OR DELETE ON "TransactionRecord"
  FOR EACH ROW EXECUTE FUNCTION "reject_immutable_record_change"();
CREATE TRIGGER "PlatformRevision_immutable" BEFORE UPDATE OR DELETE ON "PlatformRevision"
  FOR EACH ROW EXECUTE FUNCTION "reject_immutable_record_change"();
COMMIT;
