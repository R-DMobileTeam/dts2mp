import { ClassDeclaration, InterfaceDeclaration } from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
export declare class CGInterfaceNode extends CGCodeNode {
    readonly interfaceDeclaration: InterfaceDeclaration | ClassDeclaration;
    readonly module: CGModuleNode;
    private properties;
    private methods;
    private extendsClass?;
    constructor(interfaceDeclaration: InterfaceDeclaration | ClassDeclaration, module: CGModuleNode);
    merge(instance: CGInterfaceNode): void;
    private process;
    nameOfNode(): string;
    codeOfGeneric(): string;
    code(): string;
}
