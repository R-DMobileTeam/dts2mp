"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGFunctionNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const param_1 = require("./param");
const utils_1 = require("./utils");
class CGFunctionNode extends node_1.CGCodeNode {
    constructor(functionDeclaration, module) {
        super();
        this.functionDeclaration = functionDeclaration;
        this.module = module;
        this.parameters = [];
        this.process();
    }
    process() {
        this.functionDeclaration.parameters.forEach((it) => {
            this.parameters.push(new param_1.CGParameterNode(it, [], this.module));
        });
    }
    codeOfGeneric() {
        if (this.functionDeclaration.typeParameters &&
            this.functionDeclaration.typeParameters.length) {
            return `<${this.functionDeclaration.typeParameters
                .map((it) => utils_1.CGUtils.tsTypeParameterToDart(it))
                .join(",")}>`;
        }
        return "";
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.functionDeclaration.name);
    }
    isOptionalReturnType() {
        var _a;
        if (this.functionDeclaration.questionToken) {
            return true;
        }
        return ((_a = (this.functionDeclaration.type &&
            (0, typescript_1.isOptionalTypeNode)(this.functionDeclaration.type))) !== null && _a !== void 0 ? _a : false);
    }
    codeOfReturnValue() {
        let gType = utils_1.CGUtils.tsToDartType(this.returnType());
        if (gType.startsWith("Promise<")) {
            gType = gType.substring(8, gType.length - 1);
        }
        return `Future<${gType}${this.isOptionalReturnType() ? "?" : ""}>`;
    }
    returnType() {
        return this.functionDeclaration.type;
    }
    isClassType() {
        return (this.module.interfaceInstances[utils_1.CGUtils.tsToDartType(this.returnType())] !== undefined);
    }
    code() {
        return `
        ${this.codeOfReturnValue()} ${this.nameOfNode()}${this.codeOfGeneric()}(${this.parameters
            .map((it) => it.code())
            .join(",")}) async {
          final result = await mpjs.context.callMethod('${this.nameOfNode()}', [${this.parameters
            .map((it) => it.codeOfCallArgs())
            .join(",")}]);
          ${this.isClassType()
            ? `
          return ${utils_1.CGUtils.tsToDartType(this.returnType())}($$context$$: result);
          `
            : `return result;`}
        }
        `;
    }
}
exports.CGFunctionNode = CGFunctionNode;
