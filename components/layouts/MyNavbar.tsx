import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";

export default function MyNavbar() {
    return (
        <Navbar isBordered isBlurred={false}>
            <NavbarBrand>
                <p className="font-bold text-inherit">Sistem Manajemen Work Order</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
