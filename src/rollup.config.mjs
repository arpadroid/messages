import { getBuild, isSlim } from '@arpadroid/module';
const { build = {} } =
    getBuild('messages', 'uiComponent', {
        external: isSlim() && ['lists'] || undefined
    }) || {};
export default build;
