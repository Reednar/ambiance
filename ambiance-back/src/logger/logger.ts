import { utilities as nestWinstonModuleUtilities, WinstonLogger } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';


export const winstonLoggerOptions: winston.LoggerOptions = {
    transports: [
      // Affichage dans la console
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('MyApp', {
            prettyPrint: true,
          }),
        ),
      }),
  
      // Enregistrement dans un fichier JSON (rotation quotidienne)
      new DailyRotateFile({
        dirname: path.join(__dirname, '..', 'logs'), // dossier de logs
        filename: '%DATE%.log.json', // nom du fichier
        datePattern: 'YYYY-MM-DD',   // rotation quotidienne
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  };