import { getBuild, isSlim } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('messages', 'uiComponent', {
    external: isSlim() && ['forms', 'lists'],
});
export default build;
