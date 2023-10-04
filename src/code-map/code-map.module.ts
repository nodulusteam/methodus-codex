import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MapperService } from './services/mapper.service';
import { GenerateService } from './services/generate.service';
import { CodeMapController } from './code-map.controller';
import { MindMapController } from './mind-map.controller';

@Module({
    imports: [EventEmitterModule.forRoot()],
    controllers: [CodeMapController, MindMapController],
    providers: [MapperService, GenerateService],
})
export class CodeMapModule {}
