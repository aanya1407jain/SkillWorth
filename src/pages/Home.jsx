import React, { useMemo, useState, useEffect } from 'react';
import { useResume } from '../hooks/useResume';
import Roadmap from '../components/Roadmap';
import SkillCard from '../components/SkillCard';
import ResumeScore from '../components/ResumeScore';
import { 
  Upload, CheckCircle, BookOpen, ExternalLink, Terminal, 
  ShieldCheck, Linkedin, RefreshCcw, Cpu, MessageSquareCode, Layers 
} from 'lucide-react';

const Home = () => {
  // Destructuring the original and the new state variables from your hook
  const { 
    scanFile, skills, missingSkills, suggestedRole, salary, 
    isScanning, atsScore, mentorTips, mockQuestions, comparisons 
  } = useResume();

  const [logs, setLogs] = useState([
    "[SYSTEM] SKILLWORTH_KERNEL_v4.0_LOADED", 
    "[NETWORK] SECURE_CONNECTION_ESTABLISHED"
  ]);

  useEffect(() => {
    if (isScanning) {
      setLogs(prev => [...prev, ">> ACCESSING_FILE_BUFFER...", ">> RUNNING_ATS_CHECK..."]);
    } else if (skills.length > 0) {
      setLogs(prev => [
        ...prev, 
        `>> ATS_SCORE: ${atsScore}%`, 
        `>> AI_MENTOR_ADVICE: ${mentorTips[0]}`
      ]);
    }
  }, [isScanning, skills, atsScore, mentorTips]);

  const shareOnLinkedin = () => {
    const text = `Verified my skills on SkillWorth.exe! ATS Score: ${atsScore}% for ${suggestedRole}. Built in Jabalpur!`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10 pb-24">
      {/* LEFT COLUMN: UPLOAD & AI MENTOR */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-3">
          <h1 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter cursor-pointer glitch-text hover:text-hack-green select-none">
            BUILD YOUR <br/> <span className="italic underline decoration-8">FUTURE</span>
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-hack-green opacity-80 uppercase tracking-widest">
              <ShieldCheck size={14} className="animate-pulse"/> SESSION_ID: {Math.floor(Math.random()*99999)}
            </div>
            {skills.length > 0 && (
              <button onClick={() => window.location.reload()} className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1">
                <RefreshCcw size={10}/> RESET_SESSION
              </button>
            )}
          </div>
        </div>

        {/* UPLOAD_ZONE */}
        {!skills.length ? (
          <label 
            className="neo-brutal p-12 flex flex-col items-center justify-center border-dashed border-8 border-black cursor-pointer group hover:scale-[1.02] transition-all duration-300 shadow-neo"
            style={{ backgroundColor: 'var(--color-hack-blue)' }}
          >
            <input type="file" className="hidden" accept=".pdf" onChange={(e) => scanFile(e.target.files[0])} />
            <Upload size={64} className={`mb-4 ${isScanning ? 'animate-bounce text-black' : 'text-black'}`} />
            <span className="font-black text-2xl tracking-widest uppercase text-black text-center">
              {isScanning ? "ATS_SCANNING..." : "UPLOAD_RESUME"}
            </span>
          </label>
        ) : (
          <div className="space-y-6">
            <div className="neo-brutal bg-hack-yellow p-4 border-4 border-black flex items-center justify-between shadow-neo text-black">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60 text-black">ATS_SCORE // MARKET_VALUE</p>
                <h4 className="text-3xl font-black">{atsScore}% // {salary}</h4>
              </div>
              <Cpu size={40} className="opacity-20" />
            </div>
            
            <ResumeScore score={atsScore} />
          </div>
        )}

        {/* AI MENTOR TERMINAL */}
        <div className="neo-brutal bg-black p-4 h-48 overflow-y-auto font-mono text-[10px] text-hack-green border-zinc-800 scrollbar-hide shadow-neo">
          <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2 tracking-[0.2em]">
            <Terminal size={14}/> AI_MENTOR_FEEDBACK
          </div>
          {skills.length > 0 && (
            <div className="mb-4 text-hack-blue">
              <p className="font-bold underline mb-1 uppercase tracking-tighter">Career_Advantage_Protocol:</p>
              {mentorTips.map((tip, i) => <p key={i} className="mb-1"> {`> ${tip}`}</p>)}
            </div>
          )}
          <div className="opacity-40 border-t border-zinc-800 pt-2">
            {logs.map((log, i) => <p key={i} className="mb-1 lowercase">[{new Date().toLocaleTimeString()}] {log}</p>)}
          </div>
        </div>

        {/* INVENTORY CARD */}
        <div className="neo-brutal p-6 border-4 border-black shadow-neo" style={{ backgroundColor: '#1a1a1a' }}>
           <h3 className="font-bold mb-4 flex items-center gap-2 text-hack-green uppercase tracking-tighter">
             <CheckCircle size={18}/> Detected_Inventory:
           </h3>
           <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map(s => <SkillCard key={s} name={s} />)
              ) : (
                <p className="text-[10px] opacity-40 font-mono italic uppercase tracking-widest text-white">Awaiting_Data_Packet...</p>
              )}
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ROADMAP & ENHANCEMENTS */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Career_Roadmap_v4.2</h2>
          {skills.length > 0 && (
            <button onClick={shareOnLinkedin} className="neo-brutal bg-[#0077b5] text-white px-4 py-2 text-[10px] font-black flex items-center gap-2 hover:bg-[#005885]">
              <Linkedin size={14}/> SHARE_ON_LINKEDIN
            </button>
          )}
        </div>

        <Roadmap foundSkills={skills} missingSkills={missingSkills} role={suggestedRole} />

        {/* NEW FEATURE: MULTI-ROLE COMPARISON */}
        {comparisons && comparisons.length > 0 && (
          <div className="neo-brutal p-6 bg-zinc-900 border-hack-yellow shadow-[8px_8px_0px_#fbbf24]">
            <h3 className="text-xl font-black mb-4 text-hack-yellow flex items-center gap-2 uppercase">
              <Layers size={20}/> Compatibility_Matrix:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparisons.map((item, i) => (
                <div key={i} className="border-2 border-black p-3 bg-black/50">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-white opacity-60">{item.role}</span>
                    <span className={item.score > 50 ? "text-hack-green" : "text-red-500"}>{item.score}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 border border-black">
                    <div className="h-full bg-hack-yellow transition-all duration-1000" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW FEATURE: INTERACTIVE MOCK INTERVIEW */}
        {mockQuestions && mockQuestions.length > 0 && (
          <div className="neo-brutal p-6 bg-black text-white border-hack-green shadow-[8px_8px_0px_#00ff41]">
            <h3 className="text-xl font-black mb-6 text-hack-green flex items-center gap-2 uppercase tracking-widest">
              <MessageSquareCode size={24}/> Interview_Engine:
            </h3>
            <div className="space-y-4">
              {mockQuestions.map((q, i) => (
                <div key={i} className="p-4 border-2 border-zinc-800 bg-zinc-900/40 font-mono">
                  <p className="text-hack-green text-[10px] mb-2 uppercase">TARGET: {q.skill}</p>
                  <p className="text-sm italic mb-3">"{q.question}"</p>
                  <details className="cursor-pointer group">
                    <summary className="text-[10px] text-hack-blue underline uppercase list-none">[ REVEAL_HINT ]</summary>
                    <p className="text-[11px] opacity-70 bg-black p-3 border border-dashed border-hack-blue/30 mt-2">
                      {q.hint}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESTORED TRAINING MODULES (YouTube + Docs) */}
        {missingSkills.length > 0 && (
          <div className="neo-brutal p-6 bg-black text-white border-hack-blue shadow-[8px_8px_0px_#00e5ff]">
            <h3 className="text-xl font-black mb-6 text-hack-blue flex items-center gap-2 uppercase tracking-widest">
              <BookOpen size={24}/> Training_Modules_Required:
            </h3>
            <div className="space-y-3">
              {missingSkills.map((skill, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between border-2 border-zinc-800 p-4 bg-zinc-900/40 hover:bg-zinc-800 transition-all group">
                  <div>
                    <span className="text-[10px] text-hack-blue font-mono uppercase block mb-1">MODULE_ID: {2000+i}</span>
                    <span className="font-bold text-white text-lg uppercase tracking-widest group-hover:text-hack-blue transition-colors">{skill}</span>
                  </div>
                  <div className="flex gap-3 mt-3 md:mt-0">
                    <a 
                      href={`https://www.youtube.com/results?search_query=${skill}+tutorial`} 
                      target="_blank" 
                      className="neo-brutal bg-red-600 text-white px-4 py-2 text-[10px] font-black flex items-center gap-1 hover:bg-red-500"
                    >
                      YOUTUBE <ExternalLink size={10}/>
                    </a>
                    <a 
                      href={`https://www.google.com/search?q=${skill}+official+documentation`} 
                      target="_blank" 
                      className="neo-brutal bg-hack-blue text-black px-4 py-2 text-[10px] font-black flex items-center gap-1"
                    >
                      DOCS <ExternalLink size={10}/>
                    </a>
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