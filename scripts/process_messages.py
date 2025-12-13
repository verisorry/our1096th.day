import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

df = pd.read_csv('data/raw_messages.csv')

df['datetime'] = pd.to_datetime(df['time'])
df['date'] = df['datetime'].dt.date

df['is_from_me'] = df['sender'] == os.getenv('MY_NAME')

daily_stats = df.groupby('date').agg({
    'message': ['count', list],
    'is_from_me': 'sum'
}).reset_index()

daily_stats.columns = ['date', 'message_count', 'all_messages', 'from_me_count']
daily_stats['from_him_count'] = daily_stats['message_count'] - daily_stats['from_me_count']

start_date = pd.to_datetime(daily_stats['date'].min())
end_date = pd.to_datetime(daily_stats['date'].max())
all_days = pd.date_range(start=start_date, end=end_date, freq='D').date

complete_df = pd.DataFrame({'date': all_days})
daily_stats['date'] = pd.to_datetime(daily_stats['date'])
complete_df['date'] = pd.to_datetime(complete_df['date'])

daily_stats = complete_df.merge(daily_stats, on='date', how='left')
daily_stats['message_count'] = daily_stats['message_count'].fillna(0).astype(int)
daily_stats['from_me_count'] = daily_stats['from_me_count'].fillna(0).astype(int)
daily_stats['from_him_count'] = daily_stats['from_him_count'].fillna(0).astype(int)
daily_stats['all_messages'] = daily_stats['all_messages'].fillna('').apply(lambda x: x if isinstance(x, list) else [])

print(f"Total days: {len(daily_stats)}")
print(f"Days with messages: {(daily_stats['message_count'] > 0).sum()}")
print(f"Days with no messages: {(daily_stats['message_count'] == 0).sum()}")

daily_stats.to_csv('data/daily_stats.csv', index=False)
print("Saved to data/daily_stats.csv")