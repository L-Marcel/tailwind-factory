import babel, { PluginObj } from '@babel/core';

declare function export_default({ types: t }: typeof babel): PluginObj;

export { export_default as default };
