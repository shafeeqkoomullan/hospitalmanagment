from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# 🔴 Fix 1: Load SECRET_KEY from environment
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-only-for-local-dev')

# 🔴 Fix 2: Load DEBUG from environment
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# 🟠 Fix 5: Load ALLOWED_HOSTS from environment
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost 127.0.0.1').split()

INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',  # 🔴 Fix 6: required for BLACKLIST_AFTER_ROTATION

    'accounts',
    'core',
    'patients',
    'billing',
    'receptionist',
    'appointments',
    'doctorapp',
    'admin_panel',
]

# 🟠 Fix 4: SecurityMiddleware first, CorsMiddleware second, no duplicates
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',           # must be first
    'corsheaders.middleware.CorsMiddleware',                   # must be before CommonMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',               # only once
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hospital_site.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hospital_site.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'  # 🟡 Fix 7: correct timezone for an Indian hospital system

USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'

AUTH_USER_MODEL = 'accounts.CustomUser'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 🟠 Fix 3: Remove CORS_ALLOW_ALL_ORIGINS — whitelist only
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"