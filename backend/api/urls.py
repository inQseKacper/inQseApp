from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("verify/", views.VerifyCodeView.as_view(), name="verify"),
    path("resend-code/", views.ResendVerificationCodeView.as_view(), name="resend-code"),
]