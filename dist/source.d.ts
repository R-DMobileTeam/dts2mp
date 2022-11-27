import { CGModuleNode } from "./module";
export declare class CGSource {
    readonly dtsContent: string;
    private sourceFile;
    modules: {
        [key: string]: CGModuleNode;
    };
    constructor(dtsContent: string);
    private process;
}
