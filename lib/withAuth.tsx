'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

const withAuthComponent = <P extends object>(Component: React.ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const router = useRouter();
        const { data: session, status } = useSession();
        const user = session?.user;
        const role = user?.role;
        const pathname = usePathname();

        useEffect(() => {
            if (status === "loading") return;

            if (!session) {
                router.push("/auth/login");
            } else {
                router.push('/')
            }

        }, [session, status, role, router, pathname]);

        if (status === "loading") {
            return <div>Loading...</div>;
        }

        if (!session || !role) {
            return null;
        }

        return <Component {...props} />;
    };

    return WithAuthComponent;
};

export default withAuthComponent;