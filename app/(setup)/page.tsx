import InitialModel from "@/components/UI Models/initial-model";
import { db } from "@/lib/db";
import { initailProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    const profile = await initailProfile();
    const server = await db.server.findFirst({
        where: {
            Member: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });
    if (server) {
        return redirect(`servers/${server.id}`);
    }
    return <InitialModel />;
};

export default SetupPage;
