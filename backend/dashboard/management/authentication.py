from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from google.oauth2 import id_token
from google.auth.transport.requests import Request
from django.conf import settings
import requests

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None
        
        validated_token = self.get_validated_token(access_token)

        try:
            user = self.get_user(validated_token)
        except AuthenticationFailed:
            return None

        return (user, validated_token)

        google_token = request.headers.get('Authorization') or request.data.get('credential')

        if google_token:
            try:
                # Validate the Google ID token
                id_info = self._verify_google_token(google_token)
                user = self._get_or_create_user_from_google(id_info)
            except Exception as e:
                raise AuthenticationFailed('Google token validation failed: ' + str(e))
            
            return (user, google_token)

        return None

    def _verify_google_token(self, token):
        """Verify the Google ID token."""
        try:
            # Verify the token using Google's API
            id_info = id_token.verify_oauth2_token(token, Request(), os.getenv('ID_CLIENT'))
            return id_info
        except ValueError:
            raise AuthenticationFailed('Invalid Google ID token')

    def _get_or_create_user_from_google(self, id_info):
        """Get or create a user from Google ID info."""
        user_id = id_info.get('sub')
        email = id_info.get('email')
        first_name = id_info.get('given_name')
        last_name = id_info.get('family_name')

        # You can use your custom logic here to find or create a user in your database
        user, created = User.objects.get_or_create(
            google_user_id=user_id,
            defaults={'email': email, 'first_name': first_name, 'last_name': last_name}
        )

        if created:
            # Additional logic for newly created users, like sending a welcome email, etc.
            pass
        
        return user
