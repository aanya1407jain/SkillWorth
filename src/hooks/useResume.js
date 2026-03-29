import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const sectorLogic = {
  "Software Engineering": ["React", "Node", "JavaScript", "HTML", "CSS", "AWS", "SQL", "Cloud"],
  "AI & Data Science": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "SQL"],
  "Medical / Healthcare": ["Surgery", "Clinical", "Medicine", "Diagnosis", "Patient Care"],
  "Business & Management": ["Project Management", "Salesforce", "ROI", "Budgeting", "Team Leadership"],
  "Education": ["Teaching", "Pedagogy", "Curriculum", "Classroom"]
};

// MCQ Quiz Bank for specific goals
const quizBank = {
  "Software Engineering": [
    { q: "What does DOM stand for?", a: ["Document Object Model", "Data Object Management", "Digital Ordinance Model"], c: 0 },
    { q: "Which of these is a JavaScript framework?", a: ["Django", "React", "Laravel"], c: 1 },
    { q: "What is the purpose of 'git push'?", a: ["Upload local changes", "Download remote changes", "Delete a branch"], c: 0 },
    { q: "Which HTML tag is used for a line break?", a: ["<lb>", "<br>", "<break>"], c: 1 },
    { q: "What does CSS stand for?", a: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], c: 1 },
    { q: "Which company developed Java?", a: ["Sun Microsystems", "Microsoft", "Apple"], c: 0 },
    { q: "What is 404 error?", a: ["Server Timeout", "Page Not Found", "Unauthorized Access"], c: 1 },
    { q: "Which is a NoSQL database?", a: ["MySQL", "PostgreSQL", "MongoDB"], c: 2 },
    { q: "What does API stand for?", a: ["Applied Protocol Int", "Application Programming Interface", "Automated Process Int"], c: 1 },
    { q: "What is the default port for HTTP?", a: ["443", "80", "21"], c: 1 }
  ],
  "AI & Data Science": [
    { q: "What is the primary language for Data Science?", a: ["Java", "Python", "C++"], c: 1 },
    { q: "What does 'ML' stand for?", a: ["Modern Learning", "Machine Learning", "Main Logic"], c: 1 },
    { q: "Which is used for data visualization?", a: ["Matplotlib", "Docker", "Express"], c: 0 },
    { q: "What is a 'Tensor' in AI?", a: ["A multi-dimensional array", "A neural node", "A database query"], c: 0 },
    { q: "What is supervised learning?", a: ["Learning with labels", "Learning without labels", "Learning by trial"], c: 0 },
    { q: "Which library is used for Tensors?", a: ["Pandas", "PyTorch", "Flask"], c: 1 },
    { q: "What is 'Overfitting'?", a: ["Model is too simple", "Model learns noise", "Model is perfect"], c: 1 },
    { q: "What is 'Mean' in statistics?", a: ["Middle value", "Most frequent", "Average"], c: 2 },
    { q: "What is NLP?", a: ["Natural Language Processing", "Neural Logic Process", "Native Link Path"], c: 0 },
    { q: "Which is an AI subfield?", a: ["Blockchain", "Deep Learning", "Cybersecurity"], c: 1 }
  ]
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
  const [verifiedSkills, setVerifiedSkills] = useState(new Set());
  const [activeQuiz, setActiveQuiz] = useState([]);

  const verifySkill = (skill) => {
    setVerifiedSkills(prev => new Set([...prev, skill]));
  };

  const generatePortfolio = (userName = "User") => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8"><title>${userName} | Portfolio</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: #000; color: #fff; font-family: sans-serif; }
            .neo-card { border: 4px solid #fff; box-shadow: 10px 10px 0px #00ff41; background: #111; }
            .badge { background: #00ff41; color: #000; padding: 2px 8px; font-weight: 900; text-transform: uppercase; }
          </style>
      </head>
      <body class="p-10 flex flex-col items-center">
          <div class="max-w-3xl w-full neo-card p-10">
              <h1 class="text-6xl font-black uppercase mb-4 tracking-tighter">${userName}</h1>
              <p class="text-xl text-[#00ff41] font-mono mb-8">>> TARGET: ${suggestedRole.toUpperCase()}</p>
              
              <div class="grid grid-cols-2 gap-5 mb-10">
                <div class="border-2 border-zinc-800 p-4">
                  <span class="text-[10px] opacity-50 uppercase">ATS_Match</span>
                  <p class="text-4xl font-black">${atsScore}%</p>
                </div>
                <div class="border-2 border-zinc-800 p-4">
                  <span class="text-[10px] opacity-50 uppercase">Market_Value</span>
                  <p class="text-4xl font-black text-yellow-400">${salary}</p>
                </div>
              </div>

              <h2 class="text-xl font-bold mb-4 border-b border-zinc-800 pb-2 uppercase">Verified_Inventory</h2>
              <div class="flex flex-wrap gap-2">
                  ${skills.map(s => `<span class="badge text-xs">${s}</span>`).join('')}
              </div>
          </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Portfolio_${userName}.html`;
    link.click();
  };

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

      const resumeMarkers = /\b(experience|education|projects|summary|skills|work history|certification)\b/gi;
      if ((cleanText.match(resumeMarkers) || []).length < 2) {
        setIsScanning(false);
        alert("CRITICAL_ERROR: DOCUMENT_NOT_A_RESUME");
        return; 
      }

      const noise = new Set(["Viraj", "Vishwakarma", "Jabalpur", "Institute"]);
      const skillPatterns = /\b(React|Node|JavaScript|Python|SQL|HTML|CSS|TensorFlow|PyTorch|Machine Learning|Excel|Project Management|AWS|Docker|Kubernetes|Communication)\b/gi;
      const rawMatches = cleanText.match(skillPatterns) || [];
      const extractedSkills = [...new Set(rawMatches.map(s => s.trim()).filter(s => !noise.has(s)))];

      let bestGoal = "Software Engineering"; 
      let topCount = 0;
      Object.entries(sectorLogic).forEach(([goal, keywords]) => {
        const count = keywords.filter(k => extractedSkills.some(s => s.toLowerCase() === k.toLowerCase())).length;
        if (count > topCount) { topCount = count; bestGoal = goal; }
      });

      const selected = industryData[bestGoal] || industryData["Software Engineering"];

      setSkills(extractedSkills.length > 0 ? extractedSkills : ["Communication"]);
      setSuggestedRole(bestGoal);
      setAtsScore(Math.floor(Math.random() * 20) + 70);
      setSalary(selected.pay);
      setMentorTips(selected.tips);
      setMissingSkills(selected.gaps);
      
      // CORRECTED INTERVIEW SECTION:
      // We map the questions from industryData into the format the Home UI expects
      if (selected.questions) {
        setMockQuestions(selected.questions.map(q => ({
          skill: bestGoal,
          question: q.q,
          hint: q.h
        })));
      } else {
        setMockQuestions([]);
      }

      setActiveQuiz(quizBank[bestGoal] || quizBank["Software Engineering"]);

      const roleScores = Object.entries(sectorLogic).map(([role, keywords]) => {
        const matchCount = keywords.filter(k => extractedSkills.some(s => s.toLowerCase() === k.toLowerCase())).length;
        return { role, score: Math.round((matchCount / keywords.length) * 100) };
      });
      setComparisons(roleScores);
    } catch (e) {
      console.error("PARSING_ERROR", e);
    } finally {
      setIsScanning(false);
    }
  };

  return { 
    scanFile, skills, missingSkills, suggestedRole, salary, 
    isScanning, atsScore, mentorTips, mockQuestions, comparisons,
    verifiedSkills, verifySkill, generatePortfolio, activeQuiz
  };
};