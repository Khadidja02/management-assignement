# Generated by Django 5.1.4 on 2024-12-20 23:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='category',
            field=models.CharField(max_length=500, null=True),
        ),
    ]