from django.contrib.auth.models import User
if not User.objects.filter(username='rahmatulla').exists():
    User.objects.create_superuser('rahmatulla', 'rahmatulla@iqromax.uz', 'rahmatulla123')
    print("Superuser created successfully.")
else:
    print("Superuser already exists.")
