import { getBuild, isSlim } from '@arpadroid/module';
const external = (isSlim() && ['lists']) || undefined;
const { build = {} } = getBuild('messages', { external });
export default build;
