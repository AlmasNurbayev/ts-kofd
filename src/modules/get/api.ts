import axios from "axios";
import https from "https";
import moment from 'moment';
//const fs = require("fs"); eslint detect
//const { Client } = require('pg');
import { writeLog, logger } from '../../utils/log-files';
import dotenv from "dotenv";
dotenv.config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});


/**
 * @description Get token from KOFD
 * @param {*} iin
 * @param {*} pass
 * @returns {Promise<string|Error>}
 */
export async function getJWT(iin: string, pass: string) {

  logger.info('api - starting getJWT: ' + iin);

  const data = {
    credentials: {
      iin: iin,
      password: pass,
    },
    organizationXin: iin,
  };

  const config = {
    method: "post",
    url: "https://cabinet.kofd.kz/api/authenticate/byIinAndPassword",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
    httpsAgent: agent,
    timeout: 10000
  };


  //console.log("1");

  try {
    const response = await axios(config);
    //      console.log("2");
    //console.log(typeof response);
    writeLog('response-post.txt', response.data, false);
    if (response.data.data == null) {
      logger.error('getJWT ' + response.data);
      return;
    }
    logger.info('api - ending getJWT ' + response.data.data.jwt);
    return response.data.data.jwt;
  } catch (e) {
    logger.error('getJWT ' + e);
    //throw new Error(e);
  }
}


/**
 * @description Get transaction data form KOFD
 * @param {*} jwt
 * @param {*} kassa_id
 * @returns {Promise<string|Error>}
 */
export async function getTransaction(jwt: string, knumber: string, id_kassa: number, name_kassa: string, id_organization: number, dateMode: string | { dateStart: Date, dateEnd: Date }) {
  logger.info('api - starting getTransaction: ' + JSON.stringify({ knumber, id_kassa, name_kassa }) + ' ' + dateMode);
  const token = "Bearer " + jwt;
  //await writeLog(`jwt.txt`, String(token));

  let dateString, dateStart, dateEnd;
  if (dateMode != '') {
    let dateArr: Array<string>;
    if (typeof (dateMode) == 'string') {
      dateArr = getStringFilter(dateMode);
    } else { // if is object
      dateArr = getStringFilter('period', dateMode.dateStart, dateMode.dateEnd);
    }
    dateString = dateArr[0];
    dateStart = dateArr[1];
    dateEnd = dateArr[2];

    //skip=0&take=${count} - убрано кол-во операций
    const config = {
      method: "get",
      url: `https://cabinet.kofd.kz/api/operations?${dateString}&cashboxId=${knumber}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      httpsAgent: agent,
      timeout: 10000
    };

    try {
      const res = await axios(config);
      //console.log(res.data);
      if (res.data.error) {
        await logger.error(res.data.error, 'getData');
        return;
      }
      res.data['id_kassa'] = id_kassa;
      res.data['name_kassa'] = name_kassa;
      res.data['id_organization'] = id_organization;
      res.data['knumber'] = knumber;
      res.data['dateStart'] = dateStart;
      res.data['dateEnd'] = dateEnd;
      res.data['token'] = token;
      await writeLog(`response-${knumber}.txt`, res.data, false);
      logger.info('api - ending getTransaction');
      return res.data;
    } catch (e) {
      await logger.error(e, 'getTransaction');
      //throw new Error(e);
    }
  }
}

/**
* @description Get check data form KOFD
* @param {string} id
* @param {string} knumber 
* @param {string} token 
* @returns {Promise<string|Error>} object
*/
export async function getCheck(id: string, knumber: string, token: string) {
  logger.info('api - starting getCheck: ' + id + " - " + knumber);
  const config = {
    method: "get",
    url: `https://cabinet.kofd.kz/api/operations/operation?cashboxId=${knumber}&operationId=${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    httpsAgent: agent,
    timeout: 10000
  };
  try {
    const res = await axios(config);
    //console.log(res.data);
    if (res.data.error) {
      await logger.error(res.data.error, 'getCheck');
      return;
    }
    logger.info('api - ending getCheck: ' + id + " - " + knumber);
    //console.log(JSON.stringify(res.data));
    return res.data;
  } catch (e) {
    await logger.error(e, 'getCheck');
    console.log(e)
  }
}


/**
* @description Any query to DB
* @param {*} query
* @returns {Promise<string|Error>}
*/
// async function getQuery(query: string) {
//   logger.info('api - starting getQuery: ' + query.slice(0, 50));
//   const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//     connectionTimeoutMillis: 6000,
//     query_timeout: 6000,
//     idle_in_transaction_session_timeout: 2000,
//   });

//   try {
//     await client.connect();
//   } catch (err) {
//     await logger.error(JSON.stringify(err), 'getQuery-connect');
//     //console.error('query error', err.stack);
//     //throw err;
//   }

//   try {
//     let res = await client.query(query);
//     //console.log(res)
//     //await writeLog(`sql.txt`, res);
//     //await writeLog(`query.txt`, new Date().toLocaleString("ru-RU") + ' /// ' + String(query), true,false);
//     return res;
//   } catch (e) {
//     await logger.error(JSON.stringify(e), 'query');
//     //console.error('query error', err.stack);
//     //throw new Error(e);
//   } finally {
//     client.end();
//     logger.info('api - ending getQuery');
//   }
// }

// 

/**
* @description recieve string for adding to filter GET in URI encode
* @param {string} mode
* @returns {Array} string, date
*/

function getStringFilter(mode: string, begin?: Date, end?: Date) {
  //console.log(mode);
  logger.info('api - starting getStringFilter: ' + mode);
  //moment.updateLocale('ru');
  moment.updateLocale('ru', {
    week: {
      dow: 1,
      doy: 4
    }
  });
  let dateStart, dateEnd;

  if (mode === 'текущий день') {
    dateStart = moment().startOf('day');
    dateEnd = moment().endOf('day');
  } else if (mode === 'текущая неделя') {
    dateStart = moment().startOf('week');
    dateEnd = moment().endOf('week');
  } else if (mode === 'текущий месяц') {
    dateStart = moment().startOf('month');
    dateEnd = moment().endOf('month');
  } else if (mode === 'текущий квартал') {
    dateStart = moment().startOf('quarter');
    dateEnd = moment().endOf('quarter');
  } else if (mode === 'текущее полугодие') {
    if (moment(new Date()).get('quarter') < 3) {
      dateStart = moment().startOf('year');
      dateEnd = moment(dateStart).add(5, 'M').endOf('month');
    } else {
      dateStart = moment().startOf('year');
      dateStart = moment(dateStart).add(6, 'M').startOf('month');
      dateEnd = moment().endOf('year');
    }
  } else if (mode === 'текущий год') {
    dateStart = moment().startOf('year');
    dateEnd = moment().endOf('year');
  } else if (mode === 'прошлый день') { // 
    dateStart = moment().add(-1, 'd').startOf('day');
    dateEnd = moment().add(-1, 'd').endOf('day');
  } else if (mode === 'прошлая неделя') {
    dateStart = moment().add(-1, 'w').startOf('week');
    dateEnd = moment().add(-1, 'w').endOf('week');
  } else if (mode === 'прошлый месяц') {
    dateStart = moment().add(-1, 'M').startOf('month');
    dateEnd = moment().add(-1, 'M').endOf('month');
  } else if (mode === 'прошлый квартал') {
    dateStart = moment().add(-1, 'Q').startOf('quarter');
    dateEnd = moment().add(-1, 'Q').endOf('quarter');
  } else if (mode === 'прошлое полугодие') {
    if (moment(new Date()).get('quarter') < 3) {
      dateStart = moment().startOf('year');
      dateEnd = moment(dateStart).add(5, 'M').endOf('month');
    } else {
      dateStart = moment().startOf('year');
      dateStart = moment(dateStart).add(6, 'M').startOf('month');
      dateEnd = moment().endOf('year');
    }
    dateStart = dateStart.add(-2, 'Q').startOf('quarter');
    dateEnd = dateEnd.add(-2, 'Q').endOf('quarter');
  } else if (mode === 'прошлый год') {
    dateStart = moment().add(-1, 'y').startOf('year');
    dateEnd = moment().add(-1, 'y').endOf('year');
  } else if (mode === 'chart-10') {
    dateStart = moment().add(-9, 'd').startOf('day');
    dateEnd = moment().endOf('day');
    //console.log(dateStart, dateEnd);
  } else {
    dateStart = moment(begin).startOf('day');
    dateEnd = moment(end).endOf('day');
  }
  dateStart = dateStart.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');
  dateEnd = dateEnd.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');

  //&filter=[["operationDate",">=","2022-12-18T00:00:00.000+06:00"],"and",["operationDate","<","2022-12-22T00:00:00.000+06:00"]]
  let s1 = `&requireTotalCount=true&sort=[{"selector":"operationDate","desc":true}]&filter=[["operationDate",">=","${dateStart}"],"and",["operationDate","<=","${dateEnd}"]]`;
  let s2 = encodeURI(s1).replaceAll(',', '%2C').replaceAll(':', '%3A').replaceAll('+', '%2B'); // остались :+,
  //s2 = s2.replaceAll();

  return [s2, dateStart, dateEnd, mode];
}



