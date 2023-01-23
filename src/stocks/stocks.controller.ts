import {Body, Controller, Get, Header, HttpCode, HttpStatus, Post, Put} from '@nestjs/common';
import {StocksService} from "./stocks.service";

@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) {
    }

    @Get()
    @Header('Content-Type', 'application/json')
    async getAll() {
        return await this.stocksService.getAll();
    }

    @Get('history')
    @Header('Content-Type', 'application/json')
    async getHistory(){
        return await this.stocksService.getHistoricalData();
    }
}
