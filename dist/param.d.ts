import { ParameterDeclaration } from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
export declare class CGParameterNode extends CGCodeNode {
    readonly parameter: ParameterDeclaration;
    readonly genericTypes: string[];
    readonly module: CGModuleNode;
    constructor(parameter: ParameterDeclaration, genericTypes: string[], module: CGModuleNode);
    isOptionalType(): boolean;
    nameOfNode(): string;
    codeOfCallArgs(): string;
    code(): string;
}
