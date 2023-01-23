import {Controller, Get, Header, HttpCode, Param, Post, HttpStatus, Body, Delete, Put} from '@nestjs/common';
import {BrokersService} from "./brokers.service";
import {IBroker, IBrokerCreate, IBrokerUpdate, IPortfolio} from "./IBroker";

@Controller('brokers')
export class BrokersController {
    constructor(private readonly brokersService: BrokersService) {}

    @Get()
    @Header('Content-Type', 'application/json')
    async getAll() {
        return await this.brokersService.getAll();
    }

    @Get(':id')
    @Header('Content-Type', 'application/json')
    async getOne(@Param('id') id: string){
        return await this.brokersService.getById(parseInt(id));
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Header('Cache-Control', 'none')
    async create(@Body() broker: IBrokerCreate){
        return await this.brokersService.create(broker);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.brokersService.remove(parseInt(id))
    }

    @Put(':id')
    async update(@Body() broker: IBrokerUpdate, @Param('id') id: string){
        return this.brokersService.update(parseInt(id), broker)
    }

    @Post('buyStock/:id')
    @Header('Cache-Control', 'none')
    async buy(@Body() buyStock, @Param('id') id: string){
        return await this.brokersService.buyStock(buyStock, id);
    }

    @Post('sellStock/:id')
    @Header('Cache-Control', 'none')
    async sell(@Body() sellStock, @Param('id') id: string){
        return await this.brokersService.sellStock(sellStock, id);
    }

    @Get('portfolio/:id')
    @Header('Content-Type', 'application/json')
    async getPortfolio(@Param('id') id: string){
        return await this.brokersService.getPortfolio(id);
    }
}
