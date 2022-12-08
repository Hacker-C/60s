import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

// 运行环境
type Env = 'development' | 'production'

/**
 * @param obj 响应数据
 * @param env CORS 的  Access-Control-Allow-Origin 字段，判断是本地开发还是远程部署，所允许的域名
 * @param status 响应状态码
 * @param message 响应说明
 * @returns Response
 */
const responseWithBaseRes = (
    obj: Record<number | string | symbol, unknown>
        | string | string[] | number | boolean | null | undefined,
    env: Env,
    status = 200,
    message = 'OK'
) => {
    let res = ''

    try {
        res = JSON.stringify({ status, message, data: obj ?? {} })
    } catch {
        res = JSON.stringify({ status: 500, message: 'Oops', data: {} })
    }

    const ALLOW_ORIGIN = env === 'development' ? 'http://localhost:3333' : 'https://60s-view.netlify.app'

    return new Response(res, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':  ALLOW_ORIGIN,
            'Access-Control-Allow-Methods': 'GET'
        },
    })
}

// deno-lint-ignore no-unused-vars
function Utf82Ascii(str: string) {
    return str.split("").map(e => `#&${e.charCodeAt(0)};`).join("")
}

function Ascii2Utf8(str: string) {
    return str.replace(/&#(\d+);/g, (_, $1) => String.fromCharCode(Number($1)))
}

const api = "https://www.zhihu.com/api/v4/columns/c_1261258401923026944/items?limit=1";
const oneHourMs = 60 * 60 * 1000
const cache: Record<number, string[]> = {}

async function handler(req: Request) {
    const url = new URL(req.url)
    const isText = url.searchParams.get('encoding') === 'text'

    const today = Math.floor((Date.now() + 8 * oneHourMs) / (24 * oneHourMs))

    if (!cache[today]) {
        const { data } = await (await fetch(api)).json()
        const contents = data[0].content.match(/<p\s+data-pid=[^<>]+>([^<>]+)<\/p>/g)
        cache[today] = contents.map((e: string) => Ascii2Utf8(e.replace(/<[^<>]+>/g, '')))
        cache[today].splice(1, 1)
    }

    if (isText) {
        return new Response(cache[today].join("\n"))
    } else {
        // 本地开发用：development -> 允许 http://localhost:3333 请求
        // 远程部署：production -> 允许 https://60s-view.netlify.app 请求
        return responseWithBaseRes(cache[today], 'development')
    }
}

serve(handler);
