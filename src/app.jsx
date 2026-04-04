import React, { useState, useEffect, useRef } from 'react';

const SUBJECTS_MAP = {
  "S1": [
    { name: "MATHEMATICS FOR INFORMATION SCIENCE-1", code: "MAT101" },
    { name: "ALGORITHMIC THINKING WITH PYTHON", code: "CST101" },
    { name: "PHYSICS FOR INFORMATION SCIENCE", code: "PHT101" },
    { name: "CHEMISTRY FOR INFORMATION SCIENCE", code: "CYT101" },
    { name: "ENGINEERING GRAPHICS AND COMPUTER AIDED DRAWING", code: "EST110" },
    { name: "INTRODUCTION TO ELECTRICAL & ELECTRONICS ENGINEERING", code: "EST130" },
    { name: "HEALTH AND WELLNESS", code: "HUT111" },
    { name: "LIFE SKILLS AND PROFESSIONAL COMMUNICATION", code: "HUT102" }
  ],
  "S3": [
    { name: "DATA STRUCTURES AND ALGORITHMS", code: "PCST303" },
    { name: "DATA STRUCTURES LAB", code: "PCSL307" },
    { name: "DIGITAL ELECTRONICS & LOGIC DESIGN", code: "GRST335" },
    { name: "DIGITAL LAB", code: "PCSL306" },
    { name: "ECONOMICS FOR ENGINEERS", code: "UCHUT366" },
    { name: "MATHEMATICS FOR INFORMATION SCIENCE-3", code: "GAMT301" },
    { name: "OBJECT ORIENTED PROGRAMMING", code: "PBCST304" },
    { name: "THEORY OF COMPUTATION", code: "PCST302" }
  ],
  "S5": [
    { name: "FORMAL LANGUAGES & AUTOMATA THEORY", code: "CST301" },
    { name: "MANAGEMENT OF SOFTWARE SYSTEMS", code: "HUT307" },
    { name: "MICROPROCESSORS AND MICROCONTROLLERS", code: "CST303" },
    { name: "COMPUTER NETWORKS", code: "CST305" },
    { name: "SYSTEM SOFTWARE", code: "CST307" },
    { name: "DISASTER MANAGEMENT", code: "MCN301" }
  ],
  "S7": [
    { name: "NATURAL LANGUAGE PROCESSING", code: "CST401" },
    { name: "MACHINE LEARNING", code: "CST403" },
    { name: "ARTIFICIAL INTELLIGENCE", code: "CST405" },
    { name: "CLOUD COMPUTING", code: "CST413" },
    { name: "WEB PROGRAMMING", code: "CST415" },
    { name: "COMPUTER GRAPHICS", code: "CST417" },
    { name: "PYTHON FOR ENGINEERS", code: "CST419" },
    { name: "INDUSTRIAL SAFETY ENGINEERING", code: "CST421" }
  ]
};

export default function App() {
  const [activePage, setActivePage] = useState('p1');
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration State
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [promoAgreed, setPromoAgreed] = useState(false);
  const [selectedChips, setSelectedChips] = useState([]);
  
  // Error States
  const [regError, setRegError] = useState({ show: false, text: '', name: false, age: false, terms: false, privacy: false });
  const [colError, setColError] = useState({ show: false, text: '', college: false, sem: false });

  // Timer State
  const [timeLeft, setTimeLeft] = useState(599);

  // College & KTU State
  const [collegeName, setCollegeName] = useState('');
  const [currentSem, setCurrentSem] = useState('');
  const [ktuData, setKtuData] = useState({ targetSem: 'S3', regNum: 'TCR2CS023', subjects: SUBJECTS_MAP['S3'] });

  // Chat UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState({ name: 'Sonnet 4.6' });
  const [isExtended, setIsExtended] = useState(false);
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Prank Interaction States
  const [chatClicks, setChatClicks] = useState(0);
  const [showPrankPopup, setShowPrankPopup] = useState(false);
  const [prankPhase, setPrankPhase] = useState(0);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [isDodging, setIsDodging] = useState(false); 
  const [prankBtnPos, setPrankBtnPos] = useState({ top: '50%', left: '50%' });
  const [prankResolved, setPrankResolved] = useState(false);

  const messagesEndRef = useRef(null);

  const navigate = (targetPage) => {
    setIsLoading(true);
    window.scrollTo(0,0);
    setTimeout(() => {
      setIsLoading(false);
      setActivePage(targetPage);
    }, 1200);
  };

  useEffect(() => {
    let timerInt;
    if (activePage === 'p3' && timeLeft > 0 && !isLoading) {
      timerInt = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timerInt);
  }, [activePage, timeLeft, isLoading]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleChip = (chip) => {
    setSelectedChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  };

  const handleRegister = () => {
    const isNameEmpty = !userName.trim();
    const isAgeEmpty = !userAge.trim();
    const hasError = isNameEmpty || isAgeEmpty || !termsAgreed || !privacyAgreed;

    if (hasError) {
      let text = "⚠ Please enter your name and age.";
      if ((isNameEmpty || isAgeEmpty) && (!termsAgreed || !privacyAgreed)) {
        text = "⚠ Please fill in your details and agree to the policies.";
      } else if (!termsAgreed || !privacyAgreed) {
        text = "⚠ You must agree to the Terms and Privacy Policy to continue.";
      }
      setRegError({ show: true, text, name: isNameEmpty, age: isAgeEmpty, terms: !termsAgreed, privacy: !privacyAgreed });
      return;
    }
    setRegError({ show: false, text: '', name: false, age: false, terms: false, privacy: false });
    navigate('p3');
  };

  const handleVerifyCollege = () => {
    const isColEmpty = !collegeName.trim();
    const isSemEmpty = !currentSem;

    if (isColEmpty || isSemEmpty) {
      setColError({ show: true, text: "⚠ Please fill in your college and semester.", college: isColEmpty, sem: isSemEmpty });
      return;
    }
    setColError({ show: false, text: '', college: false, sem: false });

    let targetSem = "S3"; 
    if (currentSem === "S2") targetSem = "S1";
    else if (currentSem === "S4") targetSem = "S3";
    else if (currentSem === "S6") targetSem = "S5";
    else if (currentSem === "S8") targetSem = "S7";

    const semNumber = targetSem.replace('S', '');
    const randomDigits = Math.floor(Math.random() * 100).toString().padStart(3, '0');
    const customRegNum = `KTUS${semNumber}CS${randomDigits}`;

    setKtuData({
      targetSem, regNum: customRegNum, subjects: SUBJECTS_MAP[targetSem] || SUBJECTS_MAP["S3"]
    });
    navigate('p4');
  };

  // === SET THE NUMBER OF CLICKS NEEDED HERE ===
  const REQUIRED_CLICKS = 3; 

  const handleChatInteraction = (e) => {
    if (prankResolved) return; 
    if (e) e.preventDefault(); 
    setChatClicks(prev => {
      const newClicks = prev + 1;
      // Triggers popup only after reaching the REQUIRED_CLICKS
      if (newClicks >= REQUIRED_CLICKS) {
        setShowPrankPopup(true);
        setDodgeCount(0);
        setPrankPhase(0);
        setIsDodging(false); // Reset dodging so it appears normally next time
        return 0; // Reset clicks
      }
      return newClicks;
    });
  };

  const handleSendChat = (textToSend = chatInput) => {
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', type: 'fail' }]);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const dodgePrankButton = () => {
    setIsDodging(true); 
    setDodgeCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setPrankPhase(1);
      }
      return newCount;
    });
    
    const top = Math.random() * 70 + 15; 
    const left = Math.random() * 70 + 15; 
    setPrankBtnPos({ top: `${top}%`, left: `${left}%` });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Sora',sans-serif;background:#1a1a18;color:#e8e4d9;min-height:100vh;margin:0;overflow-x:hidden;}
        .page{display:none;min-height:100vh;}
        .page.active{display:block;}
        
        .loading-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #1a1a18; display: flex; flex-direction: column; gap: 15px; align-items: center; justify-content: center; z-index: 9999; }
        .loading-star { color: #d4773a; font-size: 38px; animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite; }
        .loading-text { color: #8a8680; font-size: 14px; letter-spacing: 1px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .cl-wrap{min-height:100vh;background:#1a1a18;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 16px;}
        .cl-logo{display:flex;align-items:center;gap:10px;margin-bottom:40px;}
        .cl-star{color:#d4773a;font-size:22px;}
        .cl-logo-text{font-size:19px;color:#e8e4d9;font-weight:400;}
        .cl-card{background:#242420;border:1px solid #333330;border-radius:14px;padding:44px 40px;max-width:500px;width:100%;}
        @media(max-width:520px){.cl-card{padding:32px 22px;}}
        .offer-badge{display:inline-block;background:#1d3a1d;color:#5cb85c;font-size:12px;padding:5px 14px;border-radius:20px;border:1px solid #3a6a3a;margin-bottom:18px;font-weight:500;}
        .offer-h1{font-size:28px;font-weight:600;color:#e8e4d9;line-height:1.3;margin-bottom:10px;}
        .offer-sub{font-size:14px;color:#8a8680;line-height:1.7;margin-bottom:28px;}
        .perks{display:flex;flex-direction:column;gap:14px;margin-bottom:28px;}
        .perk{display:flex;gap:12px;align-items:flex-start;}
        .perk-icon{width:32px;height:32px;border-radius:8px;background:#2e2e2a;border:1px solid #3a3a36;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
        .perk-body{font-size:13.5px;color:#8a8680;line-height:1.5;padding-top:6px;}
        .perk-body strong{color:#e8e4d9;font-weight:500;}
        .btn-primary{width:100%;background:#e8e4d9;color:#1a1a18;border:none;border-radius:9px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;font-family:'Sora',sans-serif;transition:opacity .15s;}
        .btn-primary:hover{opacity:.88;}
        .slots-note{font-size:12px;color:#4a4a46;text-align:center;margin-top:12px;}
        .slots-note span{color:#d4773a;}
        .steps{display:flex;gap:6px;margin-bottom:28px;}
        .sdot{width:9px;height:9px;border-radius:50%;background:#2e2e2a;border:1px solid #3a3a36;}
        .sdot.on{background:#e8e4d9;border-color:#e8e4d9;}
        .reg-h1{font-size:22px;font-weight:600;margin-bottom:6px;}
        .reg-sub{font-size:13.5px;color:#8a8680;margin-bottom:22px;line-height:1.6;}
        .fgroup{margin-bottom:16px;}
        .flabel{font-size:13px;color:#8a8680;margin-bottom:6px;display:block;}
        .finput{width:100%;background:#1e1e1c;border:1px solid #3a3a36;border-radius:9px;padding:12px 14px;color:#e8e4d9;font-size:14px;outline:none;font-family:'Sora',sans-serif;transition:border-color .15s;}
        .finput:focus{border-color:#6a6a60;}
        .chips{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;}
        .chip{background:#1e1e1c;border:1px solid #3a3a36;border-radius:22px;padding:8px 14px;font-size:13px;color:#8a8680;cursor:pointer;text-align:center;transition:all .15s;font-family:'Sora',sans-serif;user-select:none;}
        .chip.sel{background:#1d3a1d;border-color:#3a6a3a;color:#5cb85c;}
        .checkbox-row{display:flex;gap:10px;align-items:flex-start;margin-bottom:14px;}
        .checkbox-row input{margin-top:3px;accent-color:#d4773a;}
        .checkbox-row label{font-size:12.5px;color:#6a6a60;line-height:1.6;}
        .checkbox-row a{color:#8a8680;text-decoration:underline;}
        .confetti{font-size:32px;text-align:center;margin-bottom:18px;letter-spacing:6px;}
        .claim-h1{font-size:24px;font-weight:600;margin-bottom:8px;text-align:center;}
        .claim-sub{font-size:14px;color:#8a8680;text-align:center;margin-bottom:22px;line-height:1.6;}
        .offer-table{background:#1d2e1d;border:1px solid #2e4a2e;border-radius:10px;padding:16px 20px;margin-bottom:22px;}
        .orow{display:flex;justify-content:space-between;padding:7px 0;font-size:14px;border-bottom:1px solid #2a3a2a;}
        .orow:last-child{border-bottom:none;padding-top:12px;margin-top:4px;}
        .orow .lbl{color:#8a8680;}
        .orow .val{color:#5cb85c;font-weight:500;}
        .orow.total .lbl{color:#e8e4d9;font-size:15px;font-weight:500;}
        .orow.total .val{color:#e8e4d9;font-size:16px;font-weight:600;}
        .strikethrough{text-decoration:line-through;color:#4a4a46!important;font-weight:400!important;}
        .timer-text{font-size:12px;color:#4a4a46;text-align:center;margin-top:12px;}
        .timer-text span{color:#d4773a;font-weight:600;}
        .error-msg { color: #ef4444; font-size: 13px; margin-top: 4px; margin-bottom: 14px; display: none; background: #2e1818; border: 1px solid #4a2222; padding: 10px 12px; border-radius: 8px; }
        .error-msg.show { display: block; }
        .finput.error { border-color: #ef4444; }
        .checkbox-row.error label { color: #ef4444; }

        /* Chat Layout */
        .chat-layout{display:flex;height:100vh;background:#1a1a18;overflow:hidden;position:relative;}
        .chat-sidebar{width:256px;background:#111110;display:flex;flex-direction:column;border-right:1px solid #252522;flex-shrink:0;z-index:1000;}
        .sidebar-top{padding:12px;display:flex;align-items:center;justify-content:space-between;}
        .sidebar-logo{display:flex;align-items:center;gap:8px;}
        .sidebar-logo .star{color:#d4773a;font-size:17px;}
        .sidebar-logo span{font-size:16px;color:#e8e4d9;}
        .icon-btn{width:32px;height:32px;border-radius:7px;background:transparent;border:none;color:#6a6a60;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .15s;}
        .icon-btn:hover{background:#2a2a26;color:#e8e4d9;}
        .sidebar-new{margin:0 10px 8px;background:#2a2a26;border:1px solid #3a3a36;border-radius:8px;padding:9px 12px;color:#c8c4b9;font-size:13px;cursor:pointer;text-align:left;font-family:'Sora',sans-serif;display:flex;align-items:center;gap:8px;transition:background .15s;width:calc(100% - 20px);}
        .sidebar-new:hover{background:#333330;}
        .sidebar-sec{padding:6px 14px 4px;font-size:11px;color:#4a4a46;text-transform:uppercase;letter-spacing:.8px;}
        .sidebar-item{padding:8px 14px;font-size:13px;color:#7a7a76;cursor:pointer;border-radius:7px;margin:1px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .sidebar-item:hover{background:#2a2a26;color:#c8c4b9;}
        .sidebar-item.curr{background:#2a2a26;color:#e8e4d9;}
        .sidebar-foot{margin-top:auto;padding:10px;border-top:1px solid #252522;}
        .user-pill{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;}
        .user-pill:hover{background:#2a2a26;}
        .uavatar{width:30px;height:30px;border-radius:50%;background:#d4773a;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:600;flex-shrink:0;}
        .uinfo .uname{font-size:13px;color:#e8e4d9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;}
        .uinfo .uplan{font-size:11px;color:#5cb85c;}
        
        .chat-main{flex:1;display:flex;flex-direction:column;min-width:0;position:relative;}
        .chat-topbar{display:flex;align-items:center;gap:8px;padding:11px 18px;border-bottom:1px solid #252522;flex-shrink:0;}
        .hamburger { display: none; background: transparent; border: none; color: #8a8680; cursor: pointer; padding: 4px; margin-right: 8px; }
        .hamburger:hover { color: #e8e4d9; }
        .chat-title-txt{font-size:14px;color:#8a8680;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

        .chat-msgs{flex:1;overflow-y:auto;padding:28px 0;}
        .chat-msgs::-webkit-scrollbar{width:4px;}
        .chat-msgs::-webkit-scrollbar-thumb{background:#3a3a36;border-radius:2px;}
        .msg-wrap{max-width:740px;margin:0 auto;padding:0 24px;}
        .welcome-block{text-align:center;padding:56px 20px 28px;}
        .welcome-block h2{font-size:28px;font-weight:500;color:#e8e4d9;margin-bottom:8px;}
        .welcome-block p{font-size:14px;color:#6a6a60;line-height:1.7;}
        .wgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px;}
        .wcard{background:#242420;border:1px solid #333330;border-radius:10px;padding:14px;text-align:left;cursor:pointer;transition:border-color .15s;}
        .wcard:hover{border-color:#4a4a46;}
        .wcard-ico{font-size:18px;margin-bottom:8px;}
        .wcard-t{font-size:12.5px;color:#c8c4b9;font-weight:500;margin-bottom:3px;}
        .wcard-s{font-size:11.5px;color:#5a5a56;}
        
        select.finput {
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a8680%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat; background-position: right 14px top 50%; background-size: 10px auto; cursor: pointer;
        }
        select.finput option { background: #1e1e1c; color: #e8e4d9; }

        /* Input Bar */
        .input-outer { padding: 0 20px 24px; display: flex; flex-direction: column; align-items: center; }
        .input-box {
          width: 100%; max-width: 800px; background: #2d2d2a; border: 1px solid #3f3f3c; border-radius: 16px;
          display: flex; flex-direction: column; padding: 10px 14px 10px; transition: border-color 0.2s;
        }
        .input-box:focus-within { border-color: #6a6a60; }
        
        .chat-ta {
          width: 100%; background: transparent; border: none; outline: none; color: #e8e4d9; font-size: 15px;
          font-family: 'Sora', sans-serif; resize: none; min-height: 48px; padding: 6px 4px; line-height: 1.5;
          cursor: text;
        }
        .chat-ta::placeholder { color: #6a6a60; }
        
        .input-bottom-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        
        .plus-btn { color: #8a8680; background: transparent; border: none; font-size: 26px; font-weight: 300; cursor: pointer; padding: 0 6px; display: flex; align-items: center; }
        .plus-btn:hover { color: #e8e4d9; }
        .input-tools-right { display: flex; align-items: center; gap: 10px; }
        
        /* Dropdown */
        .model-sel { position: relative; }
        .model-btn-inline {
          background: transparent; border: none; color: #8a8680; font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 6px; cursor: pointer; font-family: 'Sora', sans-serif;
          padding: 4px 8px; border-radius: 6px;
        }
        .model-btn-inline:hover { background: #3a3a36; color: #c8c4b9; }
        .model-dd {
          position: absolute; bottom: calc(100% + 14px); right: -60px; min-width: 280px; padding: 8px;
          background: #242420; border: 1px solid #3a3a36; border-radius: 12px; box-shadow: 0 -8px 32px rgba(0,0,0,0.6); z-index: 200;
        }
        .model-dd.hide { display: none; }
        .dd-section { border-bottom: 1px solid #3a3a36; padding-bottom: 8px; margin-bottom: 8px; }
        .dd-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        .dd-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 8px; cursor: pointer; }
        .dd-item:hover { background: #2e2e2a; }
        .dd-item-left { display: flex; flex-direction: column; gap: 2px; }
        .dd-title { color: #e8e4d9; font-size: 13.5px; font-weight: 500; }
        .dd-sub { color: #8a8680; font-size: 11.5px; }
        .dd-check { color: #5cb85c; font-weight: bold; }
        .upgrade-badge { border: 1px solid #3a5a4a; color: #5cb85c; font-size: 10px; padding: 2px 8px; border-radius: 12px; }
        .new-chat-header { font-size: 11px; color: #8a8680; padding: 4px 12px 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .toggle-switch { position: relative; width: 34px; height: 20px; background: #2196f3; border-radius: 20px; }
        .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 16px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.2s; }
        .toggle-switch.off { background: #3a3a36; }
        .toggle-switch.off::after { left: 2px; }

        .voice-btn { color: #8a8680; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; padding: 4px; }
        .voice-btn:hover { color: #e8e4d9; }
        .send-btn { background: #d4773a; color: #fff; border: none; border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity 0.15s; }
        .send-btn:hover { opacity: 0.85; }
        .send-btn:disabled { background: transparent; color: #6a6a60; cursor: not-allowed; opacity: 1; }
        .disclaimer { text-align: center; font-size: 11px; color: #4a4a46; margin-top: 10px; }

        .msg-row{display:flex;gap:12px;margin-bottom:22px;align-items:flex-start;}
        .msg-row.urow{justify-content:flex-end;}
        .mavatar{width:28px;height:28px;border-radius:50%;background:#d4773a;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:600;flex-shrink:0;margin-top:2px;}
        .ububble{background:#2e2e2a;border-radius:18px 18px 4px 18px;padding:12px 16px;font-size:14px;color:#e8e4d9;max-width:500px;line-height:1.7;word-break:break-word;}
        .acontent{flex:1;min-width:0;}
        .aname{font-size:11px;color:#5a5a56;margin-bottom:5px;font-weight:500;letter-spacing:.3px;}
        .atext{font-size:14px;color:#e8e4d9;line-height:1.8;}
        .atext .fail-line{color:#ef4444;font-size:16px;font-weight:600;margin-bottom:10px;}
        .result-btn{display:inline-flex;align-items:center;gap:7px;background:#d4773a;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:13.5px;font-weight:600;cursor:pointer;margin-top:14px;font-family:'Sora',sans-serif;}
        .result-btn:hover{opacity:.85;}
        .typing-wrap{display:flex;gap:12px;align-items:flex-start;margin-bottom:22px;}
        .tdots{display:flex;gap:5px;align-items:center;padding:6px 0;}
        .tdots .d{width:7px;height:7px;border-radius:50%;background:#5a5a56;animation:bop 1.2s infinite;}
        .tdots .d:nth-child(2){animation-delay:.2s;}
        .tdots .d:nth-child(3){animation-delay:.4s;}
        @keyframes bop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}

        /* KTU */
        .ktu-page{font-family:Arial,sans-serif;background:#f0f2f5;min-height:100vh;color:#333;}
        .ktu-ticker{background:#6FACF5;color:#ffd700;font-size:12px;text-align:center;padding:5px;font-weight:bold;}
        .ktu-head{background:#fff;display:flex;align-items:center;gap:14px;padding:10px 18px;border-bottom:3px solid #6FACF5;flex-wrap:wrap;}
        .ktu-emblem{width:50px;height:50px;border-radius:50%;background:#6FACF5;display:flex;align-items:center;justify-content:center;color:#ffd700;font-size:9px;font-weight:bold;text-align:center;line-height:1.3;flex-shrink:0;}
        .ktu-head-title{font-size:16px;font-weight:bold;color:#6FACF5;}
        .ktu-head-sub{font-size:11px;color:#666;margin-top:2px;}
        .ktu-head-right{margin-left:auto;font-size:12px;color:#888;}
        .ktu-head-right strong{color:#333;}
        .ktu-head-right a{color:#6FACF5;text-decoration:none;margin-left:10px;cursor:pointer;}
        .ktu-head-right a.lo{color:#c62828;}
        .ktu-nav{background:#6FACF5;display:flex;flex-wrap:wrap;}
        .knav{color:#fff;font-size:12px;padding:10px 15px;cursor:pointer;border-right:1px solid #1976d2;white-space:nowrap;}
        .knav:hover,.knav.on{background:#6FACF5;}
        .ktu-body{display:flex;min-height:calc(100vh - 170px);}
        .ktu-side{width:190px;background:#fff;border-right:1px solid #ddd;flex-shrink:0;}
        .kside-hd{background:#6FACF5;color:#fff;font-size:12px;font-weight:bold;padding:9px 12px;}
        .kside-item{font-size:12px;padding:9px 12px;border-bottom:1px solid #eee;cursor:pointer;color:#333;display:flex;align-items:center;gap:7px;}
        .kside-item:hover{background:#e3f2fd;}
        .kside-item.on{background:#e3f2fd;color:#6FACF5;font-weight:bold;}
        .kside-dot{width:8px;height:8px;border-radius:50%;background:#ffd700;flex-shrink:0;}
        .ktu-content{flex:1;padding:16px 20px;background:#f0f2f5;overflow-x:auto;}
        .ksec-title{background:#4caf50;color:#fff;font-size:13px;font-weight:bold;padding:7px 14px;border-radius:3px;display:inline-block;margin-bottom:14px;}
        .kexport{float:right;background:#fff;border:1px solid #6FACF5;color:#6FACF5;border-radius:3px;padding:5px 13px;font-size:11px;cursor:pointer;}
        .kfilter{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
        .kfilter label{font-size:12px;color:#555;}
        .kfilter select{border:1px solid #ccc;border-radius:3px;padding:5px 8px;font-size:12px;color:#333;}
        .kfilter button{background:#6FACF5;color:#fff;border:none;border-radius:3px;padding:6px 16px;font-size:12px;cursor:pointer;}
        .kwarn{background:#fff3e0;border:1px solid #ffb74d;border-radius:3px;padding:9px 14px;font-size:12px;color:#e65100;margin-bottom:12px;font-weight:bold;}
        .kinfo{display:grid;grid-template-columns:1fr 1fr;background:#fff;border:1px solid #ddd;margin-bottom:12px;}
        .kcell{padding:8px 13px;font-size:12px;border:1px solid #ddd;}
        .kcell .il{color:#888;font-size:11px;margin-bottom:2px;}
        .kcell .iv{color:#222;font-weight:bold;}
        .ktbl{width:100%;border-collapse:collapse;background:#fff;font-size:12px;min-width:600px;}
        .ktbl th{background:#6FACF5;color:#fff;padding:9px 11px;text-align:left;font-size:11px;}
        .ktbl td{padding:8px 11px;border-bottom:1px solid #eee;color:#333;}
        .ktbl tr:nth-child(even) td{background:#f9f9f9;}
        .ktbl tr:hover td{background:#e3f2fd;}
        .fg{color:#c62828;font-weight:bold;}
        .ktbl tfoot td{font-weight:bold;border-top:2px solid #ddd;}
        .kerr{background:#ffebee;border:1px solid #ef9a9a;border-radius:3px;padding:11px 14px;font-size:13px;color:#b71c1c;text-align:center;font-weight:bold;margin-top:12px;}
        .kfoot{background:#6FACF5;color:#aaa;font-size:11px;text-align:center;padding:10px;}

        @media (max-width: 768px) {
          .cl-card { padding: 24px 20px; }
          .offer-h1 { font-size: 24px; }
          .chat-sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.3s ease; }
          .chat-sidebar.open { transform: translateX(0); }
          .hamburger { display: block; }
          .chat-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; }
          .chat-overlay.show { display: block; }
          .wgrid { grid-template-columns: 1fr; }
          .msg-wrap { padding: 0 16px; }
          .input-outer { padding: 0 10px 16px; }
          .model-dd { right: -10px; min-width: 250px; }
          .ktu-body { flex-direction: column; }
          .ktu-side { width: 100%; display: flex; overflow-x: auto; white-space: nowrap; align-items: center; border-right: none; border-bottom: 1px solid #ddd; }
          .kside-item { flex-shrink: 0; border-bottom: none; border-right: 1px solid #eee; }
          .kside-hd { padding: 9px 12px; }
          .kinfo { grid-template-columns: 1fr; }
          .ktu-head { flex-direction: column; align-items: flex-start; }
          .ktu-head-right { margin-left: 0; margin-top: 10px; }
        }
      `}</style>

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-star">✳</div>
          <div className="loading-text">Processing...</div>
        </div>
      )}

      {/* P1: OFFER */}
      <div className={`page ${activePage === 'p1' ? 'active' : ''}`}>
        <div className="cl-wrap">
          <div className="cl-logo"><span className="cl-star">✳</span><span className="cl-logo-text">Claude</span></div>
          <div className="cl-card">
            <div className="offer-badge">🎁 Limited Time — Beta Program</div>
            <h1 className="offer-h1">Get Claude Pro completely free for 1 full year</h1>
            <p className="offer-sub">Anthropic is granting select users a complimentary 1-year Claude Pro subscription as part of a closed beta. No credit card. No catch. Slots are extremely limited.</p>
            <div className="perks">
              <div className="perk"><div className="perk-icon">⚡</div><div className="perk-body"><strong>Priority access</strong> — fastest models including Claude Opus 4, no queues ever</div></div>
              <div className="perk"><div className="perk-icon">∞</div><div className="perk-body"><strong>5× more usage</strong> — send as many messages as you want, no daily cap</div></div>
              <div className="perk"><div className="perk-icon">🧠</div><div className="perk-body"><strong>Extended context</strong> — analyse entire codebases, documents, and research papers</div></div>
              <div className="perk"><div className="perk-icon">🔒</div><div className="perk-body"><strong>No credit card required</strong> — completely free, cancel anytime</div></div>
            </div>
            <button className="btn-primary" onClick={() => navigate('p2')}>Register Now — It's Free →</button>
            <p className="slots-note">⏰ Only <span>47</span> slots remaining today</p>
          </div>
        </div>
      </div>

      {/* P2: REGISTER */}
      <div className={`page ${activePage === 'p2' ? 'active' : ''}`}>
        <div className="cl-wrap">
          <div className="cl-logo"><span className="cl-star">✳</span><span className="cl-logo-text">Claude</span></div>
          <div className="cl-card">
            <div className="steps"><div className="sdot on"></div><div className="sdot on"></div><div className="sdot"></div></div>
            <h1 className="reg-h1">Let's create your account</h1>
            <p className="reg-sub">Tell us a bit about yourself so we can personalise your free Pro experience.</p>
            
            <div className="fgroup">
              <label className="flabel">What is your name?</label>
              <input className={`finput ${regError.name ? 'error' : ''}`} type="text" placeholder="Your full name" autoComplete="off" value={userName} onChange={(e) => { setUserName(e.target.value); setRegError(prev => ({...prev, name: false, show: false})) }} />
            </div>
            <div className="fgroup">
              <label className="flabel">Age</label>
              <input className={`finput ${regError.age ? 'error' : ''}`} type="number" placeholder="e.g. 21" min="13" max="99" value={userAge} onChange={(e) => { setUserAge(e.target.value); setRegError(prev => ({...prev, age: false, show: false})) }} />
            </div>
            <div className="fgroup">
              <label className="flabel">What are your interests?</label>
              <div className="chips">
                {['Coding', 'Engineering', 'Music', 'Gaming', 'Writing', 'Science', 'Design', 'Finance'].map(chip => (
                  <div key={chip} className={`chip ${selectedChips.includes(chip) ? 'sel' : ''}`} onClick={() => toggleChip(chip)}>{chip}</div>
                ))}
              </div>
            </div>
            
            <div style={{marginTop: '20px'}}>
              <div className={`checkbox-row ${regError.terms ? 'error' : ''}`}>
                <input type="checkbox" id="ck1" checked={termsAgreed} onChange={(e) => { setTermsAgreed(e.target.checked); setRegError(prev => ({...prev, terms: false, show: false})) }} />
                <label htmlFor="ck1">I agree to Anthropic's <a href="#">Consumer Terms and Acceptable Use Policy</a> and confirm that I am at least 18 years of age.</label>
              </div>
              <div className={`checkbox-row ${regError.privacy ? 'error' : ''}`}>
                <input type="checkbox" id="ck2" checked={privacyAgreed} onChange={(e) => { setPrivacyAgreed(e.target.checked); setRegError(prev => ({...prev, privacy: false, show: false})) }} />
                <label htmlFor="ck2">I consent to collection and use of my personal information in accordance with the <a href="#">Privacy Policy</a>.</label>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" id="ck3" checked={promoAgreed} onChange={(e) => setPromoAgreed(e.target.checked)} />
                <label htmlFor="ck3">Subscribe to occasional promotional emails. You can opt out any time.</label>
              </div>
            </div>
            
            <div className={`error-msg ${regError.show ? 'show' : ''}`}>{regError.text}</div>
            <button className="btn-primary" onClick={handleRegister} style={{marginTop: '8px'}}>Continue</button>
          </div>
        </div>
      </div>

      {/* P3: CLAIM */}
      <div className={`page ${activePage === 'p3' ? 'active' : ''}`}>
        <div className="cl-wrap">
          <div className="cl-logo"><span className="cl-star">✳</span><span className="cl-logo-text">Claude</span></div>
          <div className="cl-card">
            <div className="confetti">🎉🎊🎁</div>
            <h1 className="claim-h1">You're in, <span>{userName || 'friend'}</span>!</h1>
            <p className="claim-sub">Your free 1-year Claude Pro slot is reserved. Click below to activate it — no payment needed.</p>
            <div className="offer-table">
              <div className="orow"><span className="lbl">Plan</span><span className="val">Claude Pro</span></div>
              <div className="orow"><span className="lbl">Duration</span><span className="val">12 months</span></div>
              <div className="orow"><span className="lbl">Normal price</span><span className="val strikethrough">$20 / month × 12</span></div>
              <div className="orow"><span className="lbl">Beta discount</span><span className="val">100% OFF</span></div>
              <div className="orow total"><span className="lbl">You pay today</span><span className="val">$0.00 🎉</span></div>
            </div>
            <button className="btn-primary" onClick={() => navigate('p-college')}>✨ Claim My Free Claude Pro Now</button>
            <p className="timer-text">Your slot expires in <span>{formatTime(timeLeft)}</span></p>
          </div>
        </div>
      </div>

      {/* P-COLLEGE: VERIFICATION */}
      <div className={`page ${activePage === 'p-college' ? 'active' : ''}`}>
        <div className="cl-wrap">
          <div className="cl-logo"><span className="cl-star">✳</span><span className="cl-logo-text">Claude</span></div>
          <div className="cl-card">
            <h1 className="reg-h1">Student Verification</h1>
            <p className="reg-sub">As part of the beta program, we need to verify your academic institution to grant you the extended context window.</p>
            
            <div className="fgroup">
              <label className="flabel">College / University Name</label>
              <input className={`finput ${colError.college ? 'error' : ''}`} type="text" placeholder="e.g. Government Engineering College" autoComplete="off" value={collegeName} onChange={(e) => { setCollegeName(e.target.value); setColError(prev => ({...prev, college: false, show: false})) }} />
            </div>
            
            <div className="fgroup">
              <label className="flabel">Current Semester</label>
              <select className={`finput ${colError.sem ? 'error' : ''}`} value={currentSem} onChange={(e) => { setCurrentSem(e.target.value); setColError(prev => ({...prev, sem: false, show: false})) }}>
                <option value="" disabled>Select your current semester</option>
                <option value="S2">Semester 2</option>
                <option value="S4">Semester 4</option>
                <option value="S6">Semester 6</option>
                <option value="S8">Semester 8</option>
              </select>
            </div>

            <div className={`error-msg ${colError.show ? 'show' : ''}`}>{colError.text}</div>
            <button className="btn-primary" onClick={handleVerifyCollege} style={{marginTop: '8px'}}>Verify & Activate Pro →</button>
          </div>
        </div>
      </div>

      {/* === PRANK OVERLAY / POPUP === */}
      {showPrankPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#242420', border: '1px solid #3a3a36',
            padding: '40px 30px', borderRadius: '16px', maxWidth: '400px', width: '90%',
            textAlign: 'center', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <button
              onClick={() => { 
                setShowPrankPopup(false); 
                setPrankResolved(true); // <--- THIS UNLOCKS THE CHAT
                setIsDodging(false); // Reset dodge state for next time
              }}
              style={{
                position: 'absolute', top: '12px', right: '16px',
                background: 'transparent', border: 'none', color: '#8a8680',
                fontSize: '24px', cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            <h2 style={{ color: '#e8e4d9', fontSize: '20px', lineHeight: '1.5', marginBottom: '24px' }}>
              {prankPhase === 0 
                ? "Bro are you for real you dont even know to prompt .Try again" 
                : " U dont even know to press button 😑😑"}
            </h2>
            
            <button
              onMouseEnter={dodgePrankButton}
              onClick={dodgePrankButton}
              style={{
                position: isDodging ? 'fixed' : 'relative',
                top: isDodging ? prankBtnPos.top : 'auto',
                left: isDodging ? prankBtnPos.left : 'auto',
                transform: isDodging ? 'translate(-50%, -50%)' : 'none',
                backgroundColor: '#d4773a', color: '#fff', border: 'none',
                padding: '12px 24px', borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer', transition: 'top 0.2s ease, left 0.2s ease',
                zIndex: 10001
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* P4: FAKE CLAUDE CHAT */}
      <div className={`page ${activePage === 'p4' ? 'active' : ''}`}>
        <div className="chat-layout">
          <div className={`chat-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
          <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-top">
              <div className="sidebar-logo"><span className="star">✳</span><span>Claude</span></div>
              <button className="icon-btn" title="New chat" onClick={() => setSidebarOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
            <button className="sidebar-new">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>
              New chat
            </button>
            <div className="sidebar-sec">Today</div>
            <div className="sidebar-item curr">Your first chat with Claude</div>
            <div className="sidebar-foot">
              <div className="user-pill">
                <div className="uavatar">{userName ? userName.charAt(0).toUpperCase() : '?'}</div>
                <div className="uinfo">
                  <div className="uname">{userName || 'User'}</div>
                  <div className="uplan">✦ Claude Pro</div>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-main">
            <div className="chat-topbar">
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              </button>
              <span className="chat-title-txt">Your first chat with Claude</span>
            </div>

            <div className="chat-msgs">
              {messages.length === 0 && (
                <div className="msg-wrap">
                  <div className="welcome-block">
                    <h2>Welcome, <span>{userName || 'there'}</span>! I'm Claude.</h2>
                    <p>Your Pro plan is now active.<br/>Bring me anything — a tough problem, a half-formed idea, something you need to write.</p>
                    <div className="wgrid">
                      <div className="wcard" onClick={() => prankResolved ? handleSendChat('Help me plan a study schedule for my semester exams') : handleChatInteraction()}>
                        <div className="wcard-ico">📅</div>
                        <div className="wcard-t">Plan a study schedule</div>
                        <div className="wcard-s">Organise your revision</div>
                      </div>
                      <div className="wcard" onClick={() => prankResolved ? handleSendChat('Explain data structures and algorithms simply') : handleChatInteraction()}>
                        <div className="wcard-ico">🧠</div>
                        <div className="wcard-t">Understand a concept</div>
                        <div className="wcard-s">DSA, theory, maths…</div>
                      </div>
                      <div className="wcard" onClick={() => prankResolved ? handleSendChat('Write code for a linked list in C++') : handleChatInteraction()}>
                        <div className="wcard-ico">💻</div>
                        <div className="wcard-t">Write some code</div>
                        <div className="wcard-s">Any language, any problem</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className="msg-wrap">
                  {msg.sender === 'user' ? (
                    <div className="msg-row urow">
                      <div className="ububble">{msg.text}</div>
                    </div>
                  ) : (
                    <div className="msg-row">
                      <div className="mavatar">C</div>
                      <div className="acontent">
                        <div className="aname">Claude</div>
                        <div className="atext">
                          <div className="fail-line">🚫 U are not worthy of using Claude.</div>
                          You are <strong style={{color:'#ef4444'}}>dumb</strong> and you have <strong style={{color:'#ef4444'}}>failed every single subject</strong>. I'd suggest closing this tab and opening your textbooks instead. 😬<br/><br/>
                          <button className="result-btn" onClick={() => navigate('p5')}>📄 View Your Result</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="msg-wrap">
                  <div className="msg-row typing-wrap">
                    <div className="mavatar">C</div>
                    <div className="tdots"><div className="d"></div><div className="d"></div><div className="d"></div></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-outer">
              <div className="input-box">
                {/* Textarea respects the resolved state */}
                <textarea 
                  className="chat-ta" 
                  placeholder="Reply..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  readOnly={!prankResolved}
                  onClick={prankResolved ? undefined : handleChatInteraction}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey && prankResolved) { e.preventDefault(); handleSendChat(); } }}
                />
                <div className="input-bottom-row">
                  <button className="plus-btn" title="Add attachment" onClick={prankResolved ? undefined : handleChatInteraction}>+</button>
                  <div className="input-tools-right">
                    <div className="model-sel">
                      <button className="model-btn-inline" onClick={() => setModelOpen(!modelOpen)}>
                        <span>{selectedModel.name} {isExtended ? 'Extended' : ''}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <div className={`model-dd ${!modelOpen ? 'hide' : ''}`}>
                        <div className="dd-section">
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Sonnet 4.6'}); setModelOpen(false); }}>
                            <div className="dd-item-left"><span className="dd-title">Sonnet 4.6</span><span className="dd-sub">Most efficient for everyday tasks</span></div>
                            {selectedModel.name === 'Sonnet 4.6' && <span className="dd-check">✓</span>}
                          </div>
                          <div className="dd-item" onClick={(e) => { e.stopPropagation(); setIsExtended(!isExtended); setModelOpen(false); }}>
                            <div className="dd-item-left"><span className="dd-title">Extended thinking</span><span className="dd-sub">Think longer for complex tasks</span></div>
                            <div className={`toggle-switch ${!isExtended ? 'off' : ''}`}></div>
                          </div>
                          <div className="dd-item"><span className="dd-title">More models</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8680" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></div>
                        </div>
                        <div className="dd-section">
                          <div className="new-chat-header">Start a new chat</div>
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Opus 4.6'}); setModelOpen(false); }}><span className="dd-title">Opus 4.6</span><span className="upgrade-badge">Upgrade</span></div>
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Haiku 4.5'}); setModelOpen(false); }}><span className="dd-title">Haiku 4.5</span></div>
                        </div>
                        <div className="dd-section">
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Opus 4.5'}); setModelOpen(false); }}><span className="dd-title">Opus 4.5</span><span className="upgrade-badge">Upgrade</span></div>
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Opus 3'}); setModelOpen(false); }}><span className="dd-title">Opus 3</span><span className="upgrade-badge">Upgrade</span></div>
                          <div className="dd-item" onClick={() => { setSelectedModel({name: 'Sonnet 4.5'}); setModelOpen(false); }}><span className="dd-title">Sonnet 4.5</span></div>
                        </div>
                      </div>
                    </div>
                    <button className="voice-btn" title="Voice Input" onClick={prankResolved ? undefined : handleChatInteraction}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="16" y1="10" x2="16" y2="14"></line><line x1="4" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="20" y2="12"></line></svg>
                    </button>
                    <button className="send-btn" disabled={prankResolved && !chatInput.trim()} onClick={prankResolved ? () => handleSendChat() : handleChatInteraction} title="Send">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="disclaimer">Claude can make mistakes. Consider checking important information.</div>
            </div>
          </div>
        </div>
      </div>

      {/* P5: FAKE KTU */}
      <div className={`page ${activePage === 'p5' ? 'active' : ''}`}>
        <div className="ktu-page">
          <div className="ktu-ticker">Your contact number for support from University is : 9188022724</div>
          <div className="ktu-head">
            <div className="ktu-emblem">APJ<br/>KTU</div>
            <div>
              <div className="ktu-head-title">APJ Abdul Kalam Technological University</div>
              <div className="ktu-head-sub">Result Management System</div>
            </div>
            <div className="ktu-head-right">
              Welcome: <strong>{userName.toUpperCase() || 'USER'}</strong>
              <a href="#" onClick={(e) => e.preventDefault()}>⚙ Change Password</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="lo">⏻ Logout</a>
            </div>
          </div>
          <div className="ktu-nav">
            <div className="knav">Home</div><div className="knav">Student</div><div className="knav">Exam</div>
            <div className="knav on">Result</div><div className="knav">Grievance Redressal Tickets</div>
            <div className="knav">Forms</div><div className="knav">Tutorials</div>
          </div>
          <div className="ktu-body">
            <div className="ktu-side">
              <div className="kside-hd">Result Management</div>
              <div className="kside-item on"><span className="kside-dot"></span>Semester Grade Card</div>
              <div className="kside-item"><span className="kside-dot"></span>Exam Grade Change Request</div>
              <div className="kside-item"><span className="kside-dot"></span>Pending Results</div>
              <div className="kside-item"><span className="kside-dot"></span>Request Low Pass Credit</div>
              <div className="kside-item"><span className="kside-dot"></span>Reports</div>
            </div>
            <div className="ktu-content">
              <button className="kexport">⬇ Export</button>
              <div className="ksec-title">Semester Grade Card</div>
              <div className="kfilter">
                <label>Semester</label>
                <select value={ktuData.targetSem} readOnly><option>{ktuData.targetSem}</option></select>
                <button>Search</button>
              </div>
              <div className="kwarn">⚠ RESULT NOTICE: You have FAILED multiple subjects in {ktuData.targetSem}. Please contact your academic advisor immediately.</div>
              <div className="kinfo">
                <div className="kcell"><div className="il">Name</div><div className="iv">{userName.toUpperCase() || 'USER'}</div></div>
                <div className="kcell"><div className="il">Register Number</div><div className="iv">{ktuData.regNum || 'TCR2CS023'}</div></div>
                <div className="kcell"><div className="il">Name of College</div><div className="iv">{collegeName.toUpperCase() || 'GOVERNMENT ENGINEERING COLLEGE THRISSUR'}</div></div>
                <div className="kcell"><div className="il">Branch</div><div className="iv">COMPUTER SCIENCE & ENGINEERING</div></div>
                <div className="kcell"><div className="il">Semester</div><div className="iv">{ktuData.targetSem}</div></div>
                <div className="kcell"><div className="il">Month & Year of Examination</div><div className="iv">November 2025</div></div>
              </div>
              <table className="ktbl">
                <thead><tr><th>Course Name</th><th>Code</th><th>Grade</th><th>Credits Earned</th><th>Month & Year of Examination</th></tr></thead>
                <tbody>
                  {ktuData.subjects.map(sub => (
                    <tr key={sub.code}>
                      <td>{sub.name}</td>
                      <td>{sub.code}</td>
                      <td className="fg">F</td>
                      <td>0.0</td>
                      <td>November 2025</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan="2">Total Earned Credits</td><td className="fg">0</td><td colSpan="2"></td></tr>
                  <tr><td colSpan="2">Total Credits in the Semester</td><td>{ktuData.subjects.length * 3}</td><td colSpan="2"></td></tr>
                  <tr><td colSpan="2">SGPA</td><td className="fg">0.0</td><td colSpan="2"></td></tr>
                  <tr><td colSpan="2">CGPA</td><td className="fg">0.0</td><td colSpan="2"></td></tr>
                </tfoot>
              </table>
              <div className="kerr">❌ FAILED ALL SUBJECTS — {ktuData.targetSem} Result: DETAINED. Please report to the college office.</div>
            </div>
          </div>
          <div className="kfoot">APJ Abdul Kalam Technological University | Result Management Portal | © 2025 | All Rights Reserved</div>
        </div>
      </div>
    </>
  );
}