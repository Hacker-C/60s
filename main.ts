import { serve } from 'https://deno.land/std@0.155.0/http/server.ts';
import { handle60s } from './apis/60s.ts';
import { EventType, handleEvents } from './apis/events.ts';
import { headers } from './config.ts'; 

// deno-lint-ignore require-await
async function handler(req: Request) {
	const url = new URL(req.url);
  const path = url.pathname;
	if (path === '/history') {
    return handleEvents(url.searchParams);
	}
  if (path === '/60s') {
    return handle60s(url);
  }
  return theResponse(null, 404, 'Not Found');
}

/**
 * 返回对象 Response 的封装
 */
export const theResponse = (
	data: EventType[] | string[] | null,
	status = 200,
	message = 'OK: ' + new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', timeStyle: 'long' }).format(),
) => {
	return new Response(JSON.stringify({ status, message, data }), {
		headers,
		status,
	});
};

/**
 * 启动服务
 */
serve(handler);
