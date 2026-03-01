set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

if [[ $SEED_DEMO_DATA ]];
then
    python manage.py seed_demo
fi

if [[ $CREATE_SUPERUSER ]];
then
    python manage.py createsuperuser --no-input
fi
