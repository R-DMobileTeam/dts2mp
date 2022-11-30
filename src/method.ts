import {
  isOptionalTypeNode,
  MethodDeclaration,
  MethodSignature,
} from "typescript";
import { CGModuleNode } from "./module";
import { CGCodeNode } from "./node";
import { CGParameterNode } from "./param";
import { CGUtils } from "./utils";

export class CGMethodNode extends CGCodeNode {
  parameters: CGParameterNode[] = [];

  constructor(
    readonly methodSignature: MethodSignature | MethodDeclaration,
    readonly genericTypes: string[],
    readonly module: CGModuleNode
  ) {
    super();
    this.process();
  }

  private process() {
    this.methodSignature.parameters.forEach((it) => {
      this.parameters.push(
        new CGParameterNode(it, this.genericTypes, this.module)
      );
    });
  }

  codeOfGeneric(): string {
    if (
      this.methodSignature.typeParameters &&
      this.methodSignature.typeParameters.length
    ) {
      return `<${this.methodSignature.typeParameters
        .map((it) => CGUtils.tsTypeParameterToDart(it))
        .join(",")}>`;
    }
    return "";
  }

  nameOfNode(): string {
    return CGUtils.instanceName(this.methodSignature.name);
  }

  isOptionalReturnType(): boolean {
    if (
      this.genericTypes.indexOf(
        CGUtils.tsToDartType(this.methodSignature.type)
      ) >= 0
    ) {
      return true;
    }
    if (this.methodSignature.questionToken) {
      return true;
    }
    return (
      (this.methodSignature.type &&
        isOptionalTypeNode(this.methodSignature.type)) ??
      false
    );
  }

  codeOfReturnValue(): string {
    let gType = CGUtils.tsToDartType(this.returnType());
    if (gType.startsWith("Promise<")) {
      gType = gType.substring(8, gType.length - 1);
    }
    return `Future<${gType}${this.isOptionalReturnType() ? "?" : ""}>`;
  }

  returnType() {
    return this.methodSignature.type;
  }

  isClassType(): boolean {
    return (
      this.module.interfaceInstances[
        CGUtils.tsToDartType(this.returnType())
      ] !== undefined
    );
  }

  code(): string {
    return `
        ${this.codeOfReturnValue()} ${this.nameOfNode()}${this.codeOfGeneric()}(${this.parameters
      .map((it) => it.code())
      .join(",")}) async {
          final result = await $$context$$?.callMethod('${this.nameOfNode()}', [${this.parameters
      .map((it) => it.codeOfCallArgs())
      .join(",")}]);
          ${
            this.isClassType()
              ? `
          return ${CGUtils.tsToDartType(
            this.returnType()
          )}($$context$$: result);
          `
              : `return result;`
          }
        }
        `;
  }
}
