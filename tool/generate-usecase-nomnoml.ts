// MIT © 2017 azu
"use strict";
const nomnoml = require('nomnoml');
import * as glob from "glob";
import * as path from "path";

const groupBy = require("lodash.groupby");
const useCaseDir = path.join(__dirname, "..", "src/use-case");
const allUseCases = glob.sync(`${useCaseDir}/**/*UseCase.ts`);

interface NomnomlUseCase {
    actor: string
    group: string;
    useCase: string
}

interface NomnomlGroup {
    name: string;
    useCases: {
        useCase: string;
        actor: string;
    }[]
}

const ActorList = [
    "AppUser",
    "System"
];
const DefaultActor = "AppUser";
const createUseCase = (useCaseFile: string): NomnomlUseCase => {
    const group = path.basename(path.dirname(useCaseFile));
    const basename = path.basename(useCaseFile, ".ts");
    const useCase = basename
        .replace(new RegExp(ActorList.join("|"), "g"), "")
        .replace(/UseCase$/, "");
    const actorDefined = ActorList.find(actor => {
        return basename.indexOf(actor) !== -1;
    });
    const actor = actorDefined ? actorDefined : DefaultActor;
    return {
        actor,
        group,
        useCase
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
        return `[<actor> ${useCase.actor}] -> [<usecase> ${useCase.useCase}]`;
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
