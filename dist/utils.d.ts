import { Node, TypeNode, TypeParameterDeclaration } from "typescript";
export declare class CGUtils {
    static instanceName(node: Node): string;
    static tsTypeParameterToDart(node?: TypeParameterDeclaration): string;
    static tsToDartType(node?: TypeNode): string;
    static tsToDartDefaultValue(node?: TypeNode): string;
}
