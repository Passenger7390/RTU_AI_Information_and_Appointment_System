import { getFAQs } from "@/api";
import { FAQCard } from "@/my_components/FAQ";

const TestPage = () => {
  const fetchFAQs = async () => {
    try {
      const faqs = getFAQs();
      console.log(faqs);
    } catch (error) {}
  };
  return (
    <div className="w-screen h-screen">
      <FAQCard question="test" synonyms={["test", "test1"]} answer="asdfadfg" />
      {/* <FAQDialog /> */}
    </div>
  );
};

export default TestPage;
