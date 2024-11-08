import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModule } from 'nest-winston';

export const logger = WinstonModule.createLogger({
  levels: winston.config.npm.levels,  // Utilise les niveaux de Winston par défaut
  level: 'debug',                      // Niveau minimum enregistré ; 'debug' affiche tout ce qui est au-dessus

  transports: [
    // Transport pour les logs dans un fichier
    new winston.transports.File({
      filename: 'C:/app/logs/app.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Transport pour afficher les logs dans la console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});
