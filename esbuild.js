import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

[
  {
    outdir: 'dist/esm',
    format: 'esm',
    outExtension: {
      '.js': '.mjs',
    },
  },
  {
    outdir: 'dist/cjs',
    format: 'cjs',
    outExtension: {
      '.js': '.cjs',
    },
  },
].map((opts) => build({
  entryPoints: [
    'src/index.ts',
    'src/react/index.ts'
  ],
  bundle: true,
  platform: 'browser',
  sourcemap: 'both',
  plugins: [
    nodeExternalsPlugin({
      peerDependencies: 'true',
    }),
    {
      name: 'tyrann-io',
      setup(build) {
        let start;
        build.onStart(() => {
          start = Date.now();
        });

        build.onEnd(() => {
          console.log(`esbuild - built successfully to ${opts.outdir} in ${Date.now() - start}ms`);
        });
      },
    }
  ],
  watch: process.argv.includes('--watch'),
  ...opts,
}));
