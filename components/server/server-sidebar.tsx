import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { Crown, Hash, Mic, ShieldCheck, Video } from "lucide-react";
import ServerSearch from "./server-search";
import { channel } from "diagnostics_channel";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <Crown className="mr-2 h-4 w-4 text-yellow-500" />,
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
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                            server={server}
                        />

                        {textChannels?.map((channel) => (
                            <ServerChannel
                                server={server}
                                key={channel.id}
                                role={role}
                                channel={channel}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default ServerSidebar;
