import { currentProfilePages } from "@/lib/current-profile-for-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handelr(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfilePages(req);
        if (!profile) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const { serverId, channelId } = req.query;
        const { content, fileUrl } = req.body;

        if (!serverId) {
            return res.status(404).json({ message: "server id not found" });
        }
        if (!channelId) {
            return res.status(404).json({ message: "channel id not found" });
        }
        if (!content) {
            return res.status(404).json({ message: "content not found" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                Member: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                Member: true,
            },
        });

        if (!server) return res.status(404).json({ message: "no server found with this user" });

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel) return res.status(404).json({ message: "no channel found" });

        const member = server.Member.find((member) => member.profileId === profile.id);

        if (!member) return res.status(404).json({ message: "no member found" });

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(201).json(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
