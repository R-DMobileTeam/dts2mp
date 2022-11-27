import { ModuleDeclaration } from "typescript";
import { CGInterfaceNode } from "./interface";
import { CGCodeNode } from "./node";
export declare class CGModuleNode extends CGCodeNode {
    readonly moduleDeclaration: ModuleDeclaration;
    interfaceInstances: {
        [key: string]: CGInterfaceNode;
    };
    codeNodes: CGCodeNode[];
    constructor(moduleDeclaration: ModuleDeclaration);
    private process;
    code(): string;
}
