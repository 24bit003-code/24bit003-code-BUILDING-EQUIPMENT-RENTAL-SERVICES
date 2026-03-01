from.settings import *
import os
from.settings import BASE_DIR
import dj_database_url
DEBUG = False
# Keep host checks permissive in current deployment to avoid host/CORS blocking.
ALLOWED_HOSTS = ["*"]
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME', '')] if os.environ.get('RENDER_EXTERNAL_HOSTNAME') else []
DEBUG = False
SECRET_KEY = os.environ.get("SECRET_KEY", "render-fallback-secret-key-change-me")


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# Set comma-separated FRONTEND_ORIGINS in Render env, e.g.
# https://your-frontend.vercel.app,https://your-domain.com
FRONTEND_ORIGINS = os.environ.get("FRONTEND_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}




DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get("DATABASE_URL", f"sqlite:///{BASE_DIR / 'db.sqlite3'}"),
    conn_max_age=600
    )
        
    
}
