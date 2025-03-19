import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { TRANSACTION_SERVICE } from '../config';
import { JwtAuthGuard } from '../auth/auth.guard';
import { catchError } from 'rxjs';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly transactionClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTransaction(@Body() body: any, @Request() req) {
    const userId = req.user?.sub;
    return this.transactionClient.send('createTransaction', {...body, userId}).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Get transaction failed');
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllTransactions(@Query() paginationDto: PaginationDto, @Request() req) {
    const userId = req.user?.sub;
    return this.transactionClient.send('findAllTransactions', {...paginationDto, userId }).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Get transaction failed');
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findTransaction(@Param('id') id: string, @Request() req) {
    const userId = req.user?.sub;
    return this.transactionClient.send('findOneTransaction', { id, userId}).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Get transaction failed');
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTransaction(@Param('id') id:string, @Body() body:any, @Request() req) {
    const userId = req.user?.sub;
    return this.transactionClient.send('updateTransaction', {id, body, userId}).pipe(
      catchError((error) => {
        console.error(error)
        throw new BadRequestException(error?.message || 'Update transaction failed');
      }),
    );
  }
}
