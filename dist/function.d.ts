import { FunctionDeclaration } from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
import { CGParameterNode } from "./param";
export declare class CGFunctionNode extends CGCodeNode {
    readonly functionDeclaration: FunctionDeclaration;
    readonly module: CGModuleNode;
    parameters: CGParameterNode[];
    constructor(functionDeclaration: FunctionDeclaration, module: CGModuleNode);
    private process;
    codeOfGeneric(): string;
    nameOfNode(): string;
    isOptionalReturnType(): boolean;
    codeOfReturnValue(): string;
    returnType(): import("typescript").TypeNode | undefined;
    isClassType(): boolean;
    code(): string;
}
