import React, { useState, useEffect } from 'react';
import { useResume } from '../hooks/useResume';
import Roadmap from '../components/Roadmap';
import SkillCard from '../components/SkillCard';
import ResumeScore from '../components/ResumeScore';
import { 
  Upload, CheckCircle, BookOpen, ExternalLink, Terminal, 
  ShieldCheck, Linkedin, RefreshCcw, Cpu, MessageSquareCode, Layers, Code2, Trophy
} from 'lucide-react';

const Home = () => {
  const { 
    scanFile, skills, missingSkills, suggestedRole, salary, 
    isScanning, atsScore, mentorTips, mockQuestions, comparisons,
    generatePortfolio, activeQuiz 
  } = useResume();

  const [logs, setLogs] = useState(["[SYSTEM] SKILLWORTH_KERNEL_v4.0_LOADED"]);
  const [quizRunning, setQuizRunning] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // FEATURE: PULL-TO-REFRESH FOR MOBILE
  useEffect(() => {
    let touchStart = 0;
    const handleTouchStart = (e) => { touchStart = e.touches[0].pageY; };
    const handleTouchEnd = (e) => {
      const touchEnd = e.changedTouches[0].pageY;
      if (touchEnd - touchStart > 200 && window.scrollY === 0) {
        if(window.confirm("[SYSTEM_REBOOT]: Reset current session?")) {
          window.location.reload();
        }
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  useEffect(() => {
    if (quizRunning) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [quizRunning]);

  useEffect(() => {
    if (isScanning) {
      setLogs(prev => [...prev, ">> ACCESSING_FILE_BUFFER...", ">> RUNNING_ATS_CHECK..."]);
    } else if (skills.length > 0) {
      setLogs(prev => [...prev, `>> ATS_SCORE: ${atsScore}%`, `>> ADVICE: ${mentorTips[0]}`]);
    }
  }, [isScanning, skills, atsScore, mentorTips]);

  const runAnalysis = () => {
    let score = 0;
    activeQuiz.forEach((q, i) => { if (answers[i] === q.c) score++; });
    setQuizResult({ score, status: score >= 8 ? "ELITE" : score >= 5 ? "STABLE" : "UPGRADE_REQUIRED" });
    setQuizRunning(false);
  };

  const shareOnLinkedin = () => {
    const text = `Verified my skills on SkillWorth.exe! ATS Score: ${atsScore}% for ${suggestedRole}.`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mt-6 lg:mt-10 pb-24 px-4 lg:px-0 overflow-hidden">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-5 space-y-6 lg:space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl lg:text-7xl font-black uppercase leading-[0.85] tracking-tighter cursor-pointer glitch-text hover:text-hack-green select-none">
            BUILD YOUR <br/> 
            <span 
              className="inline-block italic underline decoration-4 lg:decoration-8 -skew-x-3 origin-left transition-transform duration-300 hover:-skew-x-5"
              style={{ textUnderlineOffset: '6px' }}
            >
              FUTURE
            </span>
          </h1>
          <div className="flex justify-between items-center text-[10px] font-bold text-hack-green uppercase">
            <div className="flex items-center gap-2"><ShieldCheck size={14} className="animate-pulse"/> SESSION: {Math.floor(Math.random()*999)}</div>
            {skills.length > 0 && <button onClick={() => window.location.reload()} className="text-red-500 hover:underline flex items-center gap-1"><RefreshCcw size={10}/> RESET</button>}
          </div>
        </div>

        {!skills.length ? (
          <label className="neo-brutal p-8 lg:p-12 flex flex-col items-center justify-center border-dashed border-4 lg:border-8 border-black cursor-pointer bg-hack-blue shadow-[4px_4px_0px_black] lg:shadow-neo">
            <input type="file" className="hidden" accept=".pdf" onChange={(e) => scanFile(e.target.files[0])} />
            <Upload size={48} className={`mb-4 lg:w-16 lg:h-16 ${isScanning ? 'animate-bounce text-black' : 'text-black'}`} />
            <span className="font-black text-xl lg:text-2xl uppercase text-black text-center">{isScanning ? "SCANNING..." : "UPLOAD_RESUME"}</span>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="neo-brutal bg-hack-yellow p-4 border-4 border-black flex items-center justify-between shadow-[4px_4px_0px_black] lg:shadow-neo text-black">
              <div><p className="text-[10px] font-black uppercase opacity-60">ATS // MARKET</p><h4 className="text-2xl lg:text-3xl font-black">{atsScore}% // {salary}</h4></div>
              <Cpu size={32} className="opacity-20 lg:w-10 lg:h-10" />
            </div>
            <ResumeScore score={atsScore} />
          </div>
        )}

        <div className="neo-brutal bg-black p-4 h-40 lg:h-48 overflow-y-auto font-mono text-[10px] text-hack-green shadow-[4px_4px_0px_black] lg:shadow-neo">
          <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2"><Terminal size={14}/> AI_MENTOR_FEEDBACK</div>
          {skills.length > 0 && <div className="mb-4 text-hack-blue">{mentorTips.map((tip, i) => <p key={i}> {`> ${tip}`}</p>)}</div>}
          <div className="opacity-40">{logs.map((log, i) => <p key={i}>[{new Date().toLocaleTimeString()}] {log}</p>)}</div>
        </div>

        <div className="neo-brutal p-4 lg:p-6 border-4 border-black shadow-[4px_4px_0px_black] lg:shadow-neo" style={{ backgroundColor: '#1a1a1a' }}>
           <h3 className="font-bold mb-4 flex items-center gap-2 text-hack-green uppercase tracking-tighter text-sm lg:text-base"><CheckCircle size={18}/> Detected_Inventory:</h3>
           {/* Mobile horizontal swipe, Desktop wrap */}
           <div className="flex lg:flex-wrap overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 scrollbar-hide snap-x">
             {skills.length > 0 ? skills.map(s => <div key={s} className="snap-center shrink-0"><SkillCard name={s} /></div>) : <p className="text-[10px] opacity-40 uppercase">Awaiting_Packet...</p>}
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tighter">Career_Roadmap_v4.2</h2>
          <div className="flex gap-2 w-full lg:w-auto">
            {skills.length > 0 && <button onClick={() => generatePortfolio("Aanya")} className="flex-1 lg:flex-none justify-center neo-brutal bg-white text-black px-4 py-3 lg:py-2 text-[10px] font-black flex items-center gap-2 hover:bg-hack-blue"><Code2 size={14}/> GENERATE_PORTFOLIO</button>}
            {skills.length > 0 && <button onClick={shareOnLinkedin} className="flex-1 lg:flex-none justify-center neo-brutal bg-[#0077b5] text-white px-4 py-3 lg:py-2 text-[10px] font-black flex items-center gap-2 hover:bg-[#005885]"><Linkedin size={14}/> SHARE</button>}
          </div>
        </div>

        <Roadmap foundSkills={skills} missingSkills={missingSkills} role={suggestedRole} />

        {/* MCQ QUIZ SYSTEM */}
        {skills.length > 0 && (
          <div className="neo-brutal p-4 lg:p-6 bg-zinc-900 border-hack-blue shadow-[4px_4px_0px_#00e5ff] lg:shadow-[8px_8px_0px_#00e5ff]">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mb-6">
              <h3 className="text-lg lg:text-xl font-black text-hack-blue flex items-center gap-2 uppercase tracking-widest leading-tight">
                <Trophy size={18} className="shrink-0 lg:w-5 lg:h-5"/> Progress_Status:
              </h3>
              {quizResult && <span className="bg-hack-green text-black px-3 py-1.5 font-black text-[10px] sm:text-xs whitespace-nowrap tracking-wider self-start sm:self-auto border-2 border-black">{quizResult.status}</span>}
            </div>
            {!quizRunning && !quizResult ? (
              <button onClick={() => setQuizRunning(true)} className="w-full py-3 lg:py-4 bg-hack-blue text-black font-black border-4 border-black uppercase tracking-tighter">Initiate_Skill_Verification (10 Questions)</button>
            ) : quizResult ? (
              <div className="p-4 border-2 border-hack-green bg-black/40 font-mono text-center lg:text-left">
                <p className="text-hack-green text-xl lg:text-2xl font-black mb-2">SCORE: {quizResult.score}/10</p>
                <button onClick={() => {setQuizResult(null); setQuizRunning(false); setAnswers({});}} className="text-hack-blue text-xs underline uppercase">Restart_Verification</button>
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] lg:max-h-[400px] overflow-y-auto pr-2 lg:pr-4 scrollbar-hide">
                {activeQuiz.map((q, idx) => (
                  <div key={idx} className="border-b border-zinc-800 pb-4">
                    <p className="text-white font-bold mb-3 text-sm">{idx + 1}. {q.q}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {q.a.map((opt, i) => (<button key={i} onClick={() => setAnswers({...answers, [idx]: i})} className={`text-left p-3 lg:p-2 text-xs border ${answers[idx] === i ? 'bg-hack-blue text-black border-black font-bold' : 'border-zinc-700 text-zinc-500 hover:border-hack-blue'}`}>{opt}</button>))}
                    </div>
                  </div>
                ))}
                <button onClick={runAnalysis} className="w-full py-3 bg-hack-green text-black font-black border-4 border-black uppercase">Compile_Results</button>
              </div>
            )}
          </div>
        )}

        {/* COMPATIBILITY MATRIX */}
        {comparisons.length > 0 && (
          <div className="neo-brutal p-4 lg:p-6 bg-zinc-900 border-hack-yellow shadow-[4px_4px_0px_#fbbf24] lg:shadow-[8px_8px_0px_#fbbf24]">
            <h3 className="text-lg lg:text-xl font-black mb-4 text-hack-yellow flex items-center gap-2 uppercase"><Layers size={18} className="lg:w-5 lg:h-5"/> Compatibility_Matrix:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisons.map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-black/50">
                  <div className="flex justify-between text-[10px] font-mono mb-1"><span className="text-white opacity-60">{item.role}</span><span className={item.score > 50 ? "text-hack-green" : "text-red-500"}>{item.score}%</span></div>
                  <div className="w-full bg-zinc-800 h-2 border border-black"><div className="h-full bg-hack-yellow transition-all duration-1000" style={{ width: `${item.score}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERVIEW ENGINE */}
        {mockQuestions && mockQuestions.length > 0 && (
          <div className="neo-brutal p-4 lg:p-6 bg-black text-white border-hack-green shadow-[4px_4px_0px_#00ff41] lg:shadow-[8px_8px_0px_#00ff41]">
            <h3 className="text-lg lg:text-xl font-black mb-4 lg:mb-6 text-hack-green flex items-center gap-2 uppercase tracking-widest"><MessageSquareCode size={18} className="lg:w-6 lg:h-6"/> Interview_Engine:</h3>
            <div className="space-y-4">
              {mockQuestions.map((q, i) => (
                <div key={i} className="p-4 border-2 border-zinc-800 bg-zinc-900/40 font-mono">
                  <p className="text-hack-green text-[10px] mb-2 uppercase tracking-tighter">TARGET: {q.skill}</p>
                  <p className="text-xs lg:text-sm italic mb-3">"{q.question}"</p>
                  <details className="cursor-pointer group">
                    <summary className="text-[10px] text-hack-blue underline uppercase list-none">[ REVEAL_HINT ]</summary>
                    <p className="text-[10px] lg:text-[11px] opacity-70 bg-black p-3 border border-dashed border-hack-blue/30 mt-2">{q.hint}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRAINING MODULES */}
        {missingSkills.length > 0 && (
          <div className="neo-brutal p-4 lg:p-6 bg-black text-white border-hack-blue shadow-[4px_4px_0px_#00e5ff] lg:shadow-[8px_8px_0px_#00e5ff]">
            <h3 className="text-lg lg:text-xl font-black mb-4 lg:mb-6 text-hack-blue flex items-center gap-2 uppercase tracking-widest"><BookOpen size={18} className="lg:w-6 lg:h-6"/> Training_Modules:</h3>
            <div className="space-y-3">
              {missingSkills.map((skill, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between border-2 border-zinc-800 p-4 bg-zinc-900/40 hover:bg-zinc-800 transition-all group">
                  <div className="mb-3 md:mb-0 text-center md:text-left">
                    <span className="text-[10px] text-hack-blue font-mono uppercase block mb-1">MODULE_ID: {2000+i}</span>
                    <span className="font-bold text-white text-base lg:text-lg uppercase tracking-widest group-hover:text-hack-blue transition-colors">{skill}</span>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <a href={`https://www.youtube.com/results?search_query=${skill}+tutorial`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none justify-center neo-brutal bg-red-600 text-white px-3 py-2 text-[10px] font-black flex items-center gap-1 hover:bg-red-500">YOUTUBE <ExternalLink size={10}/></a>
                    <a href={`https://www.google.com/search?q=${skill}+official+documentation`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none justify-center neo-brutal bg-hack-blue text-black px-3 py-2 text-[10px] font-black flex items-center gap-1">DOCS <ExternalLink size={10}/></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;