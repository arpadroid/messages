import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('messages', 'uiComponent');
export default build;
