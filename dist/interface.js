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
        if (this.interfaceDeclaration.heritageClauses) {
            this.interfaceDeclaration.heritageClauses.forEach((it) => {
                it.types.forEach((type) => {
                    if ((0, typescript_1.isIdentifier)(type.expression)) {
                        const extendsClassName = type.expression.text;
                        this.extendsClass =
                            this.module.interfaceInstances[extendsClassName];
                    }
                });
            });
        }
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
        var _a;
        const className = this.nameOfNode();
        const allProperties = [];
        allProperties.push(...this.properties);
        if (this.extendsClass) {
            allProperties.push(...this.extendsClass.properties);
        }
        const superProperties = (_a = this.extendsClass) === null || _a === void 0 ? void 0 : _a.properties;
        return `
class ${className}${this.codeOfGeneric()} ${this.extendsClass ? `extends ${this.extendsClass.nameOfNode()}` : ""} {
    
    mpjs.JsObject? $$context$$;

    ${this.properties.map((it) => it.codeOfVars()).join("\n")}

    ${className}({this.$$context$$})${this.extendsClass ? ":super($$context$$:$$context$$)" : ""};

    ${this.properties.length > 0
            ? `
    void setValues({${allProperties
                .map((it) => it.codeOfPlainSetter())
                .join(",")}}) {
        ${superProperties
                ? `super.setValues(${superProperties.map((it) => `${it.nameOfProp()}:${it.nameOfProp()}`)});`
                : ""}
          ${this.properties.map((it) => it.codeOfPlainSetterBlock()).join("\n")}
    }
    `
            : ""}

    Map toJson() {
        return {
            ${this.properties.map((it) => it.codeOfToJSON()).join(",\n")}
            ${this.extendsClass ? `,...super.toJson()` : ""}
        }..removeWhere((key, value) => value == null);
    }

    ${this.methods.map((it) => it.code()).join("\n\n")}
}
`;
    }
}
exports.CGInterfaceNode = CGInterfaceNode;
