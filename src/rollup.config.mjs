import { getBuild, isSlim } from '@arpadroid/module';
const external = (isSlim() && ['lists', 'forms']) || undefined;
const { build = {} } = getBuild('messages', { external });
export default build;
