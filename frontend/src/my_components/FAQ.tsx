import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
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
export const FAQCard = () => {
  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Edit FAQ</CardTitle>
        <CardDescription>Edit your FAQs</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export const FAQDialog = () => {
  const [question, setQuestion] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [answer, setAnswer] = useState("");
  return (
    <Dialog>
      <DialogTrigger>Add FAQ</DialogTrigger>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle className="text-xl">Add new FAQ</DialogTitle>
          <DialogDescription>Add new set of FAQs to the list</DialogDescription>
        </DialogHeader>
        <div>
          <Label className="font-semibold text-lg">Question</Label>
          <Textarea
            placeholder="Type your question here."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">Synonyms</Label>
          <Textarea
            placeholder="Separate the synoyms by comma (,) (e.g. 'Hello', 'Hi')"
            value={synonyms}
            onChange={(s) => setSynonyms(s)} // TODO: Implement this
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">Answer</Label>
          <Textarea
            placeholder="Type your synoyms of your questions here."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>
        <DialogFooter>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
