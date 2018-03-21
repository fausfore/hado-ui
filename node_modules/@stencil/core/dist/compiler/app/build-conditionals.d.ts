import { BuildConditionals, CompilerCtx, ComponentMeta, Config, EntryModule } from '../../declarations';
export declare function setBuildConditionals(config: Config, ctx: CompilerCtx, entryModules: EntryModule[]): Promise<BuildConditionals>;
export declare function setBuildFromComponentMeta(coreBuild: BuildConditionals, cmpMeta: ComponentMeta): void;
export declare function setBuildFromComponentContent(coreBuild: BuildConditionals, jsText: string): void;
