from rest_framework import serializers
from .models import Ad, Feature, FeatureDetail, BlogPost, FAQItem, Feedback

class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = '__all__'

class FeatureDetailSerializer(serializers.ModelSerializer):
    feature_slug = serializers.ReadOnlyField(source='feature.slug')
    feature_name = serializers.ReadOnlyField(source='feature.name')
    
    class Meta:
        model = FeatureDetail
        fields = '__all__'

class FeatureSerializer(serializers.ModelSerializer):
    detail = FeatureDetailSerializer(read_only=True)
    
    class Meta:
        model = Feature
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'

class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
