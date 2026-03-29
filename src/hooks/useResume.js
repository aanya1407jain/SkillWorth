import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Static mapping for roles and questions
const sectorLogic = {
  "Software Engineering": ["React", "Node", "JavaScript", "HTML", "CSS", "AWS", "SQL", "Cloud"],
  "AI & Data Science": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "SQL"],
  "Medical / Healthcare": ["Surgery", "Clinical", "Medicine", "Diagnosis", "Patient Care"],
  "Business & Management": ["Project Management", "Salesforce", "ROI", "Budgeting", "Team Leadership"],
  "Education": ["Teaching", "Pedagogy", "Curriculum", "Classroom"]
};

const industryData = {
  "Software Engineering": {
    tips: ["Add a link to your live projects.", "Focus on Clean Code principles."],
    gaps: ["System Design", "Microservices"],
    pay: "₹8L - ₹32L",
    questions: [
      { q: "Explain the difference between Virtual DOM and Real DOM in React.", h: "Focus on performance and reconciliation." },
      { q: "What are microservices, and how do they differ from monolithic architecture?", h: "Discuss scalability and independent deployment." }
    ]
  },
  "AI & Data Science": {
    tips: ["Host your models on HuggingFace.", "Highlight data cleaning expertise."],
    gaps: ["MLOps", "Model Deployment"],
    pay: "₹12L - ₹40L",
    questions: [
      { q: "Explain the Bias-Variance tradeoff in Machine Learning.", h: "Discuss overfitting vs underfitting." },
      { q: "How does a Convolutional Neural Network (CNN) process an image?", h: "Mention filters, pooling, and feature maps." }
    ]
  },
  "Medical / Healthcare": {
    tips: ["Highlight clinical certifications.", "Mention specialized equipment skills."],
    gaps: ["Telemedicine", "Healthcare AI"],
    pay: "₹15L - ₹50L",
    questions: [
      { q: "How do you stay updated with the latest clinical protocols?", h: "Mention journals or continuous education." },
      { q: "Describe your experience with Electronic Health Records (EHR) systems.", h: "Focus on data accuracy and privacy." }
    ]
  }
};

export const useResume = () => {
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestedRole, setSuggestedRole] = useState("AWAITING_SCAN");
  const [salary, setSalary] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [mentorTips, setMentorTips] = useState([]);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [comparisons, setComparisons] = useState([]);

  const scanFile = async (file) => {
    if (!file) return;
    setIsScanning(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(s => s.str).join(" ") + " ";
      }

      const cleanText = text.replace(/\s+/g, ' ');
      const noise = new Set(["Viraj", "Vishwakarma", "Global", "Institute", "Engineering", "Management", "Jabalpur", "India"]);
      const skillPatterns = /\b(React|Node|JavaScript|Python|C\+\+|SQL|HTML|CSS|TensorFlow|PyTorch|Machine Learning|Deep Learning|Excel|PowerBI|Project Management|Team Leadership|Public Speaking|Surgery|Clinical|Pedagogy|Accounting|Salesforce|Cloud|AWS|Docker|Kubernetes|Communication|Problem Solving|Adaptability)\b/gi;
      
      const rawMatches = cleanText.match(skillPatterns) || [];
      const extractedSkills = [...new Set(rawMatches.map(s => s.trim()).filter(s => !noise.has(s)))];

      // Determine Role
      let bestGoal = "Professional Specialist";
      let topCount = 0;
      Object.entries(sectorLogic).forEach(([goal, keywords]) => {
        const count = keywords.filter(k => extractedSkills.some(s => s.toLowerCase() === k.toLowerCase())).length;
        if (count > topCount) {
          topCount = count;
          bestGoal = goal;
        }
      });

      // Role Comparisons
      const roleScores = Object.entries(sectorLogic).map(([role, keywords]) => {
        const matchCount = keywords.filter(k => extractedSkills.some(s => s.toLowerCase() === k.toLowerCase())).length;
        return { role, score: Math.round((matchCount / keywords.length) * 100) };
      });
      setComparisons(roleScores);

      // Select Industry Data
      const selected = industryData[bestGoal] || { 
        tips: ["Quantify achievements."], gaps: ["Leadership"], pay: "₹6L+", 
        questions: [{ q: "Tell me about a difficult project you managed.", h: "Use the STAR method." }]
      };

      // Set the field-specific questions
      setMockQuestions(selected.questions.map(item => ({
        skill: bestGoal,
        question: item.q,
        hint: item.h
      })));

      setSkills(extractedSkills.length > 0 ? extractedSkills : ["Communication"]);
      setSuggestedRole(bestGoal);
      setAtsScore(Math.floor(Math.random() * 20) + 70); 
      setSalary(selected.pay);
      setMentorTips(selected.tips);
      setMissingSkills(selected.gaps);

    } catch (e) {
      console.error("PARSING_ERROR", e);
    } finally { setIsScanning(false); }
  };

  return { scanFile, skills, missingSkills, suggestedRole, salary, isScanning, atsScore, mentorTips, mockQuestions, comparisons };
};