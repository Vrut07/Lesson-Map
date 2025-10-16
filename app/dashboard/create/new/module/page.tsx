import ModuleList from "@/components/outline/ModuleList";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateModulePage = () => {
  return (
    <section className="max-w-4xl md:px-10 px-5 py-20">
      <div className="flex flex-col md:flex-row justify-left items-center  gap-3">
        <h1 className="md:text-2xl text-lg font-bold ">Create Your Module For :</h1>    
        <Select>
          <SelectTrigger >
            <SelectValue placeholder="Select Course For This Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="devops">Devops</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="my-9">

        <ModuleList/>

      </div>
    </section>
  );
};

export default CreateModulePage;
