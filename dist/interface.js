"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGInterfaceNode = void 0;
const typescript_1 = require("typescript");
const method_1 = require("./method");
const node_1 = require("./node");
const property_1 = require("./property");
const utils_1 = require("./utils");
class CGInterfaceNode extends node_1.CGCodeNode {
    constructor(interfaceDeclaration, module) {
        super();
        this.interfaceDeclaration = interfaceDeclaration;
        this.module = module;
        this.properties = [];
        this.methods = [];
        this.process();
    }
    merge(instance) {
        this.properties.push(...instance.properties);
        this.methods.push(...instance.methods);
    }
    process() {
        this.interfaceDeclaration.forEachChild((childNode) => {
            let generics = [];
            if (this.interfaceDeclaration.typeParameters &&
                this.interfaceDeclaration.typeParameters.length) {
                generics = this.interfaceDeclaration.typeParameters.map((it) => utils_1.CGUtils.instanceName(it.name));
            }
            if ((0, typescript_1.isPropertySignature)(childNode)) {
                this.properties.push(new property_1.CGPropertyNode(childNode, generics, this.module));
            }
            else if ((0, typescript_1.isMethodSignature)(childNode)) {
                this.methods.push(new method_1.CGMethodNode(childNode, generics, this.module));
            }
        });
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.interfaceDeclaration.name);
    }
    codeOfGeneric() {
        if (this.interfaceDeclaration.typeParameters &&
            this.interfaceDeclaration.typeParameters.length) {
            return `<${this.interfaceDeclaration.typeParameters
                .map((it) => utils_1.CGUtils.tsTypeParameterToDart(it))
                .join(",")}>`;
        }
        return "";
    }
    code() {
        const className = this.nameOfNode();
        return `
class ${className}${this.codeOfGeneric()} {
    
    mpjs.JsObject? $$context$$;

    ${this.properties.map((it) => it.codeOfVars()).join("\n")}

    ${className}({this.$$context$$});

    ${this.properties.length > 0
            ? `
    void setValues({${this.properties
                .map((it) => it.codeOfPlainSetter())
                .join(",")}}) {
          ${this.properties.map((it) => it.codeOfPlainSetterBlock()).join("\n")}
    }
    `
            : ""}

    Map toJson() {
        return {
            ${this.properties.map((it) => it.codeOfToJSON()).join(",\n")}
        }..removeWhere((key, value) => value == null);
    }

    ${this.methods.map((it) => it.code()).join("\n\n")}
}
`;
    }
}
exports.CGInterfaceNode = CGInterfaceNode;
