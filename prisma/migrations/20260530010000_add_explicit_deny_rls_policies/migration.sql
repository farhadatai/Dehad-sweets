-- The app reads and writes through the private Express API with Prisma.
-- These policies intentionally block Supabase's public API roles from direct table access.
DO $$
DECLARE
  table_name text;
  table_ref regclass;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'Employee',
    'Expense',
    'HistoricalRecord',
    'InventoryLog',
    'Order',
    'Payroll',
    'Product',
    'ProductionGoal',
    'Store',
    'TimeLog',
    'User',
    '_prisma_migrations'
  ]
  LOOP
    SELECT to_regclass(format('public.%I', table_name)) INTO table_ref;

    IF table_ref IS NOT NULL AND NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = table_name
        AND policyname = 'deny_public_api_access'
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON %s FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
        'deny_public_api_access',
        table_ref
      );
    END IF;
  END LOOP;
END $$;
