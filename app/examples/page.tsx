import React from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, PlusIcon, Trash2 } from "lucide-react"
import Navbar from "@/components/Nav/Navbar"
import { exampleCourses } from "@/constants"

const ExamplePage = () => {
  return (
    <>
      <Navbar />
      <section className="container mx-auto py-20">
        <div className="flex my-10 flex-col md:flex-row justify-between md:px-10 px-4">
          <div className="flex items-start flex-col">
            <h1 className="text-4xl font-bold mb-3">Example Templates</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Browse ready-to-use course outlines. Use these templates to quickly
              create your own course and customize it for your audience.
            </p>
          </div>
          <Button className="text-base">
            <PlusIcon className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </div>
        <div className="container grid grid-cols-1 md:grid-cols-2 mx-auto gap-6 md:px-10 px-4">
          {exampleCourses.map((course) => (
            <Card
              key={course.id}
              className="w-full border hover:shadow-md transition hover:scale-[1.01] relative"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{course.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardDescription className="px-6 text-sm text-muted-foreground">
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {course.outline?.slice(0, 4).map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                  {course.outline && course.outline.length > 4 && (
                    <li className="italic text-muted-foreground">and more...</li>
                  )}
                </ul>
              </CardDescription>
              <CardFooter className="mt-5 px-6 pb-5 flex justify-between items-center">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button className="bg-primary hover:opacity-90">
                  Get Started with This
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}

export default ExamplePage
