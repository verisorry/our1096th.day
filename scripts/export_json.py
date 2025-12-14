import pandas as pd
import json

df = pd.read_csv('data/final_data.csv')

data = []
for _, row in df.iterrows():
    data.append({
        'date': str(row['date']),
        'messageCount': int(row['message_count']) if pd.notna(row['message_count']) else 0,
        'fromYou': int(row['from_you_count']) if pd.notna(row['from_you_count']) else 0,
        'fromHim': int(row['from_him_count']) if pd.notna(row['from_him_count']) else 0,
        'sentiment': {
            'polarity': float(row['polarity']) if pd.notna(row['polarity']) else 0,
            'compound': float(row['compound']) if pd.notna(row['compound']) else 0,
            'label': row['sentiment_label'] if pd.notna(row['sentiment_label']) else 'neutral'
        },
        'quote': row['quote'] if pd.notna(row['quote']) else '',
        'topEmoji': row['top_emoji'] if pd.notna(row['top_emoji']) else '',
        'era': row['era'],
        'milestone': row['milestone'] if pd.notna(row['milestone']) else None,
        'isApart': row['is_apart']
    })

with open('src/data/messages.json', 'w+') as f:
    json.dump(data, f, indent=2)

print(f"Exported {len(data)} days to JSON")

stats = {
    'totalDays': len(data),
    'totalMessages': int(df['message_count'].sum()),
    'avgMessagesPerDay': float(df['message_count'].mean()),
    'erasBreakdown': df['era'].value_counts().to_dict(),
    'sentimentBreakdown': df['sentiment_label'].value_counts().to_dict()
}

with open('src/data/stats.json', 'w+') as f:
    json.dump(stats, f, indent=2)