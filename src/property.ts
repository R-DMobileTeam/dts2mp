import {
  PropertySignature,
  isOptionalTypeNode,
  isTypeReferenceNode,
  isStringLiteral,
  PropertyDeclaration,
} from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
import { CGUtils } from "./utils";

export class CGPropertyNode extends CGCodeNode {
  constructor(
    readonly propertySignature: PropertySignature | PropertyDeclaration,
    readonly genericTypes: string[],
    readonly module: CGModuleNode
  ) {
    super();
  }

  isOptional(): boolean {
    if (this.genericTypes.indexOf(this.codeDartType()) >= 0) {
      return true;
    }
    if (this.propertySignature.questionToken) {
      return true;
    }
    return (
      (this.propertySignature.type &&
        isOptionalTypeNode(this.propertySignature.type)) ??
      false
    );
  }

  isClassType(): boolean {
    return this.module.interfaceInstances[this.codeDartType()] !== undefined;
  }

  nameOfNode(): string {
    return CGUtils.instanceName(this.propertySignature.name);
  }

  nameOfProp(): string {
    if (isStringLiteral(this.propertySignature.name)) {
      const text = this.propertySignature.name.text;
      return text.replace(/[\.]/g, "_");
    }
    return CGUtils.instanceName(this.propertySignature.name);
  }

  codeDartType(): string {
    return CGUtils.tsToDartType(this.propertySignature.type);
  }

  codeOfVars(): string {
    const $isTypeReferenceNode =
      this.propertySignature.type &&
      isTypeReferenceNode(this.propertySignature.type) &&
      this.genericTypes.indexOf(this.codeDartType()) < 0;
    return `${this.codeDartType()}${
      this.isOptional() ? "?" : ""
    } $${this.nameOfProp()}${
      this.isOptional() ? "" : `= ${this.codeOfDefaultValue()}`
    };
      
      Future<${this.codeDartType()}${
      this.isOptional() ? "?" : ""
    }> get ${this.nameOfProp()} async {
          ${(() => {
            if ($isTypeReferenceNode) {
              if (!this.isClassType()) {
                return `return $${this.nameOfNode()};`;
              }
              return `return ${this.codeDartType()}($$context$$: $$context$$?.getProperty('${this.nameOfNode()}'));`;
            } else {
              return `return await $$context$$?.getPropertyValue('${this.nameOfNode()}') ?? $${this.nameOfProp()};`;
            }
          })()}
            
        }
      `;
  }

  codeOfPlainSetter(): string {
    return `${this.codeDartType()}? ${this.nameOfProp()}`;
  }

  codeOfPlainSetterBlock(): string {
    return `if (${this.nameOfProp()} != null) $${this.nameOfProp()} = ${this.nameOfProp()};`;
  }

  codeOfToJSON(): string {
    return `'${this.nameOfNode()}': $${this.nameOfProp()}`;
  }

  codeOfDefaultValue(): string {
    if (this.isOptional()) {
      return "null";
    }
    return CGUtils.tsToDartDefaultValue(this.propertySignature.type);
  }

  code(): string {
    return ``;
  }
}
