from.settings import *
import os
from.settings import BASE_DIR
import dj_database_url
DEBUG = False
# Django expects ALLOWED_HOSTS (plural).
ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME', '*')]
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ.get('RENDER_EXTERNAL_HOSTNAME', '')] if os.environ.get('RENDER_EXTERNAL_HOSTNAME') else []
DEBUG = False
SECRET_KEY = os.environ['SECRET_KEY']


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]


# Set comma-separated FRONTEND_ORIGINS in Render env, e.g.
# https://your-frontend.vercel.app,https://your-domain.com
FRONTEND_ORIGINS = os.environ.get("FRONTEND_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]

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
    # Replace this value with your local database's connection string.
        default=os.environ["DATABASE_URL"],
    conn_max_age=600
    )
        
    
}
