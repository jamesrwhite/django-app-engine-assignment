from django.db import models

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length = 50)
    slug = models.CharField(max_length = 50)
    date_created = models.DateTimeField()
