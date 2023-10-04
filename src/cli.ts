#!/usr/bin/env node

const MapperService = require('@methodus/codex/dist/code-map/services/mapper.service').MapperService;
const GenerateService = require('@methodus/codex/dist/code-map/services/generate.service').GenerateService;

// import { MapperService } from './code-map/services/mapper.service';
// import { GenerateService } from './code-map/services/generate.service';

import fs from 'fs';
import open from 'open';
import figlet from 'figlet';
import chalk from 'chalk';

import { getFont } from './random-font.service';

const font: any = getFont();
if (!process.argv[2]) {
    import('boxen').then((boxen) => {
        figlet(
            'CODEX',
            {
                font: 'Standard',
            },
            function (err, codexTitle) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                figlet(
                    'by Methodus',
                    {
                        font: font,
                        horizontalLayout: 'default',
                        verticalLayout: 'default',
                    },
                    function (err, methodusTitle) {
                        if (err) {
                            console.log('Something went wrong...');
                            console.dir(err);
                            return;
                        }

                        const cliText = `\nUse the codex [maptype] command to generate visualizations of your code 
        
                ${chalk.blue('mindmap: a code mind map')}
                ${chalk.green('codemap: a code code map')}
                ${chalk.magenta('flowmap: a code flow map')}
                `;

                        console.log(boxen.default(codexTitle + '\n' + methodusTitle + cliText));
                    },
                );
            },
        );
    });
} else {
    const generationMode = process.argv[2];

    const scanPath = process.argv[3] || process.cwd();
    console.info('scanning path', scanPath);

    const mapperService = new MapperService();
    const generateService = new GenerateService();
    const codeMap = mapperService.buildMap(scanPath);
    generateService.generateBy(generationMode, codeMap).then((stringForFile) => {
        const outputPath = `${scanPath}/${generationMode}.html`;
        fs.writeFileSync(outputPath, stringForFile, {
            encoding: 'utf8',
        });
        console.info(`Saved to ${outputPath}`);

        open(outputPath);
    });
}
