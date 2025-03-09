'use client'

import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Form, Input, Button} from "@heroui/react";
import {FormProps} from "next/form";

export default function Login() {

    const onSubmit = (e: any) => {
        e.preventDefault();
    };

    return (
        <div className="w-6/12 mx-auto my-14">
            <Card className="w-full">
                <CardHeader>
                    <h3 className="text-2xl font-bold uppercase">
                        Login to SMWOM
                    </h3>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Form className="w-full px-2" validationBehavior="aria" onSubmit={onSubmit}>
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

                        <Button type="submit" variant="solid" className="mt-5 w-full">
                            Submit
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
