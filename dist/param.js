"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGParameterNode = void 0;
const typescript_1 = require("typescript");
const node_1 = require("./node");
const utils_1 = require("./utils");
class CGParameterNode extends node_1.CGCodeNode {
    constructor(parameter, genericTypes, module) {
        super();
        this.parameter = parameter;
        this.genericTypes = genericTypes;
        this.module = module;
    }
    isOptionalType() {
        var _a;
        if (this.genericTypes.indexOf(utils_1.CGUtils.tsToDartType(this.parameter.type)) >= 0) {
            return true;
        }
        if (this.parameter.questionToken) {
            return true;
        }
        return ((_a = (this.parameter.type && (0, typescript_1.isOptionalTypeNode)(this.parameter.type))) !== null && _a !== void 0 ? _a : false);
    }
    nameOfNode() {
        return utils_1.CGUtils.instanceName(this.parameter.name);
    }
    codeOfCallArgs() {
        if (this.module.interfaceInstances[utils_1.CGUtils.tsToDartType(this.parameter.type)] !== undefined) {
            return `${this.nameOfNode()}${this.isOptionalType() ? "?" : ""}.toJson()`;
        }
        else {
            return `${this.nameOfNode()}`;
        }
    }
    code() {
        return `${utils_1.CGUtils.tsToDartType(this.parameter.type)}${this.isOptionalType() ? "?" : ""} ${this.nameOfNode()}`;
    }
}
exports.CGParameterNode = CGParameterNode;
