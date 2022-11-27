import {
  isInterfaceDeclaration,
  isModuleBlock,
  isTypeAliasDeclaration,
  ModuleDeclaration,
} from "typescript";
import { CGInterfaceNode } from "./interface";
import { CGCodeNode } from "./node";
import { CGTypeAliasNode } from "./type_alias";

export class CGModuleNode extends CGCodeNode {
  public interfaceInstances: { [key: string]: CGInterfaceNode } = {};
  public codeNodes: CGCodeNode[] = [];

  constructor(readonly moduleDeclaration: ModuleDeclaration) {
    super();
    this.process();
  }

  private process() {
    const body = this.moduleDeclaration.body;
    const interfaceCache: { [key: string]: CGInterfaceNode } = {};
    if (body && isModuleBlock(body)) {
      body.forEachChild((childNode) => {
        if (isInterfaceDeclaration(childNode)) {
          const instance = new CGInterfaceNode(childNode, this);
          if (interfaceCache[instance.nameOfNode()]) {
            interfaceCache[instance.nameOfNode()].merge(instance);
          } else {
            interfaceCache[instance.nameOfNode()] = instance;
            this.codeNodes.push(instance);
          }
        } else if (isTypeAliasDeclaration(childNode)) {
          this.codeNodes.push(new CGTypeAliasNode(childNode));
        }
      });
    }
  }

  code() {
    return `
import 'dart:convert';
import 'package:mpcore/mpjs/mpjs.dart' as mpjs;

${this.codeNodes.map((it) => it.code()).join("\n\n")}
`;
  }
}
