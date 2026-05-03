import { sql } from './sqlserver.connection.js';

export const SqlTypes = {
  UniqueIdentifier: sql.UniqueIdentifier,
  NVarChar: sql.NVarChar,
  Int: sql.Int,
  Decimal: sql.Decimal,
  Bit: sql.Bit,
  DateTime2: sql.DateTime2,
  Time: sql.Time,
  Max: sql.MAX,
};

export const {
  UniqueIdentifier,
  NVarChar,
  Int,
  Decimal,
  Bit,
  DateTime2,
  Time,
  Max,
} = SqlTypes;
