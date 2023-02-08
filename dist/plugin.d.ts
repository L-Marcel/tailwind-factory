import babel, { PluginObj } from '@babel/core';
import { Config } from 'tailwindcss';

type LogsMode = "none" | "all" | "normal" | "debug" | "errors";

type PluginPreset = "react";
type PluginType = {
    preset?: PluginPreset;
    logs?: LogsMode;
    styles?: {
        outputPath?: string;
        inputPath?: string;
        config?: Promise<Config | undefined>;
    };
};
declare function export_default({ types: t }: typeof babel): PluginObj;

export { PluginPreset, PluginType, export_default as default };
