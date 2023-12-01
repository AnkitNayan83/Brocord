"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../UI Models/create-server-model";
import InviteServerModal from "../UI Models/invite-server-model";

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
        </>
    );
};

export default ModalProvider;
