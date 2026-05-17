from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdViewSet, FeatureViewSet, FeatureDetailViewSet, BlogPostViewSet, FAQItemViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'ads', AdViewSet)
router.register(r'features', FeatureViewSet)
router.register(r'feature-details', FeatureDetailViewSet)
router.register(r'blogs', BlogPostViewSet, basename='blog')
router.register(r'faqs', FAQItemViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
