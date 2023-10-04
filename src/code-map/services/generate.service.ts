import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { Injectable } from '@nestjs/common';
import uniqolor from 'uniqolor';

const colors = [];
for (let i = 0; i < 1000; i++) {
    colors.push(uniqolor.random().color);
}

@Injectable()
export class GenerateService {
    async generateBy(generationMode: string, codeMap) {
        switch (generationMode) {
            case 'mindmap':
                return this.generateHtml(codeMap, 'mindmap/mind-map');
            case 'codemap':
                return this.generateHtml(codeMap, 'codemap/code-map');
            case 'flowmap':
                return this.generateHtml(codeMap, 'flowmap/flow-map');
        }
    }

    async generateHtml(data: any, template: string): Promise<string> {
        const viewsPath = path.resolve(path.join(__dirname, '..', '..', '..', 'views'));
        const str = fs.readFileSync(path.join(viewsPath, `${template}.ejs`), 'utf8');
        const stringForFile = ejs.compile(str, {
            views: [viewsPath],
        })({
            data,
            colors,
        });

        return stringForFile;
    }

    async createHtml(stringForFile: string): Promise<string> {
        const localPath = process.cwd();
        fs.writeFileSync(`${localPath}/siteMap.html`, stringForFile, {
            encoding: 'utf8',
        });

        return stringForFile;
    }
}
