// MIT © 2017 azu
"use strict";
const nomnoml = require('nomnoml');
import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

const groupBy = require("lodash.groupby");
const useCaseDir = path.join(__dirname, "..", "src/use-case");
const allUseCases = glob.sync(`${useCaseDir}/**/*UseCase.ts`);

interface NomnomlUseCase {
    actor: string
    group: string;
    useCase: string;
    importedUseCases: string[]
}

interface NomnomlGroup {
    name: string;
    useCases: {
        useCase: string;
        actor: string;
        importedUseCases: string[];
    }[]
}

const getUseCaseName = (useCaseFileName: string): string => {
    return useCaseFileName
        .replace(new RegExp(ActorList.join("|"), "g"), "")
        .replace(/UseCase$/, "");
};
const getImportedFiles = (content: string, filePath: string): string[] => {
    const lines = content.split("\n");
    const importLines = lines.filter(line => /from\s+['"][^'"]+['"]/.test(line));
    return importLines.map(line => {
        const match = line.match(/from\s+['"]([^'"]+)['"]/);
        if (match) {
            const moduleName = match[1];
            if(/^\./.test(moduleName)) {
                // "./HogeUseCase"
                return path.resolve(filePath, match[1]);
            }else{
                // from "almin"
                return moduleName;
            }
        }
        return "";
    }).filter(path => path.length > 0);
};
const ActorList = [
    "AppUser",
    "System"
];
const DefaultActor = "AppUser";
const createUseCase = (useCaseFile: string): NomnomlUseCase => {
    const group = path.basename(path.dirname(useCaseFile));
    const basename = path.basename(useCaseFile, ".ts");
    const useCase = getUseCaseName(basename);
    const actorDefined = ActorList.find(actor => {
        return basename.indexOf(actor) !== -1;
    });
    const actor = actorDefined ? actorDefined : DefaultActor;
    const content = fs.readFileSync(useCaseFile, "utf-8");
    const list = getImportedFiles(content, useCaseFile);
    const importedUseCases = list.filter((filePath: string) => {
        return /UseCase/i.test(filePath);
    }).map((filePath: string) => {
        return getUseCaseName(path.basename(filePath, ".ts"))
    }).filter((dependencyUseCase: string) => {
        return dependencyUseCase !== useCase;
    });
    return {
        actor,
        group,
        useCase,
        importedUseCases
    }
};

const createGroup = (useCases: NomnomlUseCase[]): NomnomlGroup[] => {
    const groupByName = groupBy(useCases, (useCase: NomnomlUseCase) => useCase.group);
    const results: NomnomlGroup[] = [];
    Object.keys(groupByName).forEach(groupName => {
        results.push({
            name: groupName,
            useCases: groupByName[groupName]
        })
    });
    return results;
};
const createNomnomlText = (groups: NomnomlGroup): string => {
    const actorAnduseCase = groups.useCases.map(useCase => {
        let base = `[<actor> ${useCase.actor}] -> [<usecase> ${useCase.useCase}]`;
        useCase.importedUseCases.forEach((importedUseCase: string) => {
            base += `\n[<usecase> ${useCase.useCase}] -> [<usecase> ${importedUseCase}]`;
        });
        return base;
    });
    return `[${groups.name}|
${actorAnduseCase.join("\n")}
]
`
};


const useCases = allUseCases.map((useCaseFilePath) => {
    return createUseCase(useCaseFilePath);
});
const groups = createGroup(useCases);
const results = groups.map(group => {
    return createNomnomlText(group);
});

// console.log(`
// #direction: right
// #spacing: 50
// #padding: 20
// ${results.join("\n")}`);
console.log(nomnoml.renderSvg(`
#direction: right
#spacing: 50
#padding: 20
${results.join("\n")}`));
