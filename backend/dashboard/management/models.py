from django.db import models
from django.contrib.auth.models import User


def upload_path(instance, filname):
    return '/'.join(['Project Images',  filname])


class Project(models.Model):
    # priority options
    HIGH = 'High'
    MEDIUM = 'Medium'
    LOW = 'Low'

    PRIORITY_CHOICES = [
        (HIGH, 'High'),
        (MEDIUM, 'Medium'),
        (LOW, 'Low'),
    ]
    #status options
    NOT_STARTED = 'Not Started'
    IN_PROGRESS = 'In Progress'
    COMPLETED = 'Completed'

    STATUS_CHOICES = [
        (NOT_STARTED, 'Not Started'),
        (IN_PROGRESS, 'In Progress'),
        (COMPLETED, 'Completed'),
    ]
    id = models.AutoField(primary_key=True)  # Automatically generates unique IDs
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name='projects', null=True, blank=True)
    title= models.CharField(max_length=500)
    description = models.TextField()
    start_date= models.DateField()
    end_date= models.DateField()
    priority= models.CharField(max_length=6,choices= PRIORITY_CHOICES, default=MEDIUM)
    status= models.CharField(max_length=30,choices= STATUS_CHOICES, default=NOT_STARTED)
    image1 = models.ImageField(upload_to=upload_path)
    image2 = models.ImageField(upload_to=upload_path)
    category= models.CharField(max_length=500)


    