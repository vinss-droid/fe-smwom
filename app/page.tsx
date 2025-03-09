'use client'

import WorkOrderTable from "@/components/home/WorkOrderTable";
import withAuthComponent from "@/lib/withAuth";
import Head from "next/head";
import {Metadata} from "next";

const Home = ()=>  {
  return <>
    <WorkOrderTable/>
  </>
}

export default withAuthComponent(Home);
