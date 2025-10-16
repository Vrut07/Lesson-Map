import LesssonList from "@/components/outline/LessonList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateLessonPage = () => {
  return (
    <section className="max-w-4xl md:px-10 px-5 py-20">
      <div className="flex flex-col md:flex-row justify-left items-center  gap-3">
        <h1 className="md:text-2xl text-lg font-bold ">
          Create Your Lesson For :
        </h1>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Module For This Lesson" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="introduction-to-devops">
              Introduction To Devops
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="my-9">
        <LesssonList />
      </div>
    </section>
  );
};

export default CreateLessonPage;
