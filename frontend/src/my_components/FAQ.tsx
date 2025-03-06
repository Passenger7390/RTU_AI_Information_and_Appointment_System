import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { deleteFAQ, updateFAQ, addFAQ } from "@/api";
import DeleteDialog from "./DeleteDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// TODO: Implement delete functionality in the card

export interface FAQCardProps {
  idProp: number;
  questionProp: string;
  synonymsProp: string[];
  answerProp: string;
  onRefresh?: () => void;
}

export interface FAQ {
  id: number;
  question: string;
  synonyms: string[];
  answer: string;
}

export const FAQCard = ({
  idProp,
  questionProp,
  synonymsProp,
  answerProp,
  onRefresh,
}: FAQCardProps) => {
  // Combined state for current field values.
  const [values, setValues] = useState({
    question: "",
    synonyms: "",
    answer: "",
  });

  // State to store original values in case we cancel editing.
  const [savedValues, setSavedValues] = useState({
    question: "",
    synonyms: "",
    answer: "",
  });
  const [edit, setEdit] = useState(false);

  // Initialize state from props.
  useEffect(() => {
    const synonymsStr = synonymsProp.join(", ");
    setValues({
      question: questionProp,
      synonyms: synonymsStr,
      answer: answerProp,
    });
    setSavedValues({
      question: questionProp,
      synonyms: synonymsStr,
      answer: answerProp,
    });
  }, [questionProp, synonymsProp, answerProp]);

  // Compute synonyms array from comma-separated string.
  const synonymsList = useMemo(
    () =>
      values.synonyms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [values.synonyms]
  );

  const toggleEdit = useCallback(() => {
    if (edit) {
      // Cancel editing: restore saved values.
      setValues(savedValues);
    }
    setEdit((prev) => !prev);
  }, [edit, savedValues]);

  const handleSubmit = async () => {
    if (!values.question || !values.answer) {
      toast.error("Question and Answer are required");
      return;
    }
    const params = {
      id: idProp,
      question: values.question,
      synonyms: synonymsList,
      answer: values.answer,
    };

    try {
      await updateFAQ(params);
      toast.success("FAQ updated successfully");
      setSavedValues(values);
      setEdit(false);
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to update FAQ");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFAQ(idProp);
      onRefresh?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-[600px]">
      <CardContent className="space-y-2 flex-col items-center justify-center pt-6">
        <Label>Question</Label>
        <Textarea
          placeholder="Type your question here."
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={values.question}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, question: e.target.value }))
          }
          required
          disabled={!edit}
        />
        <Label>Synonyms</Label>
        <Textarea
          placeholder="Separate synonyms by comma (e.g. 'Hello, Hi')"
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={values.synonyms}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, synonyms: e.target.value }))
          }
          disabled={!edit}
        />
        <Label>Answer</Label>
        <Textarea
          placeholder="Type your answer here."
          maxLength={350}
          className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
          value={values.answer}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, answer: e.target.value }))
          }
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
        </div>
        <div className="w-72" />
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={toggleEdit}>
            <FaRegEdit className="size-6 m-1" />
          </Button>
          <DeleteDialog onConfirm={handleDelete} />
        </div>
      </CardFooter>
    </Card>
  );
};

interface FAQDialogProps {
  onRefresh?: () => void;
}

export const FAQDialog = ({ onRefresh }: FAQDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [values, setValues] = useState({
    question: "",
    synonyms: "",
    answer: "",
  });

  const resetForm = () => {
    setValues({ question: "", synonyms: "", answer: "" });
  };

  const handleSubmit = async () => {
    if (!values.question || !values.answer) {
      toast.error("Question and Answer are required");
      return;
    }
    const synonymsList = values.synonyms
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await addFAQ(values.question, synonymsList, values.answer);
      toast.success("FAQ added successfully");
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to add FAQ");
    }
    setIsDialogOpen(false);
    resetForm();
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
            value={values.question}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, question: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">Synonyms</Label>
          <Textarea
            placeholder="Separate synonyms by comma (e.g. 'Hello, Hi')"
            maxLength={350}
            className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
            value={values.synonyms}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, synonyms: e.target.value }))
            }
          />
        </div>
        <div>
          <Label className="font-semibold text-lg">
            Answer <span className="font-normal italic">(Required)</span>
          </Label>
          <Textarea
            placeholder="Type your answer here."
            maxLength={350}
            className="w-[29rem] max-h-36 overflow-x-hidden resize-none"
            value={values.answer}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, answer: e.target.value }))
            }
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
