# Generated by Django 4.2.7 on 2023-11-17 01:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gameguru', '0003_statistic_gameswon_statistic_timeplayed'),
    ]

    operations = [
        migrations.AddField(
            model_name='statistic',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='statistic',
            name='username',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gameguru.user'),
        ),
    ]
