-- Add new addresses column as JSONB (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Customer' 
        AND column_name = 'addresses'
    ) THEN
        ALTER TABLE "Customer" ADD COLUMN "addresses" JSONB;
    END IF;
END $$;

-- Migrate existing address data to addresses array format (only if address column exists)
-- Convert single address string to array with one address object
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'Customer' 
        AND column_name = 'address'
    ) THEN
        UPDATE "Customer"
        SET "addresses" = jsonb_build_array(
            jsonb_build_object(
                'name', COALESCE("address", '')
            )
        )
        WHERE "address" IS NOT NULL AND "address" != '' 
        AND ("addresses" IS NULL OR "addresses" = '[]'::jsonb);
        
        -- Drop the old address column
        ALTER TABLE "Customer" DROP COLUMN IF EXISTS "address";
    END IF;
END $$;
