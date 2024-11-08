// src/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { AppLoggerService } from 'src/services/app-logger/app-logger.service';

@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule {}
