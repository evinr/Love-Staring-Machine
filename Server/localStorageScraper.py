import sqlite3

conn = sqlite3.connect('~/home/e/.mozilla/firefox/xqlhs61q.default/webappstore.sqllite')
c = conn.cursor()
c.execute("SELECT name FROM my_db.sqlite_master WHERE type='table';")
print c.fetchone()
conn.close()