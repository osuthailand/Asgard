import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params }: { params: { slugs: string[]; }; }) {
    const docUrl = params.slugs ? "/get/" + params.slugs.join(".") : "";
    const res = await fetch(`https://api.rina.place/api/docs${docUrl}`);
    const data = await res.json();

    if (data.error) {
        return <h1>{data.error}</h1>;
    }

    if (docUrl) {
        return <MDXRemote source={data.content} />;
    }


    return (
        <>
            {data.map(e => (
                <a href={`/docs/${e.url.replace(".", "/")}`}>{e.url}</a>
            ))}
        </>
    );
}