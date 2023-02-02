/// <reference types="node" />
import { NextConfig } from "next";
export type FactoryConfig = {
    dirs: string[];
};
export declare function withFactory({ dirs }: FactoryConfig, nextConfig: NextConfig, _require?: NodeRequire): NextConfig;
//# sourceMappingURL=withFactory.d.ts.map