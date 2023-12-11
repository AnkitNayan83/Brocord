interface paramsType {
    params: { memberId: string };
}

const MemberPage = ({ params }: paramsType) => {
    const id = params.memberId;
    return (
        <div>
            <h1>member conversation</h1>
            <h1>{id}</h1>
        </div>
    );
};

export default MemberPage;
