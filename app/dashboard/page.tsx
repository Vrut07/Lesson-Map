import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Menu, PlusIcon, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDotsVertical } from "react-icons/tb";
import Link from "next/link";

const DashboardPage = () => {
  const courses = [
    {
      id: 1,
      title: "Fullstack Developer Course",
      description:
        "A comprehensive course covering frontend and backend development with React, Node.js, Express, and MongoDB.",
      outline: [
        "Introduction to Web Development",
        "Frontend with React",
        "Backend with Node.js & Express",
        "Database with MongoDB",
        "Final Project",
      ],
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      description:
        "Learn design fundamentals, wireframing, prototyping, and UI systems with Figma.",
      outline: [
        "Design Basics",
        "Color Theory & Typography",
        "Wireframing",
        "Prototyping in Figma",
        "Portfolio Project",
      ],
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      description:
        "Master DSA concepts with hands-on coding problems in JavaScript.",
      outline: [
        "Arrays & Strings",
        "Linked Lists",
        "Stacks & Queues",
        "Trees & Graphs",
        "Dynamic Programming",
      ],
    },
    {
      id: 4,
      title: "Digital Marketing 101",
      description:
        "An introductory course on SEO, SEM, content marketing, and social media strategies.",
    },
  ];

  return (
    <>
      <section className="container mx-auto py-20">
        <div className=" flex my-10 flex-col md:flex-row justify-between md:px-10 px-4">
          <div className="flex items-start flex-col">
            <h1 className="text-4xl font-bold mb-3">Dashboard</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Manage and explore your created course outlines.
            </p>
          </div>
          <Button className="text-base" asChild>
            <Link href={"/dashboard/create/new/course"}>
              <PlusIcon /> Create New Outline
            </Link>
          </Button>
        </div>
        <div className="container grid grid-cols-1 md:grid-cols-2 mx-auto gap-5 md:px-10 px-4">
          {courses.map((course) => (
            <Card key={course.id} className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl ">{course.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {course.description}
                </CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"}>
                        <TbDotsVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash2 /> View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
