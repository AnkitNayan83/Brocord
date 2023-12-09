"use client";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member";
        data:
            | {
                  icon: React.ReactNode;
                  name: string;
                  id: string;
              }[]
            | undefined;
    }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    return (
        <div>
            <h1>ss</h1>
        </div>
    );
};

export default ServerSearch;
