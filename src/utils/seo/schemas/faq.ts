export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQSchemaProps {
    faqs: FAQItem[];
}

export function generateFAQSchema(props: FAQSchemaProps) {
    const { faqs } = props;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}
