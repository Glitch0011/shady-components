import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'shady.js',
    output: {
        file: './dist/shady.js',
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        commonjs()
    ]
};