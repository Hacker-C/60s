import { theResponse } from "../main.ts";

const api = (offset: number) =>
	`https://www.zhihu.com/api/v4/columns/c_1261258401923026944/items?limit=1&offset=${offset}`;
const oneHourMs = 60 * 60 * 1000;
const cache: Record<number, string[]> = {};

function Ascii2Utf8(str: string) {
	return str.replace(/&#(\d+);/g, (_, $1) => String.fromCharCode(Number($1)));
}

export async function handle60s(url: URL) {
  const path = url.pathname;
	const isText = url.searchParams.get('encoding') === 'text';
	const today = Math.floor((Date.now() + 8 * oneHourMs) / (24 * oneHourMs));

	if (!cache[today]) {
		let offset = 0;
		let content = null;
		for (;;) {
			const { data } = await (await fetch(api(offset))).json();
			const res = data?.[0]?.content;
			// BUGFIX: 若数据为空（专栏还未编写今日新闻），则往前一天请求，直到成功或尝试 10 次为止
			if (res || offset > 10) {
				content = res;
				break;
			}
			offset++;
		}
		const contents = content.match(
			/<p\s+data-pid=[^<>]+>([^<>]+)<\/p>/g,
		);
		cache[today] = contents.map((e: string) => Ascii2Utf8(e.replace(/<[^<>]+>/g, '')));
		cache[today].splice(1, 1);
	}

	if (isText) {
		return new Response(cache[today].join('\n'));
	} else {
		return theResponse(cache[today]);
	}
}