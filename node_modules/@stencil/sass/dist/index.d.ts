import * as d from './declarations';
export default function sass(opts?: d.PluginOptions): {
    transform: (sourceText: string, fileName: string, context: d.PluginCtx) => Promise<d.PluginTransformResults>;
    name: string;
};
