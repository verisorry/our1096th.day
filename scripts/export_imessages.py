import utils
import config
from dotenv import load_dotenv
from datetime import datetime

import sqlite3, os

def get_messages(identifiers, his_name, your_name, output):
    handle_ids = utils.get_handle_ids(identifiers)
    if not handle_ids:
        print(f"No handle IDs found for {identifiers}")
        return

    with sqlite3.connect(config.PATH_TO_DB) as conn:
        cursor = conn.cursor()

        # Query for all handle_ids to get messages from all phone number variations
        placeholders = ','.join('?' * len(handle_ids))
        query = f"""
        SELECT datetime(message.date / 1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as date,
            message.text,
            message.is_from_me,
            message.attributedBody
        FROM message
        WHERE handle_id IN ({placeholders})
        ORDER BY date ASC
        """

        cursor.execute(query, handle_ids)
        messages = cursor.fetchall()

    if not messages:
        print(f"No messages found for handle IDs {handle_ids}")
        return

    for date, text, is_from_me, attributed_body in messages:
        msg_sender = your_name if is_from_me else his_name
        formatted_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d %I:%M:%S %p")
        decoded = False
        if text is None:
            if attributed_body is not None:
                text = utils.decode_attributed_body(attributed_body.hex())
                decoded = True
        
        # Replace newlines and commas with escape characters
        if text:
            text = text.replace('\n', '\\n').replace('\r', '\\r').replace('"', "'")
            text = f"\"{text}\""
        else:
            # Use placeholder for empty messages (images, reactions, etc.)
            text = '"[media]"'

        output.append(f"{formatted_date}{config.DELIMITER}{msg_sender}{config.DELIMITER}{text}{config.DELIMITER}{decoded}")

output = ["time,sender,message,decoded"]

load_dotenv('.env.local')

HIS_PHONE = os.getenv('HIS_PHONE')
HIS_EMAIL = os.getenv('HIS_EMAIL')

HIS_NAME = os.getenv('HIS_NAME')
YOUR_NAME = os.getenv('YOUR_NAME')

# Create variations of the phone number to catch all possible formats
identifiers = [HIS_EMAIL]
if HIS_PHONE:
    digits_only = ''.join(filter(str.isdigit, HIS_PHONE))
    identifiers.extend([
        HIS_PHONE,
        digits_only,
        digits_only[-10:] if len(digits_only) >= 10 else digits_only,
    ])

get_messages(identifiers, HIS_NAME, YOUR_NAME, output)

with open(f"data/raw_messages.csv", "w") as f:
    f.write(config.NEWLINE.join(output))
    