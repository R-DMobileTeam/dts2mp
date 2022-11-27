"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGUtils = void 0;
const typescript_1 = require("typescript");
class CGUtils {
    static instanceName(node) {
        if ((0, typescript_1.isIdentifier)(node)) {
            return node.escapedText.toString();
        }
        else if ((0, typescript_1.isStringLiteral)(node)) {
            return node.text;
        }
        return "";
    }
    static tsTypeParameterToDart(node) {
        var _a;
        if (!node)
            return "";
        const name = this.instanceName(node.name);
        let typeExtends = ``;
        if (node.constraint) {
            typeExtends = ` extends ${this.tsToDartType(node.constraint)}`;
        }
        else if (((_a = node.default) === null || _a === void 0 ? void 0 : _a.kind) === typescript_1.SyntaxKind.AnyKeyword) {
            typeExtends = ` extends dynamic`;
        }
        return `${name}${typeExtends}`;
    }
    static tsToDartType(node) {
        if (node && (0, typescript_1.isTypeReferenceNode)(node)) {
            const typeArgumentsCode = (() => {
                if (node.typeArguments && node.typeArguments.length) {
                    return `<${node.typeArguments
                        .map((it) => CGUtils.tsToDartType(it))
                        .join(",")}>`;
                }
                return "";
            })();
            return this.instanceName(node.typeName) + typeArgumentsCode;
        }
        else if (node && (0, typescript_1.isTypeNode)(node)) {
            if ((0, typescript_1.isArrayTypeNode)(node)) {
                return `List<${this.tsToDartType(node.elementType)}>`;
            }
            if (node.kind === typescript_1.SyntaxKind.StringKeyword) {
                return "String";
            }
            else if (node.kind === typescript_1.SyntaxKind.NumberKeyword) {
                return "num";
            }
            else if (node.kind === typescript_1.SyntaxKind.BooleanKeyword) {
                return "bool";
            }
            else if (node.kind === typescript_1.SyntaxKind.VoidKeyword) {
                return "void";
            }
        }
        return "dynamic";
    }
    static tsToDartDefaultValue(node) {
        if (node && (0, typescript_1.isTypeReferenceNode)(node)) {
            return `${this.instanceName(node.typeName)}()`;
        }
        else if (node && (0, typescript_1.isTypeNode)(node)) {
            if ((0, typescript_1.isArrayTypeNode)(node)) {
                return `<${this.tsToDartType(node.elementType)}>[]`;
            }
            if (node.kind === typescript_1.SyntaxKind.StringKeyword) {
                return `""`;
            }
            else if (node.kind === typescript_1.SyntaxKind.NumberKeyword) {
                return "0";
            }
            else if (node.kind === typescript_1.SyntaxKind.BooleanKeyword) {
                return "false";
            }
        }
        return "null";
    }
}
exports.CGUtils = CGUtils;
