import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    @Get()
    async getMap(): Promise<string> {
        return 'true';
    }
}
