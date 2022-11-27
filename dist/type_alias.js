"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGTypeAliasNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const utils_1 = require("./utils");
class CGTypeAliasNode extends node_1.CGCodeNode {
    constructor(typeAliasDeclaration) {
        super();
        this.typeAliasDeclaration = typeAliasDeclaration;
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.typeAliasDeclaration.name);
    }
    codeOfRight() {
        const rightNode = this.typeAliasDeclaration.type;
        if ((0, typescript_1.isFunctionTypeNode)(rightNode)) {
            return `${utils_1.CGUtils.tsToDartType(rightNode.type)} Function(${rightNode.parameters
                .map((it) => {
                return utils_1.CGUtils.tsToDartType(it.type);
            })
                .join(",")})`;
        }
        else {
            return "";
        }
    }
    code() {
        return `typedef ${this.nameOfNode()} = ${this.codeOfRight()};`;
    }
}
exports.CGTypeAliasNode = CGTypeAliasNode;
