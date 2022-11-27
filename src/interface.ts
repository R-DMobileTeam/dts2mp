import {
  InterfaceDeclaration,
  isMethodSignature,
  isPropertySignature,
} from "typescript";
import { CGMethodNode } from "./method";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
import { CGPropertyNode } from "./property";
import { CGUtils } from "./utils";

export class CGInterfaceNode extends CGCodeNode {
  private properties: CGPropertyNode[] = [];
  private methods: CGMethodNode[] = [];

  constructor(
    readonly interfaceDeclaration: InterfaceDeclaration,
    readonly module: CGModuleNode
  ) {
    super();
    this.process();
  }

  merge(instance: CGInterfaceNode) {
    this.properties.push(...instance.properties);
    this.methods.push(...instance.methods);
  }

  private process() {
    this.interfaceDeclaration.forEachChild((childNode) => {
      let generics: string[] = [];
      if (
        this.interfaceDeclaration.typeParameters &&
        this.interfaceDeclaration.typeParameters.length
      ) {
        generics = this.interfaceDeclaration.typeParameters.map((it) =>
          CGUtils.instanceName(it.name)
        );
      }
      if (isPropertySignature(childNode)) {
        this.properties.push(
          new CGPropertyNode(childNode, generics, this.module)
        );
      } else if (isMethodSignature(childNode)) {
        this.methods.push(new CGMethodNode(childNode, generics, this.module));
      }
    });
  }

  nameOfNode(): string {
    return CGUtils.instanceName(this.interfaceDeclaration.name);
  }

  codeOfGeneric(): string {
    if (
      this.interfaceDeclaration.typeParameters &&
      this.interfaceDeclaration.typeParameters.length
    ) {
      return `<${this.interfaceDeclaration.typeParameters
        .map((it) => CGUtils.tsTypeParameterToDart(it))
        .join(",")}>`;
    }
    return "";
  }

  code(): string {
    const className = this.nameOfNode();
    return `
class ${className}${this.codeOfGeneric()} {
    
    mpjs.JsObject? $$context$$;

    ${this.properties.map((it) => it.codeOfVars()).join("\n")}

    ${className}({this.$$context$$});

    ${
      this.properties.length > 0
        ? `
    void setValues({${this.properties
      .map((it) => it.codeOfPlainSetter())
      .join(",")}}) {
          ${this.properties.map((it) => it.codeOfPlainSetterBlock()).join("\n")}
    }
    `
        : ""
    }

    Map toJson() {
        return {
            ${this.properties.map((it) => it.codeOfToJSON()).join(",\n")}
        }..removeWhere((key, value) => value == null);
    }

    ${this.methods.map((it) => it.code()).join("\n\n")}
}
`;
  }
}
