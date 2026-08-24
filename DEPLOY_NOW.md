# 🚀 Deploy Your App NOW - Quick Guide

Follow these simple steps to get your app live in 30 minutes!

## 📋 Before You Start

✅ GitHub account  
✅ This repository pushed to GitHub  
✅ Solana program deployed to Devnet  
✅ Program ID ready  

---

## 🎯 Quick Deployment (3 Steps)

### STEP 1: Deploy Database & Backend (Railway) - 10 minutes

1. **Go to Railway:** https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → **Provision PostgreSQL**
4. **Copy DATABASE_URL** from Variables tab
5. **New** → **Deploy from GitHub**
6. **Select** your repository
7. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
8. **Add Variables:**
   ```
   DATABASE_URL=<paste_from_step_4>
   NODE_ENV=production
   PROGRAM_ID=<your_program_id>
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_NETWORK=devnet
   CORS_ORIGIN=*
   ```
9. **Deploy** and wait
10. **Copy backend URL** (e.g., `https://xxx.railway.app`)

---

### STEP 2: Deploy Frontend (Vercel) - 10 minutes

1. **Go to Vercel:** https://vercel.com/
2. **Sign up** with GitHub
3. **New Project** → **Import** your repository
4. **Settings:**
   - Framework: Next.js
   - Root Directory: `frontend`
5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_PROGRAM_ID=<your_program_id>
   NEXT_PUBLIC_API_URL=<railway_backend_url>/api
   ```
6. **Deploy**
7. **Copy frontend URL** (e.g., `https://xxx.vercel.app`)

---

### STEP 3: Update CORS - 2 minutes

1. **Go back to Railway**
2. **Backend service** → **Variables**
3. **Update CORS_ORIGIN:**
   ```
   CORS_ORIGIN=<your_vercel_url>
   ```
4. **Save** (auto-redeploys)

---

## ✅ Done! Test Your App

1. **Open your Vercel URL**
2. **Connect Wallet** (set to Devnet)
3. **Go to /admin**
4. **Click "Initialize Platform"**
5. **Create a test event**
6. **Place a bet**

---

## 🎉 Your URLs

**Frontend:** https://your-app.vercel.app  
**Backend:** https://your-api.railway.app  
**Admin:** https://your-app.vercel.app/admin  

---

## 🐛 Quick Fixes

### Frontend shows errors?
- Check browser console
- Verify all environment variables are set
- Make sure wallet is on Devnet

### Backend not responding?
- Check Railway logs
- Verify DATABASE_URL is set
- Check CORS_ORIGIN matches frontend URL

### Can't connect wallet?
- Ensure wallet is on Devnet (not Mainnet)
- Try different wallet (Phantom/Solflare)
- Check browser console for errors

---

## 📊 What You Get (Free!)

✅ Live frontend on Vercel  
✅ Live backend API on Railway  
✅ PostgreSQL database on Railway  
✅ Automatic SSL certificates  
✅ Automatic scaling  
✅ CI/CD pipeline  
✅ Domain support (optional)  

**Total Cost: $0/month** (using free tiers)

---

## 🚀 Next Steps

1. **Share your app:**
   - Twitter/X with #Solana
   - Reddit r/solana
   - LinkedIn
   - Discord

2. **Add custom domain:**
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel settings
   - Update CORS in Railway

3. **Monitor:**
   - Check Vercel Analytics
   - Check Railway metrics
   - Set up error tracking (Sentry)

---

## 📚 Need More Details?

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for:
- Alternative hosting options
- Custom domain setup
- Monitoring & scaling
- Troubleshooting guide
- Production checklist

---

## 💡 Pro Tips

1. **Use Railway's free tier** for testing
2. **Upgrade when traffic grows** (~$5/month)
3. **Add monitoring early** (UptimeRobot is free)
4. **Enable analytics** (Vercel Analytics is free)
5. **Set up alerts** for downtime

---

## ⚡ One-Click Deploy (Alternative)

**Coming Soon:** Deploy button for instant setup!

---

## 🆘 Need Help?

- **Docs:** [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
- **Issues:** https://github.com/ritikravi/solana-betting-dapp/issues
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs

---

**Ready? Let's deploy! 🚀**

Start with Step 1 above ☝️
