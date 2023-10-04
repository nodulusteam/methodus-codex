import { ClassDeclaration, Project, SourceFile } from 'ts-morph';
import { Injectable } from '@nestjs/common';

export interface ModuleMap {
    name: string;
    parameters: any;
    class: ClassDeclaration;
    // providers: Record<string, ProviderMap>;
    // controllers: Record<string, ProviderMap>;
}

export interface ProviderMap {
    parameters: any;
    name: string;
}

@Injectable()
export class MapperService {
    modulesMap: Record<string, ModuleMap> = {};
    controllersMap: Record<string, ProviderMap> = {};
    providersMap: Record<string, ProviderMap> = {};
    relationsMap: Record<string, any> = {};
    scanPath: string;
    buildMap(scanPath: string) {
        this.scanPath = scanPath;
        this.mapResources();

        this.addParameters();

        return {
            relations: this.relationsMap,
            modules: this.modulesMap,
            controllers: this.controllersMap,
            providers: this.providersMap,
        };
    }

    addParameters() {
        for (const sourceFile of this.getSources()) {
            for (const classDeclaration of sourceFile.getClasses()) {
                const className = classDeclaration.getName() ?? 'unknown';
                this.handleRelationsByDeclarations(sourceFile, className);

                for (const constructorDeclaration of classDeclaration.getConstructors()) {
                    for (const parameter of constructorDeclaration.getParameters()) {
                        const parameterKey = parameter.getType().compilerType.getSymbol()?.getName();

                        this.relationsMap[className] = this.relationsMap[className] || {};
                        this.relationsMap[className][parameterKey] = { name: parameterKey };

                        const instance =
                            this.modulesMap[className] ||
                            this.controllersMap[className] ||
                            this.providersMap[className];
                        if (instance) {
                            instance.parameters[parameterKey] = { name: parameter.getName(), type: parameterKey };
                        }
                    }
                }
            }
        }
    }

    mapResources() {
        for (const sourceFile of this.getSources()) {
            //.slice(0, 30)

            for (const classDeclaration of sourceFile.getClasses()) {
                const className = classDeclaration.getName() ?? 'unknown';
                for (const decorator of classDeclaration.getDecorators()) {
                    switch (decorator.getName()) {
                        case 'Module':
                            this.modulesMap[className] = { name: className, parameters: {}, class: classDeclaration };
                            break;
                        case 'Controller':
                            this.controllersMap[className] = { name: className, parameters: {} };
                            break;
                        case 'Injectable':
                            this.providersMap[className] = { name: className, parameters: {} };
                            break;
                    }
                }
            }
        }
    }

    handleRelationsByDeclarations(sourceFile: SourceFile, className: string) {
        for (const importDeclaration of sourceFile.getImportDeclarations()) {
            for (const namedImport of importDeclaration.getNamedImports()) {
                const nameKey = namedImport.getName();
                if (this.controllersMap[nameKey] || this.providersMap[nameKey]) {
                    this.relationsMap[className] = this.relationsMap[className] || {};
                    this.relationsMap[className][nameKey] = { name: nameKey };
                }
            }
        }
    }

    buildModulesMap() {
        const siteMap: Record<string, any> = {};
        this.getSources()
            //.slice(0, 30)
            .forEach((sourceFile) => {
                sourceFile.getClasses().forEach((classDeclaration) => {
                    const className = classDeclaration.getName() ?? 'unknown';

                    const scopedClass: any = (siteMap[className] = {
                        type: 'class',
                        name: className,
                        properties: [],
                        methods: [],
                        parameters: [],
                        decorators: [],
                    });

                    classDeclaration.getConstructors().forEach((constructorDeclaration) => {
                        scopedClass.parameters = constructorDeclaration
                            .getParameters()
                            .map((p) => ({ name: p.getName() }));
                    });

                    scopedClass.properties = classDeclaration.getProperties().map((p) => ({ name: p.getName() }));

                    scopedClass.methods = classDeclaration.getMethods().map((p) => ({ name: p.getName() }));
                });
            });
    }

    getSources() {
        const project = new Project({
            tsConfigFilePath: this.scanPath + '/tsconfig.json',
        });

        // add source files
        // project.addSourceFilesAtPaths('src/**/*.ts');

        return project.getSourceFiles();
    }
}
