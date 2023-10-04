import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MapperService } from './code-map/services/mapper.service';
import { GenerateService } from './code-map/services/generate.service';
import { CodeMapModule } from './code-map/code-map.module';

@Module({
    imports: [EventEmitterModule.forRoot(), CodeMapModule],
    controllers: [AppController],
    providers: [MapperService, GenerateService],
})
export class AppModule {}
