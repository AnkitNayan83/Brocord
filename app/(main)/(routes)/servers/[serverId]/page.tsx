interface paramsType {
    params: { serverId: string };
}

const ServerIDPage = ({ params }: paramsType) => {
    const id = params.serverId;
    return (
        <div>
            <h1>{id}</h1>
        </div>
    );
};

export default ServerIDPage;
