"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../UI Models/create-server-model";
import InviteServerModal from "../UI Models/invite-server-model";
import ServerSettingsModal from "../UI Models/server-setting-model";
import ManageMemberModal from "../UI Models/manage-member-modal";
import CreateChanelModal from "../UI Models/create-chanel-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <CreateServerModal />
            <InviteServerModal />
            <ServerSettingsModal />
            <ManageMemberModal />
            <CreateChanelModal />
        </>
    );
};

export default ModalProvider;
