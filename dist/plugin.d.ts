import babel, { PluginObj } from '@babel/core';

type PluginPreset = "react" | "next";
type PluginType = {
    preset?: PluginPreset;
    styles?: {
        path?: string;
    };
};
declare function export_default({ types: t }: typeof babel): PluginObj;

export { PluginPreset, PluginType, export_default as default };
