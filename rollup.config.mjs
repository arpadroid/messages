import { getBuild, isSlim } from '@arpadroid/module/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('messages', 'uiComponent', {
    external: isSlim() && ['lists'],
});
export default build;
