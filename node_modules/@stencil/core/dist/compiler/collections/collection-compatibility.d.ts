import { Collection, Config } from '../../declarations';
export declare function validateCollectinCompatibility(config: Config, collection: Collection): number[];
export declare function calculateRequiredUpgrades(config: Config, collectionVersion: string): CompilerUpgrade[];
export declare const enum CompilerUpgrade {
    JSX_Upgrade_From_0_0_5 = 0,
    Metadata_Upgrade_From_0_1_0 = 1,
    Remove_Stencil_Imports = 2,
    Add_Component_Dependencies = 3,
}
