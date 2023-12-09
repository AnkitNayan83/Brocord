import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, Video } from "lucide-react";

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
};

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
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">{/* <ServerSearch /> */}</div>
            </ScrollArea>
        </div>
    );
};

export default ServerSidebar;
