import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
import {signOut, useSession} from "next-auth/react";

export default function MyNavbar() {
    const { data: session } = useSession();
    const user = session?.user;
    return (
        <Navbar isBordered isBlurred={false}>
            <NavbarBrand>
                <p className="font-bold text-inherit">Sistem Manajemen Work Order</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
            </NavbarContent>
            {user && (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button color="primary" variant="flat" onPress={() => signOut()}>
                            Logout
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            )}
        </Navbar>
    );
}
