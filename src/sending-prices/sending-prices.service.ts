import {Injectable} from '@nestjs/common';
import {SettingsService} from "../settings/settings.service";
import {StocksService} from "../stocks/stocks.service";
import {IStocks, IStocksHistoricalData} from "../stocks/IStocks";


@Injectable()
export class SendingPricesService {
    private selectedLabels: string[];
    private historicalData: IStocksHistoricalData[];
    private timer: any;

    constructor(private readonly settings: SettingsService,
                private readonly stocksService: StocksService) {
    }

    async startTrading() {
        const { tradingStartDate, currentDate, stocks } = this.settings.getSettings();
        this.selectedLabels = SendingPricesService.getSelectedLabels(stocks);
        this.historicalData = await this.stocksService.getHistoricalData();
        // let date = new Date(tradingStartDate);
        // let strDate = date.toISOString();
        // let formDate = `${strDate.slice(5, 7)}/${strDate.slice(8, 10)}/${strDate.slice(0, 4)}`
        let startDate = new Date(tradingStartDate);
        let indexHistoricalData = -1;
        for (const [index, data] of this.historicalData[0].stocks.entries()) {
            let currentDate = new Date(data.date);
            if (currentDate <= startDate){
                indexHistoricalData = index
                break
            }
        }
        console.log(indexHistoricalData)
        let updatingStocksString = await this.getNewPrices(indexHistoricalData);
        let updatingStocks = JSON.parse(updatingStocksString);
        console.log(updatingStocks)

        return {updatingStocks, indexHistoricalData};
    }

    async getNewPrices(indexHistoricalData: number) {
        let allStocks: IStocks[] = await this.stocksService.getAll();
        let myStocks = allStocks.filter(stock => this.selectedLabels.includes(stock.label))
        //console.log(myStocks)
        let finalStocks: IStocks[] = myStocks.map(stock => {
            let tmpStocks = this.historicalData.find(data => data.label === stock.label).stocks;
            //console.log(tmpStocks[indexHistoricalData])
            return {
                label: stock.label,
                name: stock.name,
                id: stock.id,
                price: parseFloat(tmpStocks[indexHistoricalData].open),
                date: tmpStocks[indexHistoricalData].date
                //open: tmpStocks[indexHistoricalData].open
            }
        })
        return JSON.stringify(finalStocks);
    }

    private static getSelectedLabels(stocks: IStocks[]): string[] {
        const selectedLabels = []
        for (const stock of stocks) {
            selectedLabels.push(stock.label)
        }
        return selectedLabels;
    }
}
