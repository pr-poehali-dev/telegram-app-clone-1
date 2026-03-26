import json
import os
import hashlib
import secrets
import psycopg2


def handler(event: dict, context) -> dict:
    """Вход в аккаунт пользователя мессенджера Линк."""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    username = (body.get('username') or '').strip().lower()
    password = body.get('password') or ''

    if not username or not password:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Введите имя пользователя и пароль'})
        }

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    new_token = secrets.token_hex(32)

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"""
        SELECT id, username, display_name, phone, about
        FROM {schema}.users
        WHERE username = '{username}' AND password_hash = '{password_hash}'
    """)
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверное имя пользователя или пароль'})
        }

    user_id = row[0]
    cur.execute(f"""
        UPDATE {schema}.users SET session_token = '{new_token}', online = TRUE
        WHERE id = {user_id}
    """)
    conn.commit()
    cur.close()
    conn.close()

    user = {
        'id': row[0],
        'username': row[1],
        'display_name': row[2],
        'phone': row[3],
        'about': row[4],
    }

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'user': user, 'token': new_token})
    }
