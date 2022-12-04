"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGMethodNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const param_1 = require("./param");
const utils_1 = require("./utils");
class CGMethodNode extends node_1.CGCodeNode {
    constructor(methodSignature, genericTypes, module) {
        super();
        this.methodSignature = methodSignature;
        this.genericTypes = genericTypes;
        this.module = module;
        this.parameters = [];
        this.process();
    }
    process() {
        this.methodSignature.parameters.forEach((it) => {
            this.parameters.push(new param_1.CGParameterNode(it, this.genericTypes, this.module));
        });
    }
    codeOfGeneric() {
        if (this.methodSignature.typeParameters &&
            this.methodSignature.typeParameters.length) {
            return `<${this.methodSignature.typeParameters
                .map((it) => utils_1.CGUtils.tsTypeParameterToDart(it))
                .join(",")}>`;
        }
        return "";
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.methodSignature.name);
    }
    isOptionalReturnType() {
        var _a;
        if (this.genericTypes.indexOf(utils_1.CGUtils.tsToDartType(this.methodSignature.type)) >= 0) {
            return true;
        }
        if (this.methodSignature.questionToken) {
            return true;
        }
        return ((_a = (this.methodSignature.type &&
            (0, typescript_1.isOptionalTypeNode)(this.methodSignature.type))) !== null && _a !== void 0 ? _a : false);
    }
    codeOfReturnValue() {
        let gType = utils_1.CGUtils.tsToDartType(this.returnType());
        if (gType.startsWith("Promise<")) {
            gType = gType.substring(8, gType.length - 1);
        }
        return `Future<${gType}${this.isOptionalReturnType() ? "?" : ""}>`;
    }
    returnType() {
        return this.methodSignature.type;
    }
    returnConstructorType() {
        var _a;
        const returnType = this.returnType();
        if (returnType &&
            (0, typescript_1.isTypeReferenceNode)(returnType) &&
            (0, typescript_1.isIdentifier)(returnType.typeName) &&
            returnType.typeName.text === "Promise") {
            return (_a = returnType.typeArguments) === null || _a === void 0 ? void 0 : _a[0];
        }
        return this.returnType();
    }
    isClassType() {
        var _a;
        const returnType = this.returnType();
        if (returnType &&
            (0, typescript_1.isTypeReferenceNode)(returnType) &&
            (0, typescript_1.isIdentifier)(returnType.typeName) &&
            returnType.typeName.text === "Promise") {
            return (this.module.interfaceInstances[utils_1.CGUtils.tsToDartType((_a = returnType.typeArguments) === null || _a === void 0 ? void 0 : _a[0])] !== undefined);
        }
        return (this.module.interfaceInstances[utils_1.CGUtils.tsToDartType(this.returnType())] !== undefined);
    }
    code() {
        const headParams = [];
        const tailParams = [];
        let foundHead = false;
        for (let index = this.parameters.length - 1; index >= 0; index--) {
            const element = this.parameters[index];
            if (element.isOptionalType() && !foundHead) {
                tailParams.unshift(element);
            }
            else {
                foundHead = true;
                headParams.unshift(element);
            }
        }
        return `
        ${this.codeOfReturnValue()} ${this.nameOfNode()}${this.codeOfGeneric()}(${(() => {
            let code = "";
            if (headParams.length) {
                code += headParams.map((it) => it.code()).join(",");
                if (tailParams.length) {
                    code += ",";
                }
            }
            if (tailParams.length) {
                code += `[${tailParams.map((it) => it.code()).join(",")}]`;
            }
            return code;
        })()}) async {
          final result = await $$context$$?.callMethod('${this.nameOfNode()}', [${this.parameters
            .map((it) => it.codeOfCallArgs())
            .join(",")}]);
          ${this.isClassType()
            ? `
          return ${utils_1.CGUtils.tsToDartType(this.returnConstructorType())}($$context$$: result);
          `
            : `return result;`}
        }
        `;
    }
}
exports.CGMethodNode = CGMethodNode;
