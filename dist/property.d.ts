import { PropertySignature, PropertyDeclaration } from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
import { CGParameterNode } from "./param";
export declare class CGPropertyNode extends CGCodeNode {
    readonly propertySignature: PropertySignature | PropertyDeclaration;
    readonly genericTypes: string[];
    readonly module: CGModuleNode;
    constructor(propertySignature: PropertySignature | PropertyDeclaration, genericTypes: string[], module: CGModuleNode);
    isOptional(): boolean;
    isFunctionType(): boolean;
    functionTypeArgs(): CGParameterNode[];
    isClassType(): boolean;
    nameOfNode(): string;
    nameOfProp(): string;
    codeDartType(): string;
    codeOfVars(): string;
    codeOfPlainSetter(): string;
    codeOfPlainSetterBlock(): string;
    codeOfToJSON(): string;
    codeOfDefaultValue(): string;
    code(): string;
}
