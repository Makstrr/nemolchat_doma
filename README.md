# Система анализа отзывов об управляющих компаниях (УК)

Система для автоматического сбора, обработки и анализа, а также визуализации отзывов об управляющих компаниях с использованием NLP и машинного обучения.  
Проект помогает выявлять ключевые проблемы, оценивать удовлетворённость жильцов и формировать аналитические отчёты.

---

## Возможности

- 📥 **Сбор отзывов** с заранее заданных источников (форумы, платформы ЖКХ, сайты отзывов, карты)
- 🔍 **Фильтрация релевантных текстов**
- 🎯 **Классификация тональности** (позитивная / негативная / нейтральная)
- 🧠 **Выделение ключевых жалоб и повторяющихся тем**
- 📊 **Визуализация аналитики** (диаграммы по адресам, темам, периодам)

---

## Архитектура проекта

Проект построен по модульному принципу. Компоненты работают независимо и могут масштабироваться по отдельности.  

Парсер → База данных → NLP-модели → API (FastAPI) → [Веб-интерфейс (Vue)]

---

## Технологии

- **Backend:** FastAPI, PostgreSQL, Scrapy, Selenium
- **ML / NLP:** TensorFlow, spaCy, кастомные модели на трансформерах
- **Frontend:** Vue.js

---

## Использование

- ### **Токенизатор:**
```python
import razdel
import pickle
import tokenizers

with open('ml/models/subtokenizer50k_razdel.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

def razdel_tokenize(text):
    tokens = [token.text for token in razdel.tokenize(text)]
    return " ".join(tokens)

text = razdel_tokenize("текст для проверки")
sequence = [tokenizer.encode(text).ids]
print(sequence)
```
- ### **Модель:**
```python
from ml.models.multihead_self_attention import MultiHeadSelfAttention
import keras

with keras.utils.custom_object_scope({'MultiHeadSelfAttention': MultiHeadSelfAttention}):
    model = keras.models.load_model('ml/models/beta_sentiment_analyzer50k_subtokenized.keras')

padded_sequence = ...
prediction = model.predict(padded_sequence)

tonality_mapping = {
    0: 'отрицательный',
    1: 'нейтральный',
    2: 'положительный'
}

print(tonality_mapping[prediction])
```
---

## Пример обработки

### Ирония:  
![image](https://github.com/user-attachments/assets/c8d10a8a-d58b-4b93-8bec-4da5d1ecbee9)

### Обычный положительный отзыв:  
![image](https://github.com/user-attachments/assets/6a322997-6009-4210-80f2-5cd93c8133dd)



---

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

2. Установите зависимости
```bash
pip install -r requirements.txt
```

3. Запуск FastAPI-сервера:
```bash
uvicorn backend.main:app --reload
```

4. Запуск парсера (пример)
```bash
python parser/main.py
```



## Авторы

Проект разрабатывается студентами ИРИТ-РТФ УрФУ в рамках дисциплины "Проектный практикум"
