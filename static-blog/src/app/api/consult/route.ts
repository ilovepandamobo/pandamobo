import { parseContact } from "@/lib/consult";
import { isContentPreview } from "@/lib/content/get-public-home";

const MAX_BODY_BYTES = 12_000;

export async function POST(request: Request) {
  const type = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  const fetchSite = request.headers.get("sec-fetch-site");
  if (type !== "application/json" || (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none")) {
    return Response.json({ message: "无法提交此请求。" }, { status: 415 });
  }

  const payload = await readPayload(request);
  const submission = parseContact(payload);
  if (!submission || Object.keys(submission.errors).length) {
    return Response.json({ message: "请检查联系方式和隐私确认。" }, { status: 400 });
  }

  if (isContentPreview()) {
    return Response.json({ message: "当前为开发预览，信息尚未发送。" }, { status: 503 });
  }

  const endpoint = process.env.CONSULT_WEBHOOK_URL;
  const token = process.env.CONSULT_WEBHOOK_TOKEN;
  if (!endpoint) return Response.json({ message: "咨询入口暂未开放，请稍后再试。" }, { status: 503 });

  try {
    const url = new URL(endpoint);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
      return Response.json({ message: "咨询入口暂未开放，请稍后再试。" }, { status: 503 });
    }
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(submission.data),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return Response.json({ message: "已收到你的咨询，我们会按你留下的方式联系你。" });
  } catch {
    // Do not expose webhook details or log personal information.
  }
  return Response.json({ message: "暂时无法发送，请稍后重试。" }, { status: 502 });
}

async function readPayload(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES || !request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return JSON.parse(body + decoder.decode());
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}
