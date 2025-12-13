import sqlite3, re

import config

def get_handle_ids(identifiers):
    with sqlite3.connect(config.PATH_TO_DB) as conn:
        cursor = conn.cursor()

        # Query the handle table directly to get all handle IDs for the given identifiers
        query = """
        SELECT ROWID
        FROM handle
        WHERE id IN ({})
        """.format(','.join('?' * len(identifiers)))

        cursor.execute(query, identifiers)
        results = cursor.fetchall()
        handle_ids = [row[0] for row in results]

        if not handle_ids:
            return []

        return list(set(handle_ids))



def decode_attributed_body(attributed_body):
    if not attributed_body:
        return "No attributed body data"

    try:
        # Convert hex string to bytes
        data = bytes.fromhex(attributed_body)
        
        # Convert bytes to string
        text = data.decode('utf-8', errors='ignore')
        
        # Use regex to find the actual content
        match = re.search(r'NSString.*?(\w.*?)(?:\x00|\Z)', text, re.DOTALL)
        if match:
            content = match.group(1)
            # Remove unwanted text from the beginning and end, but keep "Loved"
            content = re.sub(r'^[\d\s]*(?=Loved|.)|(?:")?iI.*?NSDictionary$', '', content).strip()
            return content
        else:
            return "Unable to extract message content"
    except Exception as e:
        return f"Error decoding attributed body: {str(e)}"