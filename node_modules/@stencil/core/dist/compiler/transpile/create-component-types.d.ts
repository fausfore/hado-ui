import { CompilerCtx, ComponentMeta, ComponentRegistry, Config } from '../../declarations';
export interface ImportData {
    [key: string]: MemberNameData[];
}
export interface MemberNameData {
    localName: string;
    importName?: string;
}
/**
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
export declare function generateComponentTypesFile(config: Config, compilerCtx: CompilerCtx, cmpList: ComponentRegistry): Promise<string>;
/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmpMeta the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export declare function createTypesAsString(cmpMeta: ComponentMeta, importPath: string): string;
