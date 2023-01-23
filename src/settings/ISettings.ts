import {IStocks} from "../stocks/IStocks";

export interface ISettings{
    "tradingStartDate": string,
    "dateChangeSpeed": number,
    "stocks": IStocks[],
    "isStarted": boolean,
    "currentDate": string
}

export interface ISettingsCreate{
    "tradingStartDate": string,
    "dateChangeSpeed": number,
    "stocks": IStocks[],
    "isStarted": boolean,
    "currentDate": string
}