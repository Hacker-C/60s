// TIP 修改此处的 env 变量，来切换开发环境和生产环境
export const env: Env = 'development';

/*
 本地开发用：development -> 允许 http://localhost:3333 请求
 远程部署：production -> 允许 https://60s.mphy.me 请求
 这取决于你的实际情况
*/
export const ALLOW_ORIGIN = env === 'development' ? 'http://localhost:3333' : 'https://60s.mphy.me';

export const headers = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': ALLOW_ORIGIN,
	'Access-Control-Allow-Methods': 'GET',
};

export type Env = 'development' | 'production';
