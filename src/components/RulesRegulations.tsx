import { useState } from 'react';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';
import { rules } from '../data/rules';

export function RulesRegulations() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 print:mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors print:hidden"
      >
        <span className="flex items-center">
          <Book className="w-5 h-5 mr-2" />
          Rules and Regulations
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <div className={`mt-4 space-y-6 ${isOpen ? 'block' : 'hidden'} print:block`}>
        <div className="prose prose-green max-w-none">
          {/* General Principles */}
          <h4 className="text-lg font-semibold text-green-700">{rules.generalPrinciples.title}</h4>
          <p className="mb-6">{rules.generalPrinciples.content}</p>

          {/* Rules Sections */}
          {rules.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h4 className="text-lg font-semibold text-green-700">{section.title}</h4>
              <ul className="list-disc pl-5 space-y-2">
                {section.rules.map((rule, ruleIndex) => (
                  <li key={ruleIndex}>{rule}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Consequences */}
          <h4 className="text-lg font-semibold text-green-700">{rules.consequences.title}</h4>
          <ul className="list-disc pl-5 space-y-2">
            {rules.consequences.items.map((item, index) => (
              <li key={index}>
                <strong>{item.title}:</strong> {item.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}