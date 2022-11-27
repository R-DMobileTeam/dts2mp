"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGPropertyNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const utils_1 = require("./utils");
class CGPropertyNode extends node_1.CGCodeNode {
    constructor(propertySignature, genericTypes, module) {
        super();
        this.propertySignature = propertySignature;
        this.genericTypes = genericTypes;
        this.module = module;
    }
    isOptional() {
        var _a;
        if (this.genericTypes.indexOf(this.codeDartType()) >= 0) {
            return true;
        }
        if (this.propertySignature.questionToken) {
            return true;
        }
        return ((_a = (this.propertySignature.type &&
            (0, typescript_1.isOptionalTypeNode)(this.propertySignature.type))) !== null && _a !== void 0 ? _a : false);
    }
    isClassType() {
        return this.module.interfaceInstances[this.codeDartType()] !== undefined;
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.propertySignature.name);
    }
    nameOfProp() {
        if ((0, typescript_1.isStringLiteral)(this.propertySignature.name)) {
            const text = this.propertySignature.name.text;
            return text.replace(/[\.]/g, "_");
        }
        return utils_1.CGUtils.instanceName(this.propertySignature.name);
    }
    codeDartType() {
        return utils_1.CGUtils.tsToDartType(this.propertySignature.type);
    }
    codeOfVars() {
        const $isTypeReferenceNode = this.propertySignature.type &&
            (0, typescript_1.isTypeReferenceNode)(this.propertySignature.type) &&
            this.genericTypes.indexOf(this.codeDartType()) < 0;
        return `${this.codeDartType()}${this.isOptional() ? "?" : ""} $${this.nameOfProp()}${this.isOptional() ? "" : `= ${this.codeOfDefaultValue()}`};
      
      Future<${this.codeDartType()}${this.isOptional() ? "?" : ""}> get ${this.nameOfProp()} async {
          ${(() => {
            if ($isTypeReferenceNode) {
                if (!this.isClassType()) {
                    return `return $${this.nameOfNode()};`;
                }
                return `return ${this.codeDartType()}($$context$$: $$context$$?.getProperty('${this.nameOfNode()}'));`;
            }
            else {
                return `return await $$context$$?.getPropertyValue('${this.nameOfNode()}') ?? $${this.nameOfProp()};`;
            }
        })()}
            
        }
      `;
    }
    codeOfPlainSetter() {
        return `${this.codeDartType()}? ${this.nameOfProp()}`;
    }
    codeOfPlainSetterBlock() {
        return `if (${this.nameOfProp()} != null) $${this.nameOfProp()} = ${this.nameOfProp()};`;
    }
    codeOfToJSON() {
        return `'${this.nameOfNode()}': $${this.nameOfProp()}`;
    }
    codeOfDefaultValue() {
        if (this.isOptional()) {
            return "null";
        }
        return utils_1.CGUtils.tsToDartDefaultValue(this.propertySignature.type);
    }
    code() {
        return ``;
    }
}
exports.CGPropertyNode = CGPropertyNode;
