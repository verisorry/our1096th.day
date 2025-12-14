# Our 1096th Day

_**If by ANY chance, you're Luke de Souza, look away!**_

**Disclaimer**: the following README was written using Claude AI.

*Note: email me @ fang.silvia2026@gmail.com for the password!*

**Acknowledgment:** The iMessage data extraction pipeline was inspired by [siddhxrth/imessage-analyze-and-export](https://github.com/siddhxrth/imessage-analyze-and-export).

A graphical visualization of three years of conversations, celebrating 1096 days together through iMessage data analysis and an interactive calendar display.

## About

This project transforms iMessage conversations into a visual story. Each day is represented as a square in a grid, with colors reflecting sentiment (from brown for negative to green for positive) and brightness indicating message volume. Milestones are marked with flowers, and hovering over any day reveals quotes, emojis, and details from that period.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Data Processing**: Python 3 with pandas, transformers (sentiment analysis)
- **Styling**: Tailwind CSS 4, react-icons

## Prerequisites

- Node.js (v20 or higher)
- Python 3.x with pip
- Access to macOS iMessage database (`~/Library/Messages/chat.db`)
  - This is a bit annoying because of good security so I found that the easiest way was to make a copy of it in this project folder!
- npm or yarn

## Setup

### 1. Install Dependencies

Install Node.js dependencies:
```bash
npm install
```

Set up Python virtual environment and dependencies:
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the template and fill in your values:
```bash
cp .env.local.template .env.local
```

Then edit `.env.local` with your actual values:
```env
HIS_PHONE=+1234567890
HIS_EMAIL=email@example.com
HIS_NAME=Name
YOUR_NAME=YourName
```

### 3. Copy iMessage Database

Copy your iMessage database to the project's data directory:
```bash
cp ~/Library/Messages/chat.db data/chat.db
```

**Note:** Due to macOS security restrictions, you may need to grant Terminal/your IDE full disk access in System Settings > Privacy & Security > Full Disk Access.

Alternatively, you can manually copy the file from `~/Library/Messages/chat.db` to the `data/` folder in this project.

### 4. Configure Relationship Timeline

Copy the template and customize it for your relationship:
```bash
cp .env.local.json.template .env.local.json
```

Then edit `.env.local.json` to define your relationship eras, milestones, and periods apart:

```json
{
    "relationshipStart": "2023-01-06",
    "eras": [
        {"label": "Freshman Year", "end": "2023-06-07"},
        {"label": "Summer 2023", "end": "2023-09-17"}
    ],
    "apartPeriods": [
        {"start": "2024-09-01", "end": "2024-12-14", "note": "Study abroad"}
    ],
    "milestones": [
        {"date": "2023-01-06", "label": "Started Dating"},
        {"date": "2024-01-06", "label": "1st Year Anniversary"}
    ]
}
```

**Configuration fields:**

- `relationshipStart`: The date you started dating (YYYY-MM-DD format)
- `eras`: Array of relationship periods with labels and end dates
- `apartPeriods`: Array of time periods spent apart with start/end dates and notes
- `milestones`: Array of significant dates with labels (displayed as flowers on the calendar)

### 5. Data Processing Pipeline

Run the Python scripts in order to process your iMessage data:

```bash
# Make sure you're in the virtual environment
source .venv/bin/activate
```

1. Export messages from iMessage database

```bash
python3 scripts/export_imessages.py
```

2. Process and clean the raw messages

```bash
python3 scripts/process_messages.py
```

3. Analyze sentiment of messages

```bash
python3 scripts/analyse_sentiment.py
```

4. Tag messages with era/milestone information

```bash
python3 scripts/tag_era.py
```

5. Export final JSON for the web app

```bash
python3 scripts/export_json.py
```

After running all scripts, you should have:

- `data/raw_messages.csv` - Raw exported messages
- `data/processed_messages.csv` - Cleaned messages
- `data/messages_with_sentiment.csv` - Messages with sentiment scores
- `data/messages_tagged.csv` - Messages tagged with eras/milestones
- `src/data/messages.json` - Final JSON data for the web app
- `src/data/stats.json` - Statistics summary

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The page auto-updates as you edit files.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```text
.
├── scripts/              # Python data processing scripts
│   ├── config.py        # Configuration settings
│   ├── utils.py         # Utility functions
│   ├── export_imessages.py   # Step 1: Extract from iMessage DB
│   ├── process_messages.py   # Step 2: Clean and process
│   ├── analyse_sentiment.py  # Step 3: Sentiment analysis
│   ├── tag_era.py            # Step 4: Add milestone tags
│   └── export_json.py        # Step 5: Generate final JSON
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   │   ├── MessageCalendar.tsx
│   │   ├── HoverCard.tsx
│   │   └── PasswordProtect.tsx
│   └── data/            # Generated JSON data files
├── public/              # Static assets (backgrounds, etc.)
└── data/                # Processed CSV files (gitignored)
```

## Features

- Interactive calendar grid visualization
- Sentiment-based color coding
- Message volume brightness indicators
- Milestone markers with hover details
- Random seasonal backgrounds
- Password protection
- Mobile responsive design
- Comprehensive statistics display

## Privacy

This project processes local iMessage data. All data processing happens locally on your machine. Make sure to:

- Keep your `.env.local` file private
- Add `data/` directory to `.gitignore` to avoid committing personal messages
- Use password protection when deploying
