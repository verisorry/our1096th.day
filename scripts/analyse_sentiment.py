import pandas as pd
import ast
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import emoji
from collections import Counter
import re
import os

# Ensure the data directory exists
os.makedirs('data', exist_ok=True)

df = pd.read_csv('data/daily_stats.csv')
df['date'] = pd.to_datetime(df['date'])

analyzer = SentimentIntensityAnalyzer()

def safe_eval_list(x):
    """Helper to convert to list"""
    if pd.isna(x) or x == '' or x == '[]':
        return []
    try:
        return ast.literal_eval(x)
    except:
        return []

def get_sentiment(messages):
    """Analyse sentiment of all messages for a day"""
    msg_list = safe_eval_list(messages)
    
    if not msg_list or len(msg_list) == 0:
        return {
            'polarity': 0,
            'subjectivity': 0,
            'compound': 0,
            'label': 'none'
        }
    
    # Combine all messages for the day
    text = ' '.join([str(m) for m in msg_list if pd.notna(m)])
    
    if not text.strip():
        return {
            'polarity': 0,
            'subjectivity': 0,
            'compound': 0,
            'label': 'none'
        }
    
    # textblob
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 = negative, 1 = positive
    subjectivity = blob.sentiment.subjectivity  # 0 = objective, 1 = subjective
    
    # VADER better for casual text/emojis
    vader = analyzer.polarity_scores(text)
    compound = vader['compound']  # -1 to 1
    
    # Determine label based on compound score
    if compound >= 0.3:
        label = 'very_positive'
    elif compound >= 0.05:
        label = 'positive'
    elif compound <= -0.3:
        label = 'very_negative'
    elif compound <= -0.05:
        label = 'negative'
    else:
        label = 'neutral'
    
    return {
        'polarity': round(polarity, 3),
        'subjectivity': round(subjectivity, 3),
        'compound': round(compound, 3),
        'label': label
    }

def extract_quote(messages):
    """Pick the quote of the day for all days"""
    msg_list = safe_eval_list(messages)
    
    if not msg_list or len(msg_list) == 0:
        return ""
    
    valid_messages = [str(m).strip() for m in msg_list if pd.notna(m) and len(str(m).strip()) > 0]
    
    if not valid_messages:
        return ""
    
    # filter out short messages (e.g. LMAO)
    substantial = [m for m in valid_messages if len(m) > 15]
    
    # Pick the one with highest sentiment (most emotionally significant)
    if substantial:
        quotes_with_sentiment = []
        for msg in substantial: 
            blob = TextBlob(msg)
            sentiment_score = abs(blob.sentiment.polarity)
            quotes_with_sentiment.append((msg, sentiment_score))
        
        # Get the most emotionally significant one
        best_quote = max(quotes_with_sentiment, key=lambda x: x[1])[0]
        return best_quote[:300]  # Cap at 300 chars
    
    # If no substantial messages, just return the longest one
    return max(valid_messages, key=len)[:300]

def extract_top_emoji(messages):
    """Get the most used emoji for each day"""
    msg_list = safe_eval_list(messages)
    
    if not msg_list:
        return ""
    
    text = ' '.join([str(m) for m in msg_list if pd.notna(m)])
    
    emojis = [c for c in text if c in emoji.EMOJI_DATA]
    
    if emojis:
        return Counter(emojis).most_common(1)[0][0]
    
    return ""

def count_words(messages):
    """Count total words for the day"""
    msg_list = safe_eval_list(messages)
    
    if not msg_list:
        return 0
    
    text = ' '.join([str(m) for m in msg_list if pd.notna(m)])
    words = re.findall(r'\w+', text)
    return len(words)


print("Analyzing sentiment...")
df['sentiment'] = df['all_messages'].apply(get_sentiment)

print("Extracting quotes...")
df['quote'] = df['all_messages'].apply(extract_quote)

print("Finding top emojis...")
df['top_emoji'] = df['all_messages'].apply(extract_top_emoji)

print("Counting words...")
df['word_count'] = df['all_messages'].apply(count_words)

# Expand sentiment dict into columns
df['polarity'] = df['sentiment'].apply(lambda x: x['polarity'])
df['subjectivity'] = df['sentiment'].apply(lambda x: x['subjectivity'])
df['compound'] = df['sentiment'].apply(lambda x: x['compound'])
df['sentiment_label'] = df['sentiment'].apply(lambda x: x['label'])

# Drop the intermediate columns
df = df.drop(['sentiment', 'all_messages'], axis=1)

print("\nSentiment distribution:")
print(df['sentiment_label'].value_counts())

print("\nSample data:")
print(df[df['message_count'] > 0][['date', 'message_count', 'compound', 'sentiment_label', 'quote']].head(10))

df.to_csv('data/messages_sentiment.csv', index=False)
print("\nSaved to data/messages_sentiment.csv")