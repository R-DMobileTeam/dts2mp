import { TypeAliasDeclaration } from "typescript";
import { CGCodeNode } from "./node";
export declare class CGTypeAliasNode extends CGCodeNode {
    readonly typeAliasDeclaration: TypeAliasDeclaration;
    constructor(typeAliasDeclaration: TypeAliasDeclaration);
    nameOfNode(): string;
    codeOfRight(): string;
    code(): string;
}
