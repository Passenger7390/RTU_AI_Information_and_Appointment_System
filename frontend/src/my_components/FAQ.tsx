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

// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addFAQ, getFAQs } from "@/api";
import DeleteDialog from "./DeleteDialog";

interface FAQCardProps {
  question: string;
  synonyms: string[];
  answer: string;
}
// const [question, setQuestion] = useState("");
// const [synonyms, setSynonyms] = useState("");
// const [answer, setAnswer] = useState("");

export const FAQCard = ({ question, synonyms, answer }: FAQCardProps) => {
  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your question here."
          maxLength={350}
          className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
          value={question}
          // onChange={(e) => setQuestion(e.target.value)}
          required
          disabled
        />
        <Textarea
          placeholder="Separate the synoyms by comma (,) (e.g. 'Hello', 'Hi')"
          maxLength={350}
          className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
          value={synonyms}
          // onChange={(s) => setSynonyms(s.target.value)} // TODO: Implement this
          disabled
        />
        <Textarea
          placeholder="Type your synoyms of your questions here."
          maxLength={350}
          className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
          value={answer}
          // onChange={(e) => setAnswer(e.target.value)}
          required
          disabled
        />
      </CardContent>
      <CardFooter>
        <DeleteDialog />
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
