"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGEnumNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const utils_1 = require("./utils");
class CGEnumNode extends node_1.CGCodeNode {
    static isEnum(typeAliasDeclaration) {
        if (!(0, typescript_1.isUnionTypeNode)(typeAliasDeclaration.type)) {
            return false;
        }
        let everyElementIsSimple = typeAliasDeclaration.type.types.every((it) => {
            return (0, typescript_1.isLiteralTypeNode)(it);
        });
        return everyElementIsSimple;
    }
    constructor(typeAliasDeclaration) {
        super();
        this.typeAliasDeclaration = typeAliasDeclaration;
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.typeAliasDeclaration.name);
    }
    code() {
        return `
    enum ${this.nameOfNode()} {
        ${this.typeAliasDeclaration.type.types
            .map((it) => {
            if ((0, typescript_1.isLiteralTypeNode)(it)) {
                if ((0, typescript_1.isStringLiteral)(it.literal)) {
                    return it.literal.text;
                }
            }
            return "$$noname$$";
        })
            .join(",\n")}
    }

    extension on ${this.nameOfNode()} {
        toJson() {
            return rawValue();
        }

        rawValue() {
            switch (this) {
                ${this.typeAliasDeclaration.type.types
            .map((it) => {
            if ((0, typescript_1.isLiteralTypeNode)(it)) {
                if ((0, typescript_1.isStringLiteral)(it.literal)) {
                    return `case ${this.nameOfNode()}.${it.literal.text}: return "${it.literal.text}";`;
                }
            }
        })
            .join("\n")}
                default:
                    return "";
            }
        }
    }
    `;
    }
}
exports.CGEnumNode = CGEnumNode;
