# Surcharge Daemon v1.0

## Запуск демона
1.  Создать postgresql базу и добавить схему таблицы из frontendDbSchema + добавить данные в config.js для подключения
2. Установка пакетов
   `yarn install`
3. Запуск
   `yarn start`

## Api 
### POST `/surcharges/add` - Добавление доплаты
Пример body (JSON):
```
    {
        "user_id": 1,
        "amount": 250,
        "comment": "Комментарий",
        "email": "test@test.ru",
        "phone": "+79999999999",
        "currency": "RUB",
        "service_class": "insurances_service",
        "followed_at": "now()"
    }
```
### GET `/surcharges/:id` - Получение инфо о доплате
