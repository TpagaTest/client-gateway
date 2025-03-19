import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, TRANSACTION_SERVICE } from '../config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TransactionsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.transactionMsHost,
          port: envs.transactionMsPort,
        },
      },
    ]),
    AuthModule,
  ],
})
export class TransactionsModule {}
