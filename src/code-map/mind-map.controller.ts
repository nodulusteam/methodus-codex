import { Controller, Get, Logger } from '@nestjs/common';
import { MapperService } from './services/mapper.service';
import { GenerateService } from './services/generate.service';

@Controller('mind-map')
export class MindMapController {
    private readonly logger = new Logger(MindMapController.name);

    constructor(public readonly mapperService: MapperService, public readonly generateService: GenerateService) {}

    @Get()
    async getMap(): Promise<string> {
        const scanPath = process.cwd();
        const codeMap = this.mapperService.buildMap(scanPath);
        const html = await this.generateService.generateHtml(codeMap, 'mindmap/mind-map');
        return html;
    }
}
