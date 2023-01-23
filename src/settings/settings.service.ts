import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path'
import {ISettings, ISettingsCreate} from "./ISettings";

@Injectable()
export class SettingsService {
    private settings: ISettings;

    constructor() {
        let rawdataSettings: Buffer = fs.readFileSync(path.join(process.cwd(), '\\src\\settings\\settings.json'))
        this.settings = JSON.parse(String(rawdataSettings));
    }

    getSettings(){
        return this.settings;
    }

    private writeSettingsToFile(){
        let rawdataSettings = JSON.stringify(this.settings);
        fs.writeFileSync(path.join(process.cwd(), '\\src\\settings\\settings.json'), rawdataSettings);
    }

    async update(settings: ISettingsCreate) {
        this.settings = {
            tradingStartDate: settings.tradingStartDate,
            dateChangeSpeed: settings.dateChangeSpeed,
            stocks: settings.stocks,
            isStarted: settings.isStarted,
            currentDate: settings.currentDate
        };
        this.writeSettingsToFile();
    }
}
