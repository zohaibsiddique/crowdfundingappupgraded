// app/components/FaqSection.tsx

"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How Does FundBase Ensure the Security of My Donations?",
    answer:
      "FundBase prioritizes your security by utilizing advanced encryption techniques and secure payment gateways. We ensure that your personal and financial information is protected throughout the donation process.",
  },
  {
    question: "What Types of Projects Can I Support on FundBase?",
    answer:
      "FundBase supports a wide range of projects including community, innovation, environment, education, and more.",
  },
  {
    question: "How Can I Track the Progress of a Campaign I've Fund To?",
    answer:
      "You can track campaign updates, milestones, and progress directly from your dashboard after logging into FundBase.",
  },
  {
    question: "Are There Any Fees Associated with Donations?",
    answer:
      "FundBase charges minimal platform fees to cover operational costs. Full transparency is provided before you confirm any donation.",
  },
  {
    question: "How Can I Get Involved with FundBase Beyond Donations?",
    answer:
      "Apart from donating, you can become a campaign ambassador, share projects, or help spread awareness through social channels.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-5 px-35 mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10">
        Your Questions <span className="text-blue-500">Answered</span>
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className=""
          >
            <AccordionTrigger className="text-lg font-semibold px-4 py-3">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-gray-700 text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
