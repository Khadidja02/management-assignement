from django.urls import path

from.views import (CreateProjectView, ListProjectView,ProjectView, 
EditProjectView, DeleteProjectView, generate_pdf, 
send_project_as_email, CustomTokenObtainPairView, 
CustomTokenRefreshView, logout, register, is_logged_in, generate_summary,GoogleLoginView)


urlpatterns = [
    path('create-project/', CreateProjectView.as_view(), name= 'create-project'),
    path('projects/', ListProjectView.as_view(), name='projects-list'),
    path('<int:id>/edit/', EditProjectView.as_view(), name='edit-project'),
    path('<int:id>/details/', ProjectView.as_view(), name='project-details'),
    path('<int:id>/delete/', DeleteProjectView.as_view(), name='delete-project'),
    path('export-pdf/<int:id>/', generate_pdf, name='export-project-pdf'),
    path('send-email/<int:id>/', send_project_as_email, name='send-email'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', logout),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register),
    path('authenticated/', is_logged_in),
    path("generate-summary/", generate_summary, name="generate-summary"),
    path("api/auth/google-login/", GoogleLoginView.as_view(), name="google-login"),








    
]