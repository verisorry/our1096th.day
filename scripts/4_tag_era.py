import pandas as pd
from datetime import datetime
import json
import os

# Ensure the data directory exists
os.makedirs('data', exist_ok=True)

# Load config from JSON file
with open('.env.local.json', 'r') as f:
    config = json.load(f)

df = pd.read_csv('data/3_messages_sentiment.csv')
df['date'] = pd.to_datetime(df['date'])

# Parse config data
RELATIONSHIP_START = datetime.strptime(config['relationshipStart'], '%Y-%m-%d')

ERA_BOUNDARIES = []
for era in config['eras']:
    ERA_BOUNDARIES.append({
        'label': era['label'],
        'end': datetime.strptime(era['end'], '%Y-%m-%d')
    })

APART_RANGES = []
for period in config['apartPeriods']:
    APART_RANGES.append({
        'start': datetime.strptime(period['start'], '%Y-%m-%d'),
        'end': datetime.strptime(period['end'], '%Y-%m-%d'),
        'note': period.get('note', '')
    })

MILESTONES = {} 
for milestone in config['milestones']:
    date = datetime.strptime(milestone['date'], '%Y-%m-%d')
    if date not in MILESTONES:
        MILESTONES[date] = []
    MILESTONES[date].append(milestone['label'])

print(f"Loaded {len(ERA_BOUNDARIES)} eras")
print(f"Loaded {len(APART_RANGES)} apart periods")
print(f"Loaded {len(MILESTONES)} milestones")

def get_era(date):
    """Determine era based on boundaries"""
    dt = pd.to_datetime(date)
    
    if dt < RELATIONSHIP_START:
        return 'Before Relationship'
    
    for era in ERA_BOUNDARIES:
        if dt <= era['end']:
            return era['label']
    
    return ERA_BOUNDARIES[-1]['label'] if ERA_BOUNDARIES else 'Together'

def get_milestone(date):
    """Check if date matches any milestone"""
    dt = pd.to_datetime(date).date()
    
    for milestone_date, labels in MILESTONES.items():
        if dt == milestone_date.date():
            return ' & '.join(labels)
    
    return None

def is_apart(date):
    """Check if date falls in any apart period"""
    dt = pd.to_datetime(date)
    
    for period in APART_RANGES:
        if period['start'] <= dt <= period['end']:
            return True
    
    return False

def get_milestone_proximity(date):
    """Get the nearest milestone for visual emphasis"""
    if not MILESTONES:
        return None
    
    dt = pd.to_datetime(date)
    
    closest_milestone = min(MILESTONES.keys(), key=lambda m: abs((m - dt).days))
    days_diff = abs((closest_milestone - dt).days)
    
    if days_diff <= 3:
        return {
            'milestone': ' & '.join(MILESTONES[closest_milestone]),
            'days_away': days_diff,
            'is_exact': days_diff == 0
        }
    
    return None

print("\nProcessing...")
df['era'] = df['date'].apply(get_era)
df['milestone'] = df['date'].apply(get_milestone)
df['is_apart'] = df['date'].apply(is_apart)
df['milestone_proximity'] = df['date'].apply(get_milestone_proximity)

print("\n" + "="*60)
print("TAGGING SUMMARY")
print("="*60)

print("\nEra breakdown:")
for era, count in df['era'].value_counts().sort_index().items():
    print(f"  {era}: {count} days")

milestone_count = df['milestone'].notna().sum()
print(f"\nMilestones: {milestone_count}")
if milestone_count > 0:
    for _, row in df[df['milestone'].notna()][['date', 'milestone']].iterrows():
        print(f"  {row['date'].strftime('%Y-%m-%d')}: {row['milestone']}")

print(f"\nDays apart: {df['is_apart'].sum()}")
print(f"Days together: {(~df['is_apart']).sum()}")

if df['is_apart'].sum() > 0:
    apart_avg = df[df['is_apart']]['message_count'].mean()
    together_avg = df[~df['is_apart']]['message_count'].mean()
    print(f"\nAvg messages/day (apart): {apart_avg:.1f}")
    print(f"Avg messages/day (together): {together_avg:.1f}")

print("="*60)

df.to_csv('data/4_final_data.csv', index=False)
print("\nSaved to data/4_final_data.csv")