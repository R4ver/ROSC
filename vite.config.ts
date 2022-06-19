import react from "@vitejs/plugin-react";
import { UserConfig, ConfigEnv } from "vite";
import { join } from "path";

import { defineConfig } from "vite";



const srcRoot = join( __dirname, "src" );

// `options` are passed to `@mdx-js/mdx`
const options = {
    // See https://mdxjs.com/advanced/plugins
    remarkPlugins: [
    // E.g. `remark-frontmatter`
    ],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react"
};

export default defineConfig( async ( { command }: ConfigEnv ): Promise<UserConfig> => {
    const mdx = await import( "@mdx-js/rollup" );
    // DEV
    if ( command === "serve" ) {
        return {
            root: srcRoot,
            base: "/",
            plugins: [react(), mdx.default( options )],
            resolve: {
                alias: {
                    "/@": srcRoot
                }
            },
            build: {
                outDir: join( srcRoot, "/out" ),
                emptyOutDir: true,
                rollupOptions: {}
            },
            server: {
                port: process.env.PORT === undefined ? 3000 : +process.env.PORT
            },
            optimizeDeps: {
                exclude: ["path"],
                include: ["react/jsx-runtime"]
            }
        };
    }
    // PROD
    return {
        root: srcRoot,
        base: "./",
        plugins: [react(), mdx.default( options )],
        resolve: {
            alias: {
                "/@": srcRoot
            }
        },
        build: {
            outDir: join( srcRoot, "/out" ),
            emptyOutDir: true,
            rollupOptions: {}
        },
        server: {
            port: process.env.PORT === undefined ? 3000 : +process.env.PORT
        },
        optimizeDeps: {
            exclude: ["path"],
            include: ["react/jsx-runtime"],
        }
    };
} );
