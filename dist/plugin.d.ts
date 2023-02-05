import babel, { PluginObj } from '@babel/core';

type PluginPreset = "react";
type PluginType = {
    preset?: PluginPreset;
    styles?: {
        path?: string;
        config?: string;
    };
};
declare function export_default({ types: t }: typeof babel): PluginObj;

export { PluginPreset, PluginType, export_default as default };
