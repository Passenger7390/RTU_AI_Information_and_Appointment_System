import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  deleteFAQ,
  updateFAQ,
  addFAQ,
  starFAQ,
  getUserFAQs,
  deleteUserFAQ,
} from "@/api";
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
import { IoAddSharp } from "react-icons/io5";
import { FAQCardProps, FAQDialogProps, UserFAQType } from "@/interface";
import { IoStarOutline, IoStar } from "react-icons/io5";
import CopyButton from "./CopyButton";

export const FAQCard = ({
  idProp,
  questionProp,
  synonymsProp,
  answerProp,
  isPinnedProp,
  onRefresh,
}: FAQCardProps) => {
  // Combined state for current field values.
  const [values, setValues] = useState({
    question: "",
    synonyms: "",
    answer: "",
    isPinned: "",
  });

  // State to store original values in case we cancel editing.
  const [savedValues, setSavedValues] = useState({
    question: "",
    synonyms: "",
    answer: "",
    isPinned: "",
  });
  const [edit, setEdit] = useState(false);

  // Initialize state from props.
  useEffect(() => {
    const synonymsStr = synonymsProp.join(", ");
    setValues({
      question: questionProp,
      synonyms: synonymsStr,
      answer: answerProp,
      isPinned: isPinnedProp,
    });
    setSavedValues({
      question: questionProp,
      synonyms: synonymsStr,
      answer: answerProp,
      isPinned: isPinnedProp,
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
      isPinned: values.isPinned,
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

  async function pinFAQ() {
    const params = {
      id: idProp,
    };
    try {
      await starFAQ(params);
      onRefresh?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="w-[600px]">
      <CardContent className="space-y-2 flex-col justify-end pt-6">
        <div className="flex items-center justify-end w-full">
          <Button
            variant={"ghost"}
            className="hover:bg-transparent hover:opacity-100"
            onClick={pinFAQ}
          >
            {isPinnedProp ? (
              <IoStar className="text-yellow-300" />
            ) : (
              <IoStarOutline className="text-yellow-300" />
            )}
          </Button>
        </div>
        <div>
          <Label>Question</Label>
          <Textarea
            placeholder="Type your question here."
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
            className="w-[34rem] max-h-36 overflow-x-hidden resize-none"
            value={values.answer}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, answer: e.target.value }))
            }
            required
            disabled={!edit}
          />
        </div>
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
      <DialogTrigger>
        <Button className="h-10 w-[fit-content] flex justify-center">
          <IoAddSharp />
          Add new FAQ
        </Button>
      </DialogTrigger>
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
//  <CopyButton text="TEST" className="h-10" />
export function UserFAQ() {
  const [userFAQs, setUserFAQs] = useState([]);

  async function fetchUserFAQs() {
    try {
      const res = await getUserFAQs();
      setUserFAQs(res);
    } catch (error) {
      console.error("Failed to fetch user FAQs:", error);
      toast.error("Failed to fetch user FAQs");
    }
  }

  async function handleDelete(id: number) {
    const params = {
      id: id,
    };
    try {
      await deleteUserFAQ(params);
    } catch (error) {
      console.error(error);
    } finally {
      fetchUserFAQs();
    }
  }

  useEffect(() => {
    fetchUserFAQs();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 w-[fit-content] flex justify-center">
          User Input FAQ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User questions input in kiosk</DialogTitle>
          <DialogDescription>
            This are the question that doesn't match any FAQ in the system.
          </DialogDescription>
        </DialogHeader>
        <div>
          {userFAQs.map((faq: UserFAQType) => (
            <div
              className="flex border py-4 mb-2 items-center rounded-2xl"
              key={faq.id}
            >
              <Label className="flex flex-1">{faq.query}</Label>
              <div className="flex space-x-2 items-center">
                <CopyButton
                  text={faq.query}
                  className="h-10"
                  variant="outline"
                />
                <DeleteDialog onConfirm={() => handleDelete(faq.id)} />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
