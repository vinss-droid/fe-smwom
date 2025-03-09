'use client'

import React, {FormEvent} from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Form, Input, Button} from "@heroui/react";
import {FormProps} from "next/form";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import withAuthComponent from "@/lib/withAuth";
import {Metadata} from "next";

const Login = ()=> {

    const [isLoading, setIsLoading] = React.useState(false);
    const [showPass, setShowPass] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const form = event.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        // Reset error message before new login attempt
        setErrorMessage("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            setIsLoading(false);

            if (result?.error) {
                setErrorMessage('Email atau password salah!');
            } else {
                router.push("/");
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };

    React.useEffect(() => {
        if (user?.token) {
            router.push('/')
        }
    }, [user?.token]);

    return (
        <div className="w-6/12 mx-auto my-14">
            <Card className="w-full">
                <CardBody>
                    <h3 className="text-2xl font-bold text-center uppercase my-8">
                        Login to SMWOM
                    </h3>
                    {errorMessage && (
                        <div className="text-red-500 mb-4">{errorMessage}</div>
                    )}
                    <Form className="w-full px-2" validationBehavior="aria" onSubmit={handleSubmit}>
                        <Input
                            isRequired
                            label="Email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                        />

                        <Input
                            isRequired
                            label="Password"
                            labelPlacement="outside"
                            name="password"
                            placeholder="Enter your email"
                            type="password"
                        />

                        <Button isLoading={isLoading} type="submit" color="primary" variant="solid" className="mt-5 w-full">
                            Submit
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

export default Login;
