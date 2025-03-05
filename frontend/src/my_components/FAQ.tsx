import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FaRegEdit } from "react-icons/fa";

// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addFAQ } from "@/api";
import DeleteDialog from "./DeleteDialog";

interface FAQCardProps {
  questionProp: string;
  synonymsProp: string[];
  answerProp: string;
}

export const FAQCard = ({
  questionProp,
  synonymsProp,
  answerProp,
}: FAQCardProps) => {
  const [questionS, setQuestion] = useState("");
  const [synonymsS, setSynonyms] = useState("");
  const [answerS, setAnswer] = useState("");

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setQuestion(questionProp);
    setSynonyms(synonymsProp.join(", "));
    setAnswer(answerProp);
  }, [questionProp, synonymsProp, answerProp]);

  const handleCancel = () => {
    setEdit(!edit);
    setQuestion(questionProp);
    setSynonyms(synonymsProp.join(", "));
    setAnswer(answerProp);
  };

  const handleSubmit = () => {
    if (!questionS || !answerS)
      return toast.error("Question and Answer are required");
    const synonymsList = synonymsS.split(",").map((s) => s.trim());

    try {
      addFAQ(questionS, synonymsList, answerS);
      toast.success("FAQ added successfully");
    } catch (error) {
      toast.error("Failed to add FAQ");
    }
    setEdit(false);
    // TODO: Create new endpoint for edit updating the faq
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>{questionS}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 flex-col items-center justify-center">
        <Textarea
          placeholder="Type your question here."
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={questionS}
          onChange={(e) => setQuestion(e.target.value)}
          required
          disabled={!edit}
        />
        <Textarea
          placeholder="Separate the synoyms by comma (,) (e.g. 'Hello', 'Hi')"
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={synonymsS}
          onChange={(s) => setSynonyms(s.target.value)}
          disabled={!edit}
        />
        <Textarea
          placeholder="Type your synoyms of your questions here."
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={answerS}
          onChange={(e) => setAnswer(e.target.value)}
          required
          disabled={!edit}
        />
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <div className="flex space-x-2">
          {edit && (
            <Button className="flex-1" onClick={handleSubmit}>
              Save
            </Button>
          )}
          {edit && (
            <Button className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
        <div className="w-72"></div>
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={handleCancel}>
            <FaRegEdit className="size-6 m-1" />
          </Button>
          <DeleteDialog />
        </div>
      </CardFooter>
    </Card>
  );
};

export const FAQDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!question || !answer)
      return toast.error("Question and Answer are required");
    const synonymsList = synonyms.split(",").map((s) => s.trim());

    try {
      addFAQ(question, synonymsList, answer);
      toast.success("FAQ added successfully");
    } catch (error) {
      toast.error("Failed to add FAQ");
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setQuestion("");
    setSynonyms("");
    setAnswer("");
  };
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) resetForm();
        setIsDialogOpen(open);
      }}
    >
      <DialogTrigger>Add FAQ</DialogTrigger>
      <DialogContent className="space-y-2 w-full">
        <DialogHeader>
          <DialogTitle className="text-xl">Add new FAQ</DialogTitle>
          <DialogDescription>Add new set of FAQs to the list</DialogDescription>
        </DialogHeader>
        <div>
          <Label className="font-semibold text-lg">
            Question <span className="font-normal italic">(Required)</span>
          </Label>
          <Textarea
            placeholder="Type your question here."
            maxLength={350}
            className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">Synonyms</Label>
          <Textarea
            placeholder="Separate the synoyms by comma (,) (e.g. 'Hello', 'Hi')"
            maxLength={350}
            className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
            value={synonyms}
            onChange={(s) => setSynonyms(s.target.value)} // TODO: Implement this
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">
            Answer <span className="font-normal italic">(Required)</span>
          </Label>
          <Textarea
            placeholder="Type your synoyms of your questions here."
            maxLength={350}
            className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
