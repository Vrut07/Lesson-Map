import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CoursePage = () => {
  return (
    <section className="max-w-4xl md:px-10 px-5 py-20">
        <h1 className="text-2xl font-bold my-5 ">Create Your Course</h1>
      <FieldSet>
        
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Enter Your Course Title" />
          </Field>
          <Field>
            <FieldLabel htmlFor="desc">Description</FieldLabel>  
            <Textarea autoComplete="off" placeholder="Enter Your Course Description" />
          </Field>
          <Button>
            Create Course
          </Button>
        </FieldGroup>
      </FieldSet>
    </section>
  );
};

export default CoursePage;
