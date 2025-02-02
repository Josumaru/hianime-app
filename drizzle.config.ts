import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://postgres.zwmpyqhfwnefuwpdczpm:mAnbrUXLcVQK8sO2@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
});
