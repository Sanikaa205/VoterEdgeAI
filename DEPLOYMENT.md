# VoterEdge AI — Cloud Run Deployment with Secret Manager

## Prerequisites

- GCP project created and billing enabled
- `gcloud` CLI installed and authenticated
- Docker installed (for local testing)
- Your secrets ready:
  - `GEMINI_API_KEY` (your Gemini API key)

Note: your Firebase frontend values (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.) are public app config, not backend secrets. They belong in the frontend build environment, not Secret Manager.

---

## Step 1: Set Up GCP Project Variables

```bash
# Replace with your actual GCP project ID
export PROJECT_ID="your-gcp-project-id"
export REGION="asia-south1"
export SERVICE_NAME="voteredge-ai"

# Set the default project
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

## Step 2: Create Secrets in Google Secret Manager

Create each secret with a meaningful name. These will be referenced during deployment.

```bash
# Create GEMINI_API_KEY secret
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create voteredge-gemini-key --data-file=-

# Verify the secret was created
gcloud secrets list --filter="name:voteredge*"
```

---

## Step 3: Create Runtime Service Account (Recommended)

Cloud Run needs a service account to access Secret Manager.

```bash
# Create service account
gcloud iam service-accounts create voteredge-sa \
  --display-name="VoterEdge AI Service Account"

# Grant Secret Accessor role to the service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:voteredge-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

```

## Step 4: Grant Deploy Permissions to Cloud Build

Cloud Build (not runtime service account) needs permission to deploy Cloud Run and attach the runtime service account.

```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Cloud Build service account can deploy Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Cloud Build can use the runtime service account
gcloud iam service-accounts add-iam-policy-binding \
  voteredge-sa@$PROJECT_ID.iam.gserviceaccount.com \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## Step 5: Enable Required APIs

```bash
# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com

# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com
```

---

## Step 6: Build & Deploy Using Cloud Build (Recommended)

### Option A: Using `cloudbuild.yaml` (Automatic)

```bash
# Clone/navigate to your repo root, then submit the build
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_SERVICE_NAME="voteredge-ai",_REGION="asia-south1",_CORS_ORIGIN="https://YOUR_FRONTEND_DOMAIN"
```

If frontend and backend are served from the same Cloud Run URL, `_CORS_ORIGIN` can be set to an empty string.

### Option B: Manual Build & Deploy (Alternative)

#### Build the image:
```bash
gcloud builds submit \
  --tag=gcr.io/$PROJECT_ID/voteredge-ai:latest
```

#### Deploy to Cloud Run with secrets:
```bash
gcloud run deploy voteredge-ai \
  --image=gcr.io/$PROJECT_ID/voteredge-ai:latest \
  --platform=managed \
  --region=asia-south1 \
  --allow-unauthenticated \
  --service-account=voteredge-sa@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars=NODE_ENV=production \
  --update-secrets=GEMINI_API_KEY=voteredge-gemini-key:latest \
  --memory=512Mi \
  --cpu=1 \
  --timeout=3600
```

---

## Step 7: Verify Deployment

```bash
# Get the service details
gcloud run services describe voteredge-ai --region asia-south1

# Get the public URL
SERVICE_URL=$(gcloud run services describe voteredge-ai \
  --region asia-south1 \
  --format='value(status.url)')

echo "Service URL: $SERVICE_URL"
```

---

## Step 8: Test the Deployment

```bash
# Store the URL
SERVICE_URL="https://voteredge-ai-xxxxx-a.a.run.app"

# Test health check endpoint
curl $SERVICE_URL/api/health

# Expected response:
# {
#   "status": "OK",
#   "timestamp": "2024-XX-XXT..."
# }

# Test if frontend is served
curl -I $SERVICE_URL
# Should return 200 OK with HTML content
```

---

## Step 9: Update Secrets (if needed)

To update an existing secret:

```bash
# Update GEMINI_API_KEY
echo -n "new-api-key-value" | gcloud secrets versions add voteredge-gemini-key --data-file=-

# After updating the secret, redeploy (no rebuild needed, just redeploy with new secret version)
gcloud run deploy voteredge-ai \
  --image=gcr.io/$PROJECT_ID/voteredge-ai:latest \
  --platform=managed \
  --region=asia-south1 \
  --update-secrets=GEMINI_API_KEY=voteredge-gemini-key:latest
```

---

## Step 10: Monitor & Logs

```bash
# View recent logs
gcloud run services describe voteredge-ai --region asia-south1

# Stream logs in real-time
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=voteredge-ai" \
  --limit 50 \
  --format json

# View Cloud Build logs
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

---

## Production Checklist

- [ ] All secrets created and verified in Secret Manager
- [ ] Service account created with proper IAM roles
- [ ] APIs enabled (Cloud Build, Cloud Run, Secret Manager, Container Registry)
- [ ] `cloudbuild.yaml` in repo root
- [ ] `.dockerignore` excludes `.env` and node_modules
- [ ] Dockerfile builds both frontend and backend
- [ ] `backend/app.js` serves frontend static files
- [ ] `backend/server.js` uses `PORT=8080` by default
- [ ] Health check endpoint `/api/health` working
- [ ] All API routes accessible at `/api/*`
- [ ] No hardcoded secrets in code
- [ ] Service deployed with Secret Manager references
- [ ] Testing completed (health check, API calls, frontend loads)

---

## Rollback (if needed)

```bash
# Deploy previous image revision
gcloud run deploy voteredge-ai \
  --image=gcr.io/$PROJECT_ID/voteredge-ai:previous-sha \
  --region=asia-south1
```

---

## Cleanup (if removing the service)

```bash
# Delete the Cloud Run service
gcloud run services delete voteredge-ai --region asia-south1

# Delete secrets (optional)
gcloud secrets delete voteredge-gemini-key
gcloud secrets delete voteredge-jwt-secret
gcloud secrets delete voteredge-db-password

# Delete the service account (optional)
gcloud iam service-accounts delete voteredge-sa@$PROJECT_ID.iam.gserviceaccount.com
```

---

## Notes

- Secrets are **not baked into the image**; they are injected at runtime by Cloud Run.
- Each secret update creates a new version in Secret Manager; use `:latest` for the current version.
- Cloud Run automatically scales based on traffic.
- Default timeout is 5 minutes; adjust `--timeout` if needed.
- For HTTPS: Cloud Run provides free SSL certificates by default.

---

## Troubleshooting

### Build fails with "permission denied"
- Ensure Cloud Build service account has permissions to access Secret Manager.
- Run: `gcloud projects get-iam-policy $PROJECT_ID --flatten="bindings[].members" --filter="bindings.role:roles/secretmanager.secretAccessor"`

### Service shows blank page
- Check logs: `gcloud logging read "resource.type=cloud_run_revision ..."`
- Verify frontend build is included: `docker run -it gcr.io/$PROJECT_ID/voteredge-ai:latest ls -la backend/frontend/dist`

### API returns 404
- Ensure backend is correctly serving API routes before the SPA fallback.
- Check `backend/app.js` line order: API routes first, then static files, then SPA fallback.

### Secrets not injected
- Verify service account has `secretmanager.secretAccessor` role.
- Check secret names match exactly in `--update-secrets` argument.
