// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody
} from '@nestjs/websockets';
import {Socket, Server} from "socket.io";
import {SendingPricesService} from "../sending-prices/sending-prices.service";
import {raw} from "express";
import {SettingsService} from "../settings/settings.service";

@WebSocketGateway(8001, { transports: ['websocket'] })  // port?
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() private server: Server;
  private timer: any;

  constructor(private readonly sendingPricesService: SendingPricesService,
              private readonly settings: SettingsService) {
  }

  @SubscribeMessage('updatingPrices')
  async onChgEvent(client: Socket){
    let {dateChangeSpeed, isStarted} = this.settings.getSettings();
    if (isStarted){
      let {updatingStocks, indexHistoricalData} = await this.sendingPricesService.startTrading();
      console.log('Start trading')
      if (this.timer !== null){
        clearInterval(this.timer);
      }
      this.server.emit('updatingPrices', updatingStocks);
      this.timer = setInterval(async () => {
        let { isStarted } = this.settings.getSettings();
        if (updatingStocks && indexHistoricalData > 0 && isStarted){
          let updatingStocksString = await this.sendingPricesService.getNewPrices(--indexHistoricalData);
          updatingStocks = JSON.parse(updatingStocksString)
          console.log('UpdatingStocks: ')
          console.log(updatingStocks)
          this.server.emit('updatingPrices', updatingStocks);
        }
      }, 1000 * dateChangeSpeed)
    }


    //this.server.emit('updatingPrices', )
  }

  @SubscribeMessage('stopUpdatingPrices')
  onStopUpdatingPrices(client: Socket){
    console.log('Stop')
    console.log(this.timer)
    if (this.timer !== null){
      clearInterval(this.timer);
    }
  }

  afterInit(server: Server): any {
    console.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.server.emit('updatingPrices', [5, 6, 7])
    console.log(`Client disconnected: ${client.id}`);
  }


}
