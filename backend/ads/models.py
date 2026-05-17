from django.db import models
from django.utils.text import slugify

class Ad(models.Model):
    title = models.CharField(max_length=200, verbose_name="Sarlavha")
    description = models.TextField(verbose_name="Tavsif")
    image = models.ImageField(upload_to='ads/', verbose_name="Rasm")
    tag = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bo'lim")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan sana")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Reklama"
        verbose_name_plural = "Reklamalar"
        ordering = ['-created_at']

class Feature(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nomi")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Tavsif")
    icon = models.CharField(max_length=100, default="Zap", verbose_name="Icon nomi")
    color = models.CharField(max_length=50, default="emerald", verbose_name="Rangi")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Xususiyat"
        verbose_name_plural = "Xususiyatlar"
        ordering = ['-created_at']

class FeatureDetail(models.Model):
    feature = models.OneToOneField(Feature, on_delete=models.CASCADE, related_name='detail', verbose_name="Xususiyat")
    image = models.ImageField(upload_to='features/', verbose_name="Rasm")
    subtitle = models.CharField(max_length=200, verbose_name="Subtitr")
    description = models.TextField(verbose_name="Tavsif")
    
    # Stats
    users_stat = models.CharField(max_length=50, default="20k+", verbose_name="Faol foydalanuvchilar soni")
    rating_stat = models.CharField(max_length=50, default="4.8", verbose_name="Reyting")
    tasks_stat = models.CharField(max_length=50, default="Faol", verbose_name="Vazifa/Level")

    # Steps (Qanday ishlaydi?)
    step1_title = models.CharField(max_length=100, verbose_name="Qadam 1 Nomi")
    step1_desc = models.CharField(max_length=255, verbose_name="Qadam 1 Tavsifi")
    step2_title = models.CharField(max_length=100, verbose_name="Qadam 2 Nomi")
    step2_desc = models.CharField(max_length=255, verbose_name="Qadam 2 Tavsifi")
    step3_title = models.CharField(max_length=100, verbose_name="Qadam 3 Nomi")
    step3_desc = models.CharField(max_length=255, verbose_name="Qadam 3 Tavsifi")

    def __str__(self):
        return f"Detail: {self.feature.name}"

    class Meta:
        verbose_name = "Xususiyat Tafsiloti"
        verbose_name_plural = "Xususiyat Tafsilotlari"


class BlogPost(models.Model):
    title = models.CharField(max_length=250, verbose_name="Sarlavha")
    slug = models.SlugField(max_length=250, unique=True, blank=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Tavsif (Batafsil)")
    category = models.CharField(max_length=100, verbose_name="Yo'nalish")
    image = models.ImageField(upload_to='blogs/', verbose_name="Asosiy Rasm")
    author = models.CharField(max_length=150, verbose_name="Muallif ismi")
    author_image = models.ImageField(upload_to='authors/', verbose_name="Muallif Rasmi", blank=True, null=True)
    hashtags = models.CharField(max_length=250, blank=True, null=True, verbose_name="Heshteglar")
    read_time = models.CharField(max_length=50, default="5 min", verbose_name="O'qish vaqti")
    is_published = models.BooleanField(default=True, verbose_name="Nashr qilingan")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan sana")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Yangilik va Blog"
        verbose_name_plural = "Yangiliklar va Bloglar"
        ordering = ['-created_at']


class FAQItem(models.Model):
    question = models.CharField(max_length=300, verbose_name="Savol")
    answer = models.TextField(verbose_name="Javob")
    order_index = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqti")

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = "Ko'p beriladigan savol"
        verbose_name_plural = "Ko'p beriladigan savollar"
        ordering = ['order_index', '-created_at']


class Feedback(models.Model):
    name = models.CharField(max_length=150, verbose_name="Ism")
    email = models.CharField(max_length=254, verbose_name="Email yoki Telefon")
    subject = models.CharField(max_length=150, verbose_name="Bo'lim/Mavzu")
    message = models.TextField(verbose_name="Xabar")
    is_read = models.BooleanField(default=False, verbose_name="O'qilgan")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan sana")

    def __str__(self):
        return f"{self.name} - {self.subject}"

    class Meta:
        verbose_name = "Izoh va Taklif"
        verbose_name_plural = "Izohlar va Takliflar"
        ordering = ['-created_at']
