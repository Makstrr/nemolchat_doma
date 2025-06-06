# Система анализа отзывов об управляющих компаниях (УК)

Система для автоматического сбора, обработки и анализа отзывов об управляющих компаниях с использованием NLP и машинного обучения. Проект помогает выявлять ключевые проблемы, оценивать удовлетворенность клиентов и формировать аналитические отчеты.

## Возможности

- **Сбор отзывов** с популярных платформ (Google Maps, Яндекс.Карты, Отзовики и т.д.)
- **Классификация тональности** (позитивный/негативный/нейтральный)
- **Тематическое моделирование** (жалобы на ЖКХ, ремонт, коммунальные услуги и пр.)
- **Визуализация данных** (графики, heatmap, дашборды)

## Технологии

- **Backend:** FastAPI, PostgreSQL, Scrapy, Selenium
- **ML:** Tensorflow

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

## Авторы

Проект разрабатывается студентами ИРИТ-РТФ УрФУ в рамках дисциплины "Проектный практикум"