import fs from 'fs/promises';
import { logger, writeLog } from "../../utils/log-files";
import dotenv from 'dotenv';

//import { getJWT, getTransaction, getQuery } from './api';
import prismaI from '../../utils/prisma';
import { organization, Prisma, PrismaClient } from '@prisma/client';
import { postKassaSchemaT } from '../kassa/kassa.schema';
import { getJWT, getTransaction } from './api';
//const { logger.error, writeLog, logger, isFileExist } = require('../logs/logs-utils.js');

const count = 1000; // count of transaction get from kofd
dotenv.config();


// get list of org & kassa form db 
export async function load(period: string | { dateStart: Date, dateEnd: Date }, knumber?: Array<string>, BIN?: Array<string>) {

  logger.info('load - starting with mode ' + period);

  const tableSumAll: sumSale = {
    sumSale: 0,
    sumSaleCard: 0,
    sumSaleCash: 0,
    sumSaleMixed: 0,
    sumReturn: 0,
    sumReturnCard: 0,
    sumReturnCash: 0,
    sumReturnMixed: 0,
    sumAll: 0,
    sumAllCard: 0,
    sumAllCash: 0,
    sumAllMixed: 0,
    countChecks: 0,
    cashEject: 0,
    dateStart: '',
    dateEnd: '',
    obj: [],
    errors: 0
  };


  const listOrg: {
    id: number,
    BIN: string,
    name_org: string,
    jwt: string
  }[] = [];

  try {
    let temp2: Array<{ id: number, BIN: string, name_org: string, jwt?: string }> = []
    if (typeof (BIN) == 'object') {
      temp2 = await prismaI.organization.findMany({
        where: { BIN: { in: BIN } }
      });
      // перекладываем из массива Призмы в наш массив
    } else {
      temp2 = await prismaI.organization.findMany();
    }
    temp2.forEach(element => {
      listOrg.push({
        id: element.id,
        BIN: element.BIN,
        name_org: element.name_org,
        jwt: ''
      });
    })

  }
  catch (err) {
    console.log(err);
    logger.error('get-load-load - get organizations ' + err);
  }

  //return;



  type listKassaT = {
    snumber: string,
    knumber: string,
    znumber: string,
    name_kassa: string,
    id_organization: number,
    id: number,
    organization: { BIN: string, name_org: string },
    BIN: string,
    name_org: string,
    jwt?: string
  };

  let listKassa: Array<listKassaT> = [];


  //let temp1 : prismaI.kassa. .CreateManyArgs.data;
  try {
    let temp1 = [];
    if (typeof (knumber) == 'object') {
      temp1 = await prismaI.kassa.findMany({
        include: {
          organization: {
            select: {
              BIN: true,
              name_org: true,
            }
          },
        },
        where: { knumber: { in: knumber } }
      }) as Array<listKassaT>;
    } else {
      temp1 = await prismaI.kassa.findMany({
        include: {
          organization: {
            select: {
              BIN: true,
              name_org: true,
            }
          },
        }
      }) as Array<listKassaT>;
    }
    // перекладываем из массива Призмы в наш массив
    temp1.forEach(element => {
      listKassa.push({
        id: element.id,
        snumber: element.snumber,
        knumber: element.knumber,
        znumber: element.znumber,
        name_kassa: element.name_kassa,
        id_organization: element.id_organization,
        organization: element.organization,
        BIN: element.organization.BIN,
        name_org: element.organization.name_org,
        jwt: ''
      });
    })
  }
  catch (err) {
    console.log(err);
    logger.error('get-load-load - get kassa ' + err);
  }



  //console.table(listOrg);
  //console.table(listKassa);

  let arrJWT: Promise<string>[] = [];
  let arrGet: Promise<raw_data>[] = [];

  try {

    logger.info('load - starting of build array with JWT');
    listOrg.forEach(element => {
      //let res3 = await getJWT(element.BIN, process.env.KOFDPASSWORD as string);
      arrJWT.push(getJWT(element.BIN, process.env.KOFDPASSWORD as string));
    })
    let res = await Promise.all(arrJWT); // получаем токены
    //console.log(JSON.stringify(res));

    // добавляем токены к списку организаций, только придется разрешить любой тип  
    listOrg.forEach((element, index) => {
      element['jwt'] = res[index];
    });

    logger.info('load - starting GET receive transaction');
    listKassa.forEach((elementKassa) => {
      listOrg.forEach((elementOrg) => {
        if (elementKassa.BIN === elementOrg.BIN) {
          elementKassa['jwt'] = elementOrg.jwt;
          arrGet.push(getTransaction(elementKassa.jwt, elementKassa.knumber, elementKassa.id, elementKassa.name_kassa, elementKassa.id_organization, elementKassa.BIN, period));
        }
      });
    });
    let res2 = await Promise.all(arrGet);
    writeLog(`rows.txt`, JSON.stringify(res2), false);
    res2.forEach((element3: raw_data) => {
      //console.log(element3.name_kassa + ", " + element3.data.length + ", " + element3.id_kassa + ",  " + element3.id_organization);
      writeLog(`response.txt`, JSON.stringify(element3), false);
      writeOperation(element3, element3.id_kassa, element3.id_organization);
      getSummary(tableSumAll, getStat(element3, element3.id_kassa, element3.knumber, element3.name_kassa, element3.id_organization, element3.BIN, element3.dateStart, element3.dateEnd));
    });
    //fs.appendFile("get/response.txt", JSON.stringify(res) + "\n", (error2) => { });
    writeLog(`tableSumAll.txt`, JSON.stringify(tableSumAll), false);
    console.log('get-load.ts ended load with mode: ', period);
    return {
      table: tableSumAll,
      list: parseResRows(res2)
    };
  }
  catch (err) {
    console.log(err);
    logger.error('get-load-load - get all operations ' + err);
    //throw new Error(err);
  }
}

export function parseResRows(rows: Array<raw_data>) {
  logger.info('get-load - parseResRows starting');
  //console.log(JSON.stringify(rows));

  const list: listT[] = [];
  if (rows.length == 0) {
    return list;
  }

  rows.forEach((kassa) => {

    let kassa_array = kassa.data.filter((e) => { //фильтрация по типу операций
      return e.type == 1;
    });
    kassa_array = kassa.data.filter((e) => {
      return e.subType == 2 || e.subType == 3;
    });

    kassa_array.forEach((element) => {
      //console.log(JSON.stringify(element));
      let elementTypeOper, elementSum;
      if (element.type == 1 && element.subType == 3) {
        elementTypeOper = 'возврат';
        elementSum = -1 * Number(element.sum);
      }
      if (element.type == 1 && element.subType == 2) {
        elementTypeOper = 'продажа';
        elementSum = element.sum;
      }
      let elementTypePay;
      //if (typeof (element.paymentTypes) == 'object') {
      if (element.paymentTypes == '0,1') {
        elementTypePay = 'смешанно';
      } else if (element.paymentTypes == '0') {
        elementTypePay = 'кеш';
      } else if (element.paymentTypes == '1') {
        elementTypePay = 'карта';
      }

      //}
      // console.log(String(element.operationDate).slice(0,10));
      // console.log(controlDate);
      //if (String(element.operationDate).slice(0,10) == controlDate) { // сверка даты операции и переданной даты
      list.push({
        knumber: kassa.knumber,
        id_organization: kassa.id_organization,
        name_kassa: kassa.name_kassa,
        id_kassa: kassa.id_kassa,
        BIN: kassa.BIN,
        typeOper: String(elementTypeOper),
        sum: elementSum,
        typePay: elementTypePay,
        id: element.id,
        date: element.operationDate,
        shift: element.shift
        //check: {}
      });
    })
  });
  logger.info('get-load - parseResRows ending');
  return list;
}


// insert to db from recieved transaction 
async function writeOperation(res: raw_data, id_kassa: number, id_organization: number) {
  if (res.data.length == 0) { return }

  const dataArr: Prisma.transactionCreateManyInput[] = [];

  res.data.forEach((element2, index) => {
    dataArr.push({
      id: element2.id,
      onlineFiscalNumber: String(element2.onlineFiscalNumber),
      offlineFiscalNumber: String(element2.offlineFiscalNumber),
      systemDate: element2.systemDate,
      operationDate: element2.operationDate,
      type: element2.type,
      subType: element2.subType,
      sum: element2.sum,
      availableSum: element2.availableSum,
      paymentTypes: String(element2.paymentTypes),
      shift: element2.shift,
      id_organization: id_organization,
      id_kassa: id_kassa,
    });
  });
  //console.log(JSON.stringify(dataArr));
  try {
    const res3 = await prismaI.transaction.createMany({
      data: dataArr,
      skipDuplicates: true
    });
    logger.info('api-load/writeOperation - create transaction in DB ' + JSON.stringify(res3));
  }
  catch (err) {
    console.log(err);
    logger.error('api-load/writeOperation - create transaction in DB ' + err);
  }

}

// count statistics from recieved transaction 
function getStat(res: raw_data, id_kassa: number, knumber: string, name_kassa: string, id_organization: number, BIN: string, dateStart: string, dateEnd: string) {

  const tableSum: sumSale = {
    sumSale: 0,
    sumSaleCard: 0,
    sumSaleCash: 0,
    sumSaleMixed: 0,
    sumReturn: 0,
    sumReturnCard: 0,
    sumReturnCash: 0,
    sumReturnMixed: 0,
    sumAll: 0,
    sumAllCard: 0,
    sumAllCash: 0,
    sumAllMixed: 0,
    countChecks: 0,
    shiftClosed: false,
    cashEject: 0,
    knumber: knumber,
    id_kassa: id_kassa,
    name_kassa: name_kassa,
    id_organization: id_organization,
    BIN: BIN,
    dateStart: dateStart,
    dateEnd: dateEnd,
    errors: 0
  };

  logger.info(`load - starting get stat for ${knumber} / ${name_kassa}`);

  try {
    res.data.forEach((element2) => {
      //console.log(element2);
      if (element2.type == 1) {
        if (element2.subType == 2) { // продажа
          tableSum.countChecks++;
          tableSum.sumSale += Number(element2.sum);
          //console.log(element2.paymentTypes);
          if (typeof (element2.paymentTypes) == 'object') {
            if (element2.paymentTypes == '0,1') {
              tableSum.sumSaleMixed += Number(element2.sum);
            } else if (element2.paymentTypes == '0') {
              tableSum.sumSaleCash += Number(element2.sum);
            } else if (element2.paymentTypes == '1') {
              tableSum.sumSaleCard += Number(element2.sum);
            }
          }
        }
        else if (element2.subType == 3) { // возврат
          tableSum.countChecks++;
          tableSum.sumReturn += Number(element2.sum);
          if (element2.paymentTypes == '0,1') {
            tableSum.sumReturnMixed += Number(element2.sum);
          } else if (element2.paymentTypes == '0') {
            tableSum.sumReturnCash += Number(element2.sum);
          } else if (element2.paymentTypes == '1') {
            tableSum.sumReturnCard += Number(element2.sum);
          }
        }
      } else if (element2.type == 2) { // смена
        tableSum.shiftClosed = true;
      } else if (element2.type == 6 && element2.subType == 1) { // выемка
        tableSum.cashEject += Number(element2.sum);
      }
    });
    tableSum.sumAll = tableSum.sumSale - tableSum.sumReturn;
    tableSum.sumAllCard = tableSum.sumSaleCard - tableSum.sumReturnCard;
    tableSum.sumAllCash = tableSum.sumSaleCash - tableSum.sumReturnCash;
    tableSum.sumAllMixed = tableSum.sumSaleMixed - tableSum.sumReturnMixed;
    writeLog(`stat-${knumber}.txt`, JSON.stringify(tableSum), false);
    return tableSum;
    //console.log('Итоги по кассе ' + name_kassa + ':');
    //console.log(tableSum);
  }
  catch (err) {
    logger.error('getStat ' + err);
    tableSum.errors = tableSum.errors + 1;
    return tableSum;
    //console.error('query error', err.stack);
  }

}

function getSummary(tableSumAll: sumSale, obj: sumSale) {
  
  logger.info(`load - starting get summary for ${JSON.stringify(obj.name_kassa)}`);

  try {
    tableSumAll.sumSale += obj.sumSale;
    tableSumAll.sumSaleCard += obj.sumSaleCard;
    tableSumAll.sumSaleCash += obj.sumSaleCash;
    tableSumAll.sumSaleMixed += obj.sumSaleMixed;
    tableSumAll.sumReturn += obj.sumReturn;
    tableSumAll.sumReturnCard += obj.sumReturnCard;
    tableSumAll.sumReturnCash += obj.sumReturnCash;
    tableSumAll.sumReturnMixed += obj.sumReturnMixed;
    tableSumAll.sumAll += obj.sumAll;
    tableSumAll.sumAllCard += obj.sumAllCard;
    tableSumAll.sumAllCash += obj.sumAllCash;
    tableSumAll.sumAllMixed += obj.sumAllMixed;
    tableSumAll.countChecks += obj.countChecks;
    tableSumAll.cashEject += obj.cashEject;
    tableSumAll.dateStart = obj.dateStart;
    tableSumAll.dateEnd = obj.dateEnd;
    if (typeof (tableSumAll.obj) == 'object') {
      tableSumAll.obj.push(obj);
    }

  }
  catch (err) {
    logger.error('getSummary ' + err);
    //console.error('query error', err.stack);
    //throw new Error(err);
  }
}

export type raw_row = {
  id: string,
  onlineFiscalNumber?: string,
  offlineFiscalNumber?: string,
  systemDate: Date,
  operationDate: Date,
  type: number,
  subType?: number,
  sum?: number,
  availableSum?: number,
  paymentTypes?: string,
  shift: number,
  id_organization?: number, // not present in raw, but needed in DB Array
  id_kassa?: number,
  name_kassa?: string,

  //uploadDate  : Date,
};

export type raw_data = {
  data: Array<raw_row>,
  id_organization: number,
  BIN: string,
  id_kassa: number,
  name_kassa: string,
  knumber: string;
  dateStart: string;
  dateEnd: string
}

export type sumSale = {
  sumSale: number,
  sumSaleCard: number,
  sumSaleCash: number,
  sumSaleMixed: number,
  sumReturn: number,
  sumReturnCard: number,
  sumReturnCash: number,
  sumReturnMixed: number,
  sumAll: number,
  sumAllCard: number,
  sumAllCash: number,
  sumAllMixed: number,
  countChecks: number,
  cashEject: number,
  dateStart: string,
  dateEnd: string;
  obj?: Array<sumSale>,
  name_kassa?: string
  shiftClosed?: boolean,
  knumber?: string,
  id_kassa?: number,
  id_organization?: number,
  BIN?: string,
  errors: number
}

export type listT = {
  token?: string,
  knumber: string,
  id_kassa: number,
  name_kassa: string,
  BIN: string,
  id_organization: number,
  //name_org: string,
  typeOper: string,
  sum?: number,
  typePay?: string,
  id: string,
  date: Date,
  shift: number
};


(async () => {
  //console.log(await load('прошлый '));
  // console.log(await load({
  //   dateStart: new Date(2022, 11, 1),
  //   dateEnd: new Date(2022, 11, 31)
  // }));
   //await load('прошлая неделя');
})();

//, '800727301256'