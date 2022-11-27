"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGSource = void 0;
const typescript_1 = require("typescript");
const module_1 = require("./module");
const utils_1 = require("./utils");
class CGSource {
    constructor(dtsContent) {
        this.dtsContent = dtsContent;
        this.modules = {};
        this.sourceFile = (0, typescript_1.createSourceFile)("cg.d.ts", dtsContent, typescript_1.ScriptTarget.ES2015);
        this.process();
    }
    process() {
        (0, typescript_1.forEachChild)(this.sourceFile, (childNode) => {
            if ((0, typescript_1.isModuleDeclaration)(childNode)) {
                const name = utils_1.CGUtils.instanceName(childNode.name);
                const moduleInstance = new module_1.CGModuleNode(childNode);
                this.modules[name] = moduleInstance;
            }
        });
    }
}
exports.CGSource = CGSource;
