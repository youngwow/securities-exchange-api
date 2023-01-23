import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path'
import {IStocks, IStocksHistoricalData} from "./IStocks";

@Injectable()
export class StocksService {
    private readonly stocks: IStocks[];
    private readonly historicalData: IStocksHistoricalData[];
    // private tradingStocks;

    constructor() {
        let rawdataStocks: Buffer = fs.readFileSync(path.join(process.cwd(), '\\src\\stocks\\stocks.json'))
        this.stocks = JSON.parse(String(rawdataStocks));
        let rawdataHistoricalData: Buffer = fs.readFileSync(path.join(process.cwd(), '\\src\\stocks\\historicalData.json'))
        this.historicalData = JSON.parse(String(rawdataHistoricalData));
        // let rawdatatTradingStocks = fs.readFileSync(path.join(process.cwd(), '\\src\\stocks\\tradingStocks.json'))
        // this.tradingStocks = JSON.parse(String(rawdatatTradingStocks));
    }

    private writeStocksToFile(){
        let rawdataStocks = JSON.stringify(this.stocks);
        fs.writeFileSync(path.join(process.cwd(), '\\src\\stocks\\stocks.json'), rawdataStocks);
    }

    // private writeTradingStocksToFile(){
    //     let rawdataTradingStocks = JSON.stringify(this.tradingStocks);
    //     fs.writeFileSync(path.join(process.cwd(), '\\src\\stocks\\tradingStocks.json'), rawdataTradingStocks);
    // }

    async getAll() {
        return this.stocks;
    }

    async getHistoricalData(){
        return this.historicalData;
    }
}
