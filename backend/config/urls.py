from django.urls import path

from chat_api.views import ChatView

urlpatterns = [path("api/chat/", ChatView.as_view(), name="chat")]
