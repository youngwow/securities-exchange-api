export interface IBroker{
    id: number,
    name: string,
    value: number,
    stocks?: IPortfolio[]
}

export interface IPortfolio {
    label: string,
    count: number,
    oldPrice: number
}

export interface IBrokerUpdate{
    id: number,
    name: string,
    value: number
}

export interface IBrokerCreate{
    name: string,
    value: number
}