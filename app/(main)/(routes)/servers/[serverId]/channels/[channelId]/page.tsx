import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-message";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface paramsType {
    params: { channelId: string; serverId: string };
}

const ChannelPage = async ({ params }: paramsType) => {
    const id = params.channelId;
    const profile = await currentProfile();

    if (!profile) return redirectToSignIn();

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
    });

    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader name={channel.name} serverId={params.serverId} type="channel" />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        type="channel"
                        chatId={channel.id}
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        type="channel"
                        name={channel.name}
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} video={false} audio={true} profile={profile} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} video={true} audio={true} profile={profile} />
            )}
        </div>
    );
};

export default ChannelPage;
