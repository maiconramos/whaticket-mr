// const mysql = require("mysql2/promise")
import mysql from "mysql2/promise";

function delay(t?: number, v?: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

export const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
};

export const setTicketClosed = async (id: number) => {
  const connection = await createConnection();
  const [rows] = await connection.execute(
    'UPDATE Tickets SET status = "closed" WHERE contactId = ?',
    [id]
  );
  delay(1000, 0).then(async function () {
    await connection.end();
    delay(500, 0).then(async function () {
      connection.destroy();
      // console.log('© BOT-ZDG Conexão fechada')
    });
    // console.log('© BOT-ZDG Conexão fechada')
  });
  if ((<any>rows).length > 0) return rows;
  return false;
};

export const getContactId = async (msgFrom: string) => {
  const connection = await createConnection();
  const [rows] = await connection.execute(
    "SELECT id FROM Contacts WHERE number = ?",
    [msgFrom]
  );
  delay().then(async function () {
    await connection.end();
    delay(3000, 3000).then(async function () {
      connection.destroy();
      // console.log('© BOT-ZDG Conexão fechada')
    });
    // console.log('© BOT-ZDG Conexão fechada')
  });
  if ((<any>rows).length > 0) return (<any>rows)[0].id;
  return false;
};
