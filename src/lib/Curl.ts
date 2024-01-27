export async function getJson<T>(url: string): Promise<T> {
    return JSON.parse(await (await fetch(url)).text());
}

export async function getSource<T = any>(url: string): Promise<T> {
    return await ((await fetch(url)).text()) as T;
}