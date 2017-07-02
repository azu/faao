// MIT © 2017 azu
"use strict";
import * as path from "path";

const nomnoml = require("nomnoml");
const groupBy = require("lodash.groupby");
const minimatch = require("minimatch");

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

(async () => {
    const tree = await fetch("https://api.github.com/repos/azu/faao/git/trees/master?recursive=1").then(response => {
        return response.json();
    }).then((json) => {
        return json.tree;
    });
    const allUseCases: string[] = tree.map((file: { path: string }) => {
        return file.path;
    }).filter((filePath: string) => {
        return minimatch(filePath, "src/**/*UseCase.ts");
    });
    console.log(allUseCases);
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

    const source = `
#title: UseCase archtecture
#direction: right
#spacing: 50
#padding: 20
${results.join("\n")}`;
    const canvas = document.getElementById('js-canvas');
    nomnoml.draw(canvas, source);


})();