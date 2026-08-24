# Production Deployment Guide

Complete guide to deploy the Solana Betting dApp to production.

## Overview

We'll deploy:
1. **Frontend** → Vercel (free)
2. **Backend API** → Railway (free tier)
3. **Database** → Railway PostgreSQL (free tier)
4. **Solana Program** → Already on Devnet

**Total Cost:** $0 (using free tiers)

---

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (sign up with GitHub)
- ✅ Railway account (sign up with GitHub)
- ✅ Solana program deployed to Devnet

---

## Step 1: Deploy Database (Railway)

### 1.1 Create Railway Account

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Login with GitHub
4. Click "Deploy a New Project"

### 1.2 Deploy PostgreSQL

1. Click "Provision PostgreSQL"
2. Wait for deployment (1-2 minutes)
3. Click on the PostgreSQL service
4. Go to "Variables" tab
5. Copy the `DATABASE_URL` value

Example:
```
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
```

**Save this URL - you'll need it for backend!**

---

## Step 2: Deploy Backend API (Railway)

### 2.1 Create Backend Service

1. In Railway dashboard, click "New"
2. Select "GitHub Repo"
3. Choose `solana-betting-dapp` repository
4. Railway will detect the backend automatically

### 2.2 Configure Build Settings

1. Click on the backend service
2. Go to "Settings" tab
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install && npx prisma generate && npm run build`
5. Set **Start Command**: `npm start`

### 2.3 Add Environment Variables

Click "Variables" tab and add:

```env
DATABASE_URL=<paste_from_step_1>
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=<your_deployed_program_id>
CORS_ORIGIN=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace:
- `PROGRAM_ID` with your actual program ID
- `CORS_ORIGIN` will be updated after frontend deployment

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Once deployed, click on the service
4. Copy the public URL (e.g., `https://solana-betting-backend.railway.app`)

**Save this URL - you'll need it for frontend!**

### 2.5 Initialize Database

Railway will automatically run Prisma migrations on deployment.

To verify:
1. Go to PostgreSQL service
2. Click "Query" tab
3. Run: `SELECT * FROM "events" LIMIT 1;`

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account

1. Go to https://vercel.com/
2. Click "Sign Up"
3. Login with GitHub

### 3.2 Import Project

1. Click "Add New Project"
2. Import `solana-betting-dapp` repository
3. Vercel will auto-detect Next.js

### 3.3 Configure Project

**Framework Preset:** Next.js  
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`

### 3.4 Add Environment Variables

Click "Environment Variables" and add:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
NEXT_PUBLIC_API_URL=<your_railway_backend_url>/api
```

**Replace:**
- `NEXT_PUBLIC_PROGRAM_ID` with your program ID
- `NEXT_PUBLIC_API_URL` with Railway backend URL from Step 2

Example:
```env
NEXT_PUBLIC_API_URL=https://solana-betting-backend.railway.app/api
```

### 3.5 Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Once done, you'll get a URL like: `https://solana-betting-dapp.vercel.app`

**This is your live application URL!** 🎉

---

## Step 4: Update CORS

Now that frontend is deployed, update backend CORS:

1. Go back to Railway dashboard
2. Click on backend service
3. Go to "Variables"
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://solana-betting-dapp.vercel.app
   ```
5. Save (Railway will auto-redeploy)

---

## Step 5: Test Your Deployment

### 5.1 Test Backend

```bash
curl https://your-backend.railway.app/health
```

Expected:
```json
{"status":"ok","timestamp":"..."}
```

### 5.2 Test Frontend

1. Open your Vercel URL
2. You should see the landing page
3. Try connecting wallet
4. Browse events (may be empty initially)

### 5.3 Create First Event

1. Go to `/admin` page
2. Connect wallet
3. Click "Initialize Platform" (one-time)
4. Create a test event
5. Event should appear on main page

---

## Alternative Hosting Options

### Option 2: Deploy Everything to Vercel

**Frontend + Backend on Vercel:**

1. Keep frontend deployment as-is
2. For backend, convert to Vercel Serverless Functions:
   - Move backend code to `api/` folder
   - Deploy database to Vercel Postgres or Supabase

**Pros:** Single platform, easy setup  
**Cons:** Serverless limitations, cold starts

### Option 3: Deploy to Heroku

**Backend + Database on Heroku:**

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create solana-betting-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set config
heroku config:set NODE_ENV=production
heroku config:set PROGRAM_ID=your_program_id
heroku config:set CORS_ORIGIN=your_vercel_url

# Deploy
git subtree push --prefix backend heroku main
```

**Frontend still on Vercel**

### Option 4: VPS (DigitalOcean/AWS/Linode)

For complete control:

1. Rent a VPS ($5-10/month)
2. Install Docker
3. Clone repository
4. Run `docker-compose up -d`
5. Configure domain and SSL

---

## Custom Domain Setup

### For Vercel (Frontend)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `mybet.app`)
4. Follow DNS configuration instructions
5. SSL is automatic

### For Railway (Backend)

1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add custom domain (e.g., `api.mybet.app`)
4. Configure DNS as instructed
5. SSL is automatic

---

## Environment Variables Summary

### Frontend (Vercel)
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<program_id>
NEXT_PUBLIC_API_URL=<backend_url>/api
```

### Backend (Railway)
```env
DATABASE_URL=<railway_postgres_url>
NODE_ENV=production
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=<program_id>
CORS_ORIGIN=<vercel_frontend_url>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Production Checklist

Before going live:

- [ ] Solana program deployed to Devnet
- [ ] Database deployed and accessible
- [ ] Backend API deployed and responding
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test wallet connection
- [ ] Test creating event
- [ ] Test placing bet
- [ ] Test viewing dashboard
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)
- [ ] Monitoring setup (optional)

---

## Monitoring & Maintenance

### Railway Monitoring

1. Railway provides built-in metrics
2. Check CPU, Memory, Network usage
3. View logs in real-time
4. Set up alerts for downtime

### Vercel Monitoring

1. Vercel Analytics (free)
2. View page views, performance
3. Error tracking
4. Deploy logs

### Database Backups

Railway PostgreSQL includes:
- Automatic daily backups
- Point-in-time recovery
- Manual backup option

To manually backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## Troubleshooting

### Frontend Issues

**Error: API calls failing**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is running
- Check browser console for CORS errors

**Error: Wallet won't connect**
- Ensure wallet is on Devnet
- Check browser console
- Try different wallet

### Backend Issues

**Error: Database connection failed**
- Verify `DATABASE_URL` is correct
- Check Railway PostgreSQL is running
- Run `npx prisma db push` to sync schema

**Error: CORS blocked**
- Update `CORS_ORIGIN` in backend
- Must match frontend URL exactly
- Redeploy backend after change

### Railway Deployment Failed

```bash
# Check logs
railway logs

# Restart service
railway restart

# Redeploy
git push
```

---

## Scaling & Upgrades

### When to Upgrade

**Railway Free Tier Limits:**
- 500 hours/month
- Shared CPU
- 512MB RAM
- 1GB disk

**Upgrade when:**
- Traffic exceeds limits
- Need more resources
- Want dedicated instances
- Need better performance

**Cost:** $5-20/month for hobby plan

### Vercel Free Tier

- 100GB bandwidth/month
- Unlimited deployments
- Automatic scaling

**Upgrade:** $20/month for Pro features

---

## Security Best Practices

### Production Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL/TLS everywhere
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts
- [ ] Regular security updates
- [ ] Database backups configured

### Recommended Tools

- **Monitoring:** Sentry (error tracking)
- **Analytics:** Vercel Analytics, Plausible
- **Uptime:** UptimeRobot (free monitoring)
- **Performance:** Vercel Speed Insights

---

## Cost Breakdown

### Free Tier (What we're using)

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | $0 | 100GB bandwidth/month |
| Railway | $0 | 500 hours/month, 512MB RAM |
| Railway PostgreSQL | $0 | 1GB storage |
| **Total** | **$0** | Suitable for MVP/demo |

### Paid Tier (For Production)

| Service | Cost/month | What you get |
|---------|------------|--------------|
| Vercel Pro | $20 | More bandwidth, team features |
| Railway Hobby | $5-20 | Dedicated resources, more hours |
| **Total** | **$25-40** | Production-ready setup |

---

## Next Steps After Deployment

1. **Test Everything**
   - Connect wallet
   - Create events
   - Place bets
   - Check dashboard

2. **Share Your App**
   - Tweet your URL
   - Post on Reddit (r/solana)
   - Share on Discord
   - Add to portfolio

3. **Monitor Performance**
   - Set up Vercel Analytics
   - Check Railway metrics
   - Monitor error logs

4. **Iterate**
   - Gather user feedback
   - Fix bugs
   - Add features
   - Improve UX

---

## Support

**Need Help?**
- Check Railway docs: https://docs.railway.app
- Check Vercel docs: https://vercel.com/docs
- Open GitHub issue: https://github.com/ritikravi/solana-betting-dapp/issues

---

## Summary

✅ **Frontend:** Vercel  
✅ **Backend:** Railway  
✅ **Database:** Railway PostgreSQL  
✅ **Cost:** $0 (free tiers)  
✅ **Time:** 30-45 minutes  
✅ **SSL:** Automatic  
✅ **Scaling:** Automatic  

**Your app is now LIVE! 🚀**
