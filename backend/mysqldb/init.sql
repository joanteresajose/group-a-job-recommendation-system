CREATE DATABASE authDB;
CREATE DATABASE usersDB;
CREATE DATABASE jobDB;

ALTER USER 'root'@'%' IDENTIFIED BY 'authPass_32';
GRANT ALL PRIVILEGES ON authDB.* TO 'root'@'%';
FLUSH PRIVILEGES;

CREATE USER 'authsql'@'172.20.0.3' IDENTIFIED BY 'authPass_32';
GRANT ALL PRIVILEGES ON authDB.* TO 'authsql'@'172.20.0.3';
FLUSH PRIVILEGES;

CREATE USER 'usersql'@'172.20.0.4' IDENTIFIED BY 'usersPass_32';
GRANT ALL PRIVILEGES ON usersDB.* TO 'usersql'@'172.20.0.4';
FLUSH PRIVILEGES;

CREATE USER 'jobsql'@'172.20.0.5' IDENTIFIED BY 'jobsPass_32';
GRANT ALL PRIVILEGES ON jobDB.* TO 'jobsql'@'172.20.0.5';
FLUSH PRIVILEGES;


CREATE USER 'modelsql'@'172.20.0.7' IDENTIFIED BY 'modelsPass_32';
GRANT ALL PRIVILEGES ON jobDB.* TO 'modelsql'@'172.20.0.7';
FLUSH PRIVILEGES;
