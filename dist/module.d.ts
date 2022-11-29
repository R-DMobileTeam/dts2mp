import { ModuleDeclaration } from "typescript";
import { CGEnumNode } from "./enum";
import { CGInterfaceNode } from "./interface";
import { CGCodeNode } from "./node";
export declare class CGModuleNode extends CGCodeNode {
    readonly moduleDeclaration: ModuleDeclaration;
    interfaceInstances: {
        [key: string]: CGInterfaceNode;
    };
    enumInstances: {
        [key: string]: CGEnumNode;
    };
    codeNodes: CGCodeNode[];
    constructor(moduleDeclaration: ModuleDeclaration);
    private process;
    code(): string;
}
