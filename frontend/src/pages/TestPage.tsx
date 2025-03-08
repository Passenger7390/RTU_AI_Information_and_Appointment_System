// import { getFAQs } from "@/api";
import { FAQCard } from "@/my_components/FAQ";

const TestPage = () => {
  // const fetchFAQs = async () => {
  //   try {
  //     const faqs = getFAQs();
  //     console.log(faqs);
  //   } catch (error) {}
  // };

  return (
    <div className="w-screen h-screen">
      <FAQCard
        idProp={2}
        questionProp="test"
        synonymsProp={["test", "test1"]}
        answerProp="asdfadfg"
      />
    </div>
  );
};

export default TestPage;
