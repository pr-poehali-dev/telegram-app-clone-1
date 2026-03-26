import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Получение данных текущего авторизованного пользователя по токену."""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

    if not token:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Токен не передан'})
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"""
        SELECT id, username, display_name, phone, about
        FROM {schema}.users
        WHERE session_token = '{token}'
    """)
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Сессия истекла, войдите снова'})
        }

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
        'body': json.dumps({'user': user})
    }
