import psycopg2


class DatabaseClient():
    def __init__(self, endpoint, port, user, name, password):
        try:
            self.conn = psycopg2.connect(
                host=endpoint,
                port=port,
                database=name,
                user=user,
                password=password,
            )
            self._test_connection()
        except Exception as e:
            print("Database connection failed due to {}".format(e))         
                                        
        def _test_connection(self):
            cur = self.conn.cursor()
            cur.execute("""SELECT now()""")
            query_results = cur.fetchall()
