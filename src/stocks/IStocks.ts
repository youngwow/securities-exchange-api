export interface IStocks{
    id: number,
    label: string,
    name: string,
    price: number
}

interface IStockData{
    date: string,
    open: string
}

export interface IStocksHistoricalData{
    label: string,
    stocks: IStockData[]
}