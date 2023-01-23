import {Injectable, StreamableFile} from '@nestjs/common';
//import fs, {createReadStream} from "fs";
//import path from "path";
import * as fs from 'fs';
import * as path from 'path'
import {IBroker, IBrokerCreate, IBrokerUpdate, IPortfolio} from './IBroker';

@Injectable()
export class BrokersService {
    private readonly brokers: IBroker[];  // Object[]

    constructor() {
        let rawdataBrokers: Buffer = fs.readFileSync(path.join(process.cwd(), '\\src\\brokers\\brokers.json'))
        this.brokers = JSON.parse(String(rawdataBrokers));
    }

    async getAll(){
        return this.brokers;
    }

    async getById(id: number) {
        return this.brokers.find((item: IBroker) => { return item.id === id });
    }

    async create(broker: IBrokerCreate) {
        const lastId = this.getLastId();
        let newBroker: IBroker = {
            id: lastId + 1,
            name: broker.name,
            value: broker.value,
            stocks: []
        }
        this.brokers.push(newBroker)
        this.writeBrokersToFile()
        return newBroker;
    }

    async remove(id: number){
        let indexBroker = this.brokers.findIndex((item: IBroker) => { return item.id === id });
        const brokerId =  this.brokers[indexBroker].id;
        this.brokers.splice(indexBroker, 1);
        this.writeBrokersToFile()
        return brokerId;
    }

    async update(id: number, broker: IBrokerUpdate) {
        let indexBroker = this.brokers.findIndex((item: IBroker) => { return item.id === id });
        broker.id = id;
        this.brokers[indexBroker] = broker;
        this.writeBrokersToFile()
    }

    private writeBrokersToFile(){
        let rawdataBrokers = JSON.stringify(this.brokers);
        fs.writeFileSync(path.join(process.cwd(), '\\src\\brokers\\brokers.json'), rawdataBrokers);
    }

    private getLastId(): number {
        return this.brokers.length > 0 ? this.brokers[this.brokers.length - 1].id : 0;
    }

    async buyStock(buyStock, id) {
        try {
            const brokerIndex = this.brokers.findIndex(broker => broker.id === parseInt(id));
            // if (!this.brokers[brokerIndex].stocks.find(stock => stock.label === buyStock.label)){
            //     this.brokers[brokerIndex].stocks.push({
            //         label: buyStock.label,
            //         count: buyStock.count
            //     })
            //     this.brokers[brokerIndex].value = buyStock.value;
            // } else{
            //
            //     for (const stock of this.brokers[brokerIndex].stocks) {
            //         if (stock.label === buyStock.label){
            //             if (buyStock.count < 0) break;
            //             stock.count += buyStock.count
            //             this.brokers[brokerIndex].value = buyStock?.value;
            //             break;
            //         }
            //     }
            // }
            if (buyStock.count > 0 && this.brokers[brokerIndex].value > buyStock.count * buyStock.oldPrice){
                this.brokers[brokerIndex].stocks.push({
                    label: buyStock.label,
                    count: buyStock.count,
                    oldPrice: buyStock.oldPrice
                })
                this.brokers[brokerIndex].value = buyStock.value
            }

            this.writeBrokersToFile();
            //console.log(this.brokers[brokerIndex])
            return this.brokers;
        } catch (e) {
            console.error(e)
        }
    }

    async sellStock(sellStock, id: string) {
        try {
            const brokerIndex = this.brokers.findIndex(broker => broker.id === parseInt(id));
            // if (this.brokers[brokerIndex].stocks.length > 0){
            //     for (const stock of this.brokers[brokerIndex].stocks) {
            //         if (stock.label === sellStock.label){
            //             if (sellStock.count > stock.count) break;
            //             stock.count -= sellStock.count;
            //             this.brokers[brokerIndex].value = sellStock.value;
            //             break;
            //         }
            //     }
            // }
            let countStocksToSell = sellStock.count;
            let count = 0;
            for (const stockElement of this.brokers[brokerIndex].stocks) {
                if (stockElement.label === sellStock.label){
                    count += stockElement.count
                }
            }
            if (count < countStocksToSell){
                return this.brokers;
            }
            const indexesDeleteStocks = [];
            if (this.brokers[brokerIndex].stocks.length > 0){
                for (const [index, stock] of this.brokers[brokerIndex].stocks.entries()) {
                    console.log(stock.label)
                    if (stock.label === sellStock.label){
                        //if (sellStock.count > stock.count) break;
                        console.log(stock)
                        console.log(countStocksToSell)
                        if (stock.count <= countStocksToSell){
                            countStocksToSell -= stock.count
                            indexesDeleteStocks.push(index)
                            //this.brokers[brokerIndex].stocks.splice(index, 1);
                        } else{
                            //console.log('hwer')
                            stock.count -= countStocksToSell;
                            console.log(stock.count)
                        }
                        //this.brokers[brokerIndex].value = sellStock.value;
                    }
                }
            }
            //console.log(indexesDeleteStocks)
            this.brokers[brokerIndex].stocks = this.removeByIndexes(this.brokers[brokerIndex].stocks, indexesDeleteStocks)
            //console.log(this.brokers[brokerIndex].stocks)
            this.brokers[brokerIndex].value = sellStock.value
            this.writeBrokersToFile();
            //console.log(this.brokers[brokerIndex])
            return this.brokers;
        } catch (e) {
            console.error(e)
        }
    }

    private removeByIndexes (arr, arrayOfIndexes) {
        // const arrayOfIndexes = [].slice.call(arguments, 1);  // (1)
        return arr.filter(function (item, index) {         // (2)
            return arrayOfIndexes.indexOf(index) == -1;      // (3)
        });
    }

    async getPortfolio(id: string) {
        try {
            const brokerId = parseInt(id);
            const broker = this.brokers.find(broker => broker.id === brokerId);
            return broker.stocks;
        } catch (e) {
            console.error(e)
        }

    }
}
