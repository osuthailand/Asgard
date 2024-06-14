export default async function UserPage({ params }: { params: { userID: number; }; }) {
    const resp = await fetch(`https://api.rina.place/api/v1/users/get/${params.userID}`);
    const data = await resp.json();

    if (data?.error) {
        return <h1>{data.error}</h1>;
    }

    return <h1>{data?.username}</h1>;
}