import { ChevronDown } from "lucide-react";
import { faqs } from "./landingData";

export default function FaqSection({ openFaq, onToggle }) {
  return <section id="faq" className="py-24 bg-white"><div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"><div className="mb-14"><h2 className="text-4xl text-gray-900 mb-3" style={{ fontFamily: "var(--font-heading)" }}>Common questions</h2></div><div className="space-y-2">{faqs.map(([question, answer], index) => <div key={question} className="border border-gray-100 rounded-xl overflow-hidden"><button onClick={() => onToggle(index)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"><span className="font-medium text-gray-900 text-sm pr-4">{question}</span><ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <div className="px-5 pb-4"><p className="text-sm text-gray-600 leading-relaxed">{answer}</p></div>}</div>)}</div></div></section>;
}
