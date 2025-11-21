SELECT datname FROM pg_database 
WHERE datname LIKE '%yesil%' OR datname LIKE '%Yesil%' OR datname LIKE '%Eksen%';

DO $$
DECLARE
    db_name TEXT := 'YeşilEksen';
BEGIN
    PERFORM pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = db_name AND pid <> pg_backend_pid();
END $$;

ALTER DATABASE "YeşilEksen" RENAME TO "yesileksen";

CREATE DATABASE yesileksen
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Turkish_Turkey.1254'
    LC_CTYPE = 'Turkish_Turkey.1254'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE = template0;

SELECT datname, encoding, datcollate, datctype 
FROM pg_database 
WHERE datname = 'yesileksen';
