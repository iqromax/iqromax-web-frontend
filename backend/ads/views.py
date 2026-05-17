from rest_framework import viewsets
from .models import Ad, Feature, FeatureDetail, BlogPost, FAQItem, Feedback
from .serializers import AdSerializer, FeatureSerializer, FeatureDetailSerializer, BlogPostSerializer, FAQItemSerializer, FeedbackSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import permissions

class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FeatureViewSet(viewsets.ModelViewSet):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class FeatureDetailViewSet(viewsets.ModelViewSet):
    queryset = FeatureDetail.objects.all()
    serializer_class = FeatureDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
