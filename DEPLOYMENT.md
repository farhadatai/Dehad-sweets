# Dehat Sweets Deployment

## Supabase

1. Open the Supabase project named `Dehat sweets`.
2. Go to Project Settings > Database > Connection string.
3. Add these values to `.env` for local work and to Vercel Environment Variables for production:

```env
DATABASE_URL="postgres://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
```

Use the transaction pooler string for `DATABASE_URL` and the session/direct string for `DIRECT_URL`.

## Vercel

1. Import this project into Vercel.
2. Add the Supabase `DATABASE_URL` and `DIRECT_URL` environment variables.
3. Keep the build command as `npm run vercel-build`.
4. Deploy.
5. After the first successful deploy, run `npm run db:seed` once with the production Supabase environment if you want the default admin, tablet, and employee accounts created.

## Domain

Add both domains in Vercel:

```text
dehatsweets.com
www.dehatsweets.com
```

At your domain provider, point DNS to Vercel using the values Vercel shows in the Domains screen. Common defaults are:

```text
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns-0.com
```
