from django.conf.urls import patterns, url

from frontend import views

urlpatterns = patterns('',
    # Catch all route
    url(r'^$', views.index, name='index')
)