# Ecommerce

## Установка и запуск проекта

1. Клонируйте репозиторий:

```
bash
git clone https://github.com/BladeWh1sper/ecommerce-project.git
cd ecommerce-project
```

2. Запускаем Backend:

```
bash
cd backend
python -m venv venv
source venv/bin/activate  # MacOS/Linux
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

3. Создание файла окружения .env:

```
bash
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
SECRET_KEY=your_secret_key
```
поставьте свои значения

4. Подготовка базы данных:

```
bash
psql -U postgres
CREATE DATABASE ecommerce;
```

5. Запуск проекта:
```
bash
python -m uvicorn app.main:app --reload
```
6. Запуск frontend:

```
bash
cd frontend
npm install
npm start
```