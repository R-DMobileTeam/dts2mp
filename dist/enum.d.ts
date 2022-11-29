import { TypeAliasDeclaration } from "typescript";
import { CGCodeNode } from "./node";
export declare class CGEnumNode extends CGCodeNode {
    readonly typeAliasDeclaration: TypeAliasDeclaration;
    static isEnum(typeAliasDeclaration: TypeAliasDeclaration): boolean;
    constructor(typeAliasDeclaration: TypeAliasDeclaration);
    nameOfNode(): string;
    code(): string;
}
