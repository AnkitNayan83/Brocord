import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
    const profile = await currentProfile();
    if (!profile) return null;

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            Channel: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            Member: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                },
            },
        },
    });
    if (!server) {
        return redirect("/");
    }
    const textChannels = server?.Channel.filter((channel) => channel.type === ChannelType.TEXT);

    const audioChannels = server?.Channel.filter((channel) => channel.type === ChannelType.AUDIO);

    const videoChannels = server?.Channel.filter((channel) => channel.type === ChannelType.VIDEO);

    const members = server?.Member.filter((memeber) => memeber.profileId !== profile.id);

    const role = server?.Member.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
            <ServerHeader server={server} role={role} />
        </div>
    );
};

export default ServerSidebar;
