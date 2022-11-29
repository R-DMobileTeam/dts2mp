"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGModuleNode = void 0;
const typescript_1 = require("typescript");
const enum_1 = require("./enum");
const function_1 = require("./function");
const interface_1 = require("./interface");
const node_1 = require("./node");
const type_alias_1 = require("./type_alias");
class CGModuleNode extends node_1.CGCodeNode {
    constructor(moduleDeclaration) {
        super();
        this.moduleDeclaration = moduleDeclaration;
        this.interfaceInstances = {};
        this.enumInstances = {};
        this.codeNodes = [];
        this.process();
    }
    process() {
        const body = this.moduleDeclaration.body;
        const interfaceCache = {};
        if (body && (0, typescript_1.isModuleBlock)(body)) {
            body.forEachChild((childNode) => {
                if ((0, typescript_1.isInterfaceDeclaration)(childNode)) {
                    const instance = new interface_1.CGInterfaceNode(childNode, this);
                    if (interfaceCache[instance.nameOfNode()]) {
                        interfaceCache[instance.nameOfNode()].merge(instance);
                    }
                    else {
                        interfaceCache[instance.nameOfNode()] = instance;
                        this.codeNodes.push(instance);
                    }
                }
                else if ((0, typescript_1.isTypeAliasDeclaration)(childNode)) {
                    if (enum_1.CGEnumNode.isEnum(childNode)) {
                        const instance = new enum_1.CGEnumNode(childNode);
                        this.enumInstances[instance.nameOfNode()] = instance;
                        this.codeNodes.push(instance);
                    }
                    else {
                        this.codeNodes.push(new type_alias_1.CGTypeAliasNode(childNode));
                    }
                }
                else if ((0, typescript_1.isFunctionDeclaration)(childNode)) {
                    this.codeNodes.push(new function_1.CGFunctionNode(childNode, this));
                }
            });
        }
    }
    code() {
        return `
import 'dart:convert';
import 'package:mpcore/mpjs/mpjs.dart' as mpjs;

${this.codeNodes.map((it) => it.code()).join("\n\n")}
`;
    }
}
exports.CGModuleNode = CGModuleNode;
