"""
Django settings for dashboard project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv()


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-i6es*%n)ulq@na9newc@f$h_ms@e5$m%$u90lwy&th7ba2h^j-'

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = os.getenv("DEBUG", "False") == "True"

if DEBUG:  # Local development
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
else:
    ALLOWED_HOSTS = ["management-assignement-backend.onrender.com"]

AUTHENTICATION_BACKENDS = [
    "social_core.backends.google.GoogleOAuth2",
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',

]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    "social_django",
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework.authtoken',
    'management',
    
]



MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
    'corsheaders.middleware.CorsMiddleware',
]
CORS_ORIGIN_ALLOW_ALL = True  # For development only; specify origins in production.
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000','https://management-assignement.onrender.com']  


ROOT_URLCONF = 'dashboard.urls'
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", "https://management-assignement.onrender.com"  
]
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000", "https://management-assignement.onrender.com"
]


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

WSGI_APPLICATION = 'dashboard.wsgi.application'
MEDIA_URL = '/media/'  # URL for accessing media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = '/static/'  
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static')]  


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'management.authentication.CookiesJWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',


    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
  

}


SIMPLE_JWT = {
   "ACCESS_TOKEN_LIFETIME": timedelta(minutes=45),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    'AUTH_COOKIE': 'access_token',  # Cookie name for the access token
    'AUTH_COOKIE_REFRESH': 'refresh_token',  # Cookie name for the refresh token
    'AUTH_COOKIE_SECURE': False,  # Set to True if using HTTPS
    'AUTH_COOKIE_HTTP_ONLY': True,  # Make the cookie HTTP only
    'AUTH_COOKIE_PATH': '/',  # Root path for the cookie
    'AUTH_COOKIE_SAMESITE': 'Lax',
}
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv('ID_CLIENT')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv('SECRET_KEY')

SITE_ID = 1  # Make sure the Site is created in the admin panel
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

SOCIALACCOUNT_ADAPTER = "management.adapters.CustomSocialAccountAdapter"
ACCOUNT_ADAPTER = "management.adapters.CustomAccountAdapter"



EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'asmakhadidja.dahmani@inttic.dz'
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PSWD')

