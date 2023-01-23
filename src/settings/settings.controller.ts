import {Body, Controller, Get, Header, HttpCode, HttpStatus, Post, Put} from '@nestjs/common';
import {SettingsService} from "./settings.service";
import {ISettings, ISettingsCreate} from "./ISettings";

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    @Header('Content-Type', 'application/json')
    async getSettings(){
        return this.settingsService.getSettings();
    }

    @Put()
    async update(@Body() settings: ISettingsCreate){
        await this.settingsService.update(settings);
    }

}
