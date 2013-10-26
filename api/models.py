from django.db import models
from django import forms
from django.contrib.auth.models import User

MEDIA_TYPES = (
    ('audio', 'audio'),
    ('video', 'video'),
    ('text', 'text'),
    ('image', 'image'),
)

# Used for uploading media that forms part of a story
class Media(models.Model):
    title = models.CharField(max_length=100)
    type = models.CharField(max_length=5, choices=MEDIA_TYPES)
    content = models.TextField()
    author = models.OneToOneField(User)
    date_created = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='static', blank=True, null=True)

    def __unicode__(self):
	return self.title

# Used to convert the media model to a form in the cms
class MediaForm(forms.ModelForm):
    class Meta:
        model = Media
        # Don't show the date created field because we want that to be set automatically
	exclude = ('date_created', 'content', 'author',)

# Used for creating a story that contains multiple bits of media
class Story(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.OneToOneField(User)
    date_created = models.DateTimeField(auto_now_add=True)

# Used to convert the Story model to a form in the cms
class StoryForm(forms.ModelForm):
    class Meta:
	model = Story
	# Don't show the date created field because we want that to be set automatically
	exclude = ('date_created', 'author',)