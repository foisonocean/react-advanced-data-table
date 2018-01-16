import { join } from 'path';

import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import closure from 'rollup-plugin-closure-compiler-js';
import postcss from 'rollup-plugin-postcss';
import stylus from 'stylus';

import packageInfo from './package.json';

const globalScopeName = 'ReactAdvancedDataTable';
const globalsInBrowser = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  'react-beautiful-dnd': 'ReactBeautifulDnd',
};
const dependenciesInModulesBuild = [
  ...Object.keys(globalsInBrowser),
  'lodash-es',
];

const stylusPreProcessor = (content, id) => new Promise((resolve, reject) => {
  const renderer = stylus(
    content,
    {
      filename: id,
      sourcemap: { inline: true },
      paths: [ join(__dirname, './src') ],
    },
  );
  renderer.render((err, code) => {
    if (err) {
      reject(err);
    } else {
      resolve({
        code,
        map: renderer.sourcemap,
      });
    }
  });
});

const getBaseConfig = ({
  production = true,
  buildForBrowser = false,
  generateTypesDeclarationInRoot = false,
  generateTypesDeclarationInBuildFolder = false,
  extractCSS = true,
  extractCSSInRoot = true,
}) => ({
  input: 'src/index.ts',
  external: buildForBrowser ?
    Object.keys(globalsInBrowser) :
    dependenciesInModulesBuild,
  plugins: [
    replace({
      'clsprefix': packageInfo.name,
    }),
    nodeResolve({
      jsnext: true,
      modulesOnly: true,
    }),
    postcss({
      preprocessor: stylusPreProcessor,
      extensions: ['.styl'],
      extract: extractCSS ? (extractCSSInRoot ? join(__dirname, './styles.css') : true) : false,
    }),
    typescript({
      cacheRoot: '.typescript-compile-cache',
      clean: production ? true : false,
      useTsconfigDeclarationDir: generateTypesDeclarationInRoot,
      tsconfigOverride: {
        /**
         * use rollup plugin to override type declaration generate policy,
         * because of the limitation of the rollup,
         * we must the generate type declarations only once
         * (only in the commonjs build, not all builds)
         */
        compilerOptions: Object.assign(
          {},
          (generateTypesDeclarationInRoot && !generateTypesDeclarationInBuildFolder) ?
            {
              declaration: true,
              declarationDir: './types',
            } :
            {
              declaration: false,
            },
          (!generateTypesDeclarationInRoot && generateTypesDeclarationInBuildFolder) ?
            {
              declaration: true,
            } :
            {
              declaration: false,
            },
        ),
        /**
         * only exclude test code in rollup config,
         * rather than exclude them in tsconfig.json,
         * because when run tests,
         * they still need the compiler info in tsconfig.json
         */
        exclude: [
          'node_modules',
          'src/__test__/**',
        ],
      },
    }),
  ],
});

const devConfig = getBaseConfig({
  production: false,
  generateTypesDeclarationInBuildFolder: true,
  extractCSSInRoot: false,
});
devConfig.output = {
  file: 'examples/src/lib/index.js',
  format: 'es',
  sourcemap: 'inline',
};

const commonjsConfig = getBaseConfig({
  generateTypesDeclaration: true,
});
commonjsConfig.output = {
  file: packageInfo.main,
  format: 'cjs',
};

const esConfig = getBaseConfig({});
esConfig.output = {
  file: packageInfo.module,
  format: 'es',
};

const fullBrowserConfig = getBaseConfig({});
fullBrowserConfig.output = {
  file: `${packageInfo['non-module']}.js`,
  format: 'iife',
  name: globalScopeName,
  globals: globalsInBrowser,
};
fullBrowserConfig.plugins.push(replace({
  'process.env.NODE_ENV': JSON.stringify('development'),
}));

const minBrowserConfig = getBaseConfig({});
minBrowserConfig.output = {
  file: `${packageInfo['non-module']}.min.js`,
  format: 'iife',
  name: globalScopeName,
  globals: globalsInBrowser,
};
minBrowserConfig.plugins.push(
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  closure({
    compilationLevel: 'SIMPLE',
    languageIn: 'ECMASCRIPT5_STRICT',
    languageOut: 'ECMASCRIPT5_STRICT',
    rewritePolyfills: false,
  }),
);

const config = process.env.NODE_ENV === 'production' ? [commonjsConfig, esConfig, fullBrowserConfig, minBrowserConfig] : devConfig;

export default config;
