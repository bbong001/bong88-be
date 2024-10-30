import { ConfigService } from '@/config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GSService } from '../services/gs/gs.service';
import { hashMD5 } from '@/shared/utils/hash.util';
import { GSErrorCodes } from '@/shared/constants/gs-error.constants';
import { TASK_STATUS } from '@/shared/constants/task-status.contant';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly gsOperatorCode: string;
  private readonly gsSecretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly gsService: GSService,
  ) {
    this.gsOperatorCode = configService.getGSOperatorCode();
    this.gsSecretKey = configService.getGSSecretKey();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.logger.debug('Check cron every minute');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAgentCredit() {
    this.logger.debug('Called check agent credit every minute');

    const resGS = await this.gsService.checkAgentCredit({
      operatorcode: this.gsOperatorCode,
      signature: hashMD5(`${this.gsOperatorCode}${this.gsSecretKey}`).toUpperCase(),
    });

    if (resGS.errCode !== GSErrorCodes.SUCCESS.code) {
      this.logger.error(`${TASK_STATUS.FAILED} → ${JSON.stringify(resGS)}`);
    } else {
      this.logger.log(`${TASK_STATUS.COMPLETED} → ${JSON.stringify(resGS)}`);
    }
  }
}
