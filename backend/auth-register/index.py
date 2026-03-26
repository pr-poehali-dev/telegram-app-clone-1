import json
import os
import hashlib
import secrets
import psycopg2


def handler(event: dict, context) -> dict:
    """Регистрация нового пользователя в мессенджере Линк."""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    username = (body.get('username') or '').strip().lower()
    display_name = (body.get('display_name') or '').strip()
    password = body.get('password') or ''
    phone = (body.get('phone') or '').strip() or None

    if not username or not display_name or not password:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Заполните все обязательные поля'})
        }

    if len(username) < 3:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Имя пользователя должно быть не короче 3 символов'})
        }

    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Пароль должен быть не короче 6 символов'})
        }

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    session_token = secrets.token_hex(32)

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"SELECT id FROM {schema}.users WHERE username = '{username}'")
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 409,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Это имя пользователя уже занято'})
        }

    phone_val = f"'{phone}'" if phone else 'NULL'
    cur.execute(f"""
        INSERT INTO {schema}.users (username, phone, display_name, password_hash, session_token, online)
        VALUES ('{username}', {phone_val}, '{display_name.replace("'", "''")}', '{password_hash}', '{session_token}', TRUE)
        RETURNING id, username, display_name, phone, about, created_at
    """)
    row = cur.fetchone()
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
        'body': json.dumps({'user': user, 'token': session_token})
    }
