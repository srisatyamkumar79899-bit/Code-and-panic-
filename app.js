
const roleDefaults = {
  "Statistician": {
    dept:"Ministry of Statistics & Programme Implementation",
    future:["Advanced Data Analytics","AI / ML for Statistics","Cloud Computing","Data Visualization"],
    current:[
      ["Survey Design",74],["Sampling",68],["Python",56],["SQL",49],
      ["Data Visualization",63],["Data Quality",71]
    ]
  },
  "Data Analyst": {
    dept:"Ministry of Statistics & Programme Implementation",
    future:["AI-Assisted Analytics","Advanced SQL","Cloud Data Platforms","GIS & Open Data"],
    current:[
      ["Data Visualization",76],["SQL",69],["Python",61],["Survey Design",44],
      ["GIS",38],["Data Quality",66]
    ]
  },
  "Assistant Director": {
    dept:"Ministry of Statistics & Programme Implementation",
    future:["Predictive Analytics","Digital Governance","AI Strategy","Advanced Data Quality"],
    current:[
      ["Survey Design",82],["Data Quality",79],["Leadership",71],["AI/ML",42],
      ["Cloud Computing",35],["Cybersecurity",51]
    ]
  }
};

const courses = [
  {title:"Python for Official Statistics",domain:"Technical",level:"Intermediate",hours:"6 hrs",theme:"blue"},
  {title:"Survey Design & Sampling",domain:"Statistical",level:"Foundation",hours:"5 hrs",theme:"orange"},
  {title:"Data Visualization for Policy",domain:"Technical",level:"Intermediate",hours:"4 hrs",theme:"green"},
  {title:"AI & Machine Learning Basics",domain:"Future Skill",level:"Foundation",hours:"7 hrs",theme:"blue"},
  {title:"Data Privacy & Cybersecurity",domain:"Digital Governance",level:"Foundation",hours:"3 hrs",theme:"orange"},
  {title:"GIS & Open Data",domain:"Technical",level:"Intermediate",hours:"5 hrs",theme:"green"}
];

let state = {
  screen:"login", authMode:"login", user:null, assessmentDone:false, quizIndex:0, score:0, selected:null
};

const DEMO_EMAIL = "ananya.sharma@gov.in";
const DEMO_PASSWORD = "demo1234";

function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function initials(name){return name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}
function defaultUser(){
  return {name:"Ananya Sharma", role:"Statistician", dept:roleDefaults["Statistician"].dept, org:"National Statistical Office", experience:"6 years", email:"ananya.sharma@gov.in"};
}
state.user = defaultUser();

function layout(content, active="home"){
  const nav = [
    ["home","⌂","Home"],["learning","▣","My Learning"],["competencies","◉","Competencies"],
    ["gaps","△","Skill Gaps"],["recommendations","★","Recommended Courses"],
    ["assessment","✓","Assessment"],["progress","↗","Progress"],["profile","○","Profile"]
  ];
  return `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand"><div class="brand-mark">SI</div><div><strong>Skill Intelligence Platform</strong><span>Official Statistics • Government Learning</span></div></div>
      <div class="actions"><span class="gov-chip">Secure Government Portal</span><button class="btn btn-secondary" onclick="logout()">Logout</button></div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <div class="nav-title">Employee Portal</div>
        ${nav.map(([id,ico,label])=>`<button class="nav-btn ${active===id?'active':''}" onclick="navigate('${id}')"><span class="ico">${ico}</span>${label}</button>`).join("")}
        <div class="side-bottom"><strong>Role-based recommendations</strong><br><small>Your registered department and designation set the initial learning framework.</small></div>
      </aside>
      <main class="content">${content}</main>
    </div>
  </div>`;
}

function render(){
  const app=document.getElementById("app");
  let html="";
  if(state.screen==="login") html=renderAuth(false);
  else if(state.screen==="register") html=renderAuth(true);
  else if(state.screen==="home") html=layout(renderHome(),"home");
  else if(state.screen==="learning") html=layout(renderLearning(),"learning");
  else if(state.screen==="competencies") html=layout(renderCompetencies(),"competencies");
  else if(state.screen==="gaps") html=layout(renderGaps(),"gaps");
  else if(state.screen==="recommendations") html=layout(renderRecommendations(),"recommendations");
  else if(state.screen==="assessment") html=layout(renderAssessment(),"assessment");
  else if(state.screen==="progress") html=layout(renderProgress(),"progress");
  else if(state.screen==="profile") html=layout(renderProfile(),"profile");
  else if(state.screen==="admin") html=layout(renderAdmin(),"home");
  app.innerHTML=html;
}

function renderAuth(register=false){
  if(register){
    return `<div class="auth-wrap">
      <section class="auth-left">
        <div class="brand"><div class="brand-mark">SI</div><div><strong>Government Skill Intelligence</strong><span>Official Statistics learning platform</span></div></div>
        <h1>Build the right skills for your <span>current role</span> and future.</h1>
        <p>Register with your department and designation. The platform will create a role-based competency baseline, show expected future skills, and guide your personalized learning journey.</p>
        <div class="auth-points">
          <div class="auth-point"><span class="dot"></span><div><strong>Role-based baseline</strong><br><span class="small">Initial competencies and expected skills are shown from your role.</span></div></div>
          <div class="auth-point"><span class="dot"></span><div><strong>Assessment-led personalization</strong><br><span class="small">Complete one assessment to refine your skill gaps and course recommendations.</span></div></div>
          <div class="auth-point"><span class="dot"></span><div><strong>Future-ready learning</strong><br><span class="small">Learning paths consider future requirements and emerging technologies.</span></div></div>
        </div>
      </section>
      <section class="auth-right">
        <div class="auth-box register-card register-shell">
          <div class="auth-logo"><div><h2 style="margin:0">Register</h2><div class="small">Create your government learning profile</div></div><div class="mark">SI</div></div>
          <div class="stepper"><div class="step active"><span class="step-dot">1</span> Details</div><div class="step-line"></div><div class="step"><span class="step-dot">2</span> Verify</div></div>
          <form onsubmit="registerUser(event)">
            <div class="form-grid">
              <div class="field"><label>Centre / State</label><select id="regType"><option>Centre</option><option>State</option></select></div>
              <div class="field"><label>Ministry / Department *</label><select id="regDept"><option>Ministry of Statistics & Programme Implementation</option><option>Ministry of Finance</option><option>Ministry of Agriculture</option><option>Other Government Department</option></select></div>
              <div class="field"><label>Organisation *</label><input id="regOrg" value="National Statistical Office" required></div>
              <div class="field"><label>Designation / Job Role *</label><select id="regRole"><option>Statistician</option><option>Data Analyst</option><option>Assistant Director</option></select></div>
              <div class="field"><label>Full Name *</label><input id="regName" placeholder="Enter employee name" required></div>
              <div class="field"><label>Government Email *</label><input id="regEmail" type="email" placeholder="name@gov.in" required></div>
              <div class="field"><label>Experience</label><input id="regExp" placeholder="e.g. 6 years"></div>
              <div class="field"><label>Password *</label><input id="regPass" type="password" placeholder="Create password" required></div>
            </div>
            <div class="status-bar" style="margin-top:18px">Your role and department will determine the initial competency framework and future skill set.</div>
            <button class="btn btn-primary" style="width:100%">Create Account & Continue</button>
          </form>
          <p class="auth-note">Already have an account? <button class="link" onclick="state.screen='login';render()">Sign in here</button></p>
        </div>
      </section>
    </div>`;
  }
  return `<div class="auth-wrap">
    <section class="auth-left">
      <div class="brand"><div class="brand-mark">SI</div><div><strong>Skill Intelligence Platform</strong><span>Official Statistics • Karmayogi-ready</span></div></div>
      <h1>Welcome to your <span>future-ready</span> learning journey.</h1>
      <p>Assess your competencies, understand your skill gaps, and continue with learning recommendations relevant to your role, department and future requirements.</p>
      <div class="auth-points">
        <div class="auth-point"><span class="dot"></span><div><strong>Current competencies</strong><br><span class="small">See your initial competency profile as soon as you register.</span></div></div>
        <div class="auth-point"><span class="dot"></span><div><strong>Future skill requirements</strong><br><span class="small">View the future-ready skills expected for your role.</span></div></div>
        <div class="auth-point"><span class="dot"></span><div><strong>Personalized courses</strong><br><span class="small">Complete the assessment to make course recommendations more precise.</span></div></div>
      </div>
    </section>
    <section class="auth-right">
      <div class="auth-box">
        <div class="auth-logo"><div><div class="small">Government Learning Portal</div><h2 style="margin:4px 0 0">Sign in</h2></div><div class="mark">SI</div></div>
        <div class="auth-tabs"><button class="tab ${state.authMode==='login'?'active':''}" onclick="state.authMode='login';render()">Login with Password</button><button class="tab ${state.authMode==='otp'?'active':''}" onclick="state.authMode='otp';render()">Login with OTP</button></div>
        <form onsubmit="loginUser(event)">
          <div class="field"><label>Government Email</label><input id="loginEmail" type="email" placeholder="name@gov.in" value="ananya.sharma@gov.in" required></div>
          ${state.authMode==='login'?`<div class="field" style="margin-top:14px"><label>Password</label><input id="loginPass" type="password" placeholder="Enter password" value="demo1234" required></div>`:`<div class="field" style="margin-top:14px"><label>Mobile / OTP</label><input id="loginOtp" placeholder="Enter OTP" value="123456" required></div>`}
          <div class="recaptcha"><span class="checkbox"></span><strong>I'm not a robot</strong><span style="margin-left:auto;font-size:11px;color:#778; text-align:center">reCAPTCHA<br><small>demo</small></span></div>
          <button class="btn btn-primary" style="width:100%">Login</button>
        </form>
        <div style="margin-top:18px;text-align:center">New employee? <button class="link" onclick="state.screen='register';render()">Register</button></div>
        <div style="display:flex;gap:10px;margin-top:18px"><button class="btn btn-secondary" style="flex:1" onclick="demoEmployee()">Demo Employee</button><button class="btn btn-secondary" style="flex:1" onclick="demoAdmin()">Demo Admin</button></div>
      </div>
    </section>
  </div>`;
}

function loginUser(e){
  if(e) e.preventDefault();
  try {
    const email=(document.getElementById("loginEmail")?.value || DEMO_EMAIL).trim();
    if(state.authMode === "otp"){
      const otp=(document.getElementById("loginOtp")?.value || "").trim();
      if(otp !== "123456"){ toast("For demo login, use OTP 123456"); return false; }
    } else {
      const password=(document.getElementById("loginPass")?.value || "").trim();
      if(email.toLowerCase()===DEMO_EMAIL && password!==DEMO_PASSWORD){
        toast("Demo password is demo1234"); return false;
      }
    }
    state.user={...defaultUser(),email};
    state.screen="home";
    toast("Logged in successfully");
    render();
    return false;
  } catch(err) {
    console.error(err);
    toast("Login could not be completed");
    return false;
  }
}
function demoEmployee(){state.user=defaultUser();state.assessmentDone=false;state.quizIndex=0;state.score=0;state.selected=null;state.screen="home";render();}
function demoAdmin(){state.user={...defaultUser(),name:"Admin User",role:"Administrator"};state.screen="admin";render()}
function registerUser(e){
  e.preventDefault();
  const role=document.getElementById("regRole").value;
  const d=roleDefaults[role];
  state.user={
    name:document.getElementById("regName").value,
    role,
    dept:document.getElementById("regDept").value || d.dept,
    org:document.getElementById("regOrg").value,
    experience:document.getElementById("regExp").value || "Not specified",
    email:document.getElementById("regEmail").value
  };
  state.assessmentDone=false;
  state.screen="home";
  toast("Account created. Your role-based learning profile is ready.");
  render();
}
function logout(){state.user=null;state.screen="login";state.authMode="login";state.assessmentDone=false;state.quizIndex=0;state.score=0;state.selected=null;render()}

function navigate(id){state.screen=id;render();window.scrollTo(0,0)}

function roleData(){return roleDefaults[state.user.role]||roleDefaults["Statistician"]}

function renderHome(){
  const d=roleData();
  const future=d.future.slice(0,3);
  return `
  <div class="page-head"><div><h1>Welcome back, ${escapeHtml(state.user.name)}</h1><p>${escapeHtml(state.user.role)} • ${escapeHtml(state.user.dept)}</p></div><div class="actions"><button class="btn btn-secondary" onclick="navigate('profile')">View Profile</button><button class="btn btn-primary" onclick="navigate('assessment')">${state.assessmentDone?'View Assignment Result':'Complete Your Competency Assignment'}</button></div></div>
  <div class="banner">
    <div><h2>${state.assessmentDone?'Your recommendations are now personalized.':'Complete your competency assignment'}</h2>
    <p>${state.assessmentDone?'Your completed assignment has updated your competency profile and course recommendations.':'Complete the assignment to understand your current competency level and automatically receive learning recommendations for your role.'}</p></div>
    <button class="btn btn-orange" onclick="navigate('assessment')">${state.assessmentDone?'Review Result':'Complete Assignment'}</button>
  </div>

  <div class="grid grid-3">
    <div class="card metric"><div class="label">Current Competency</div><div class="value">${currentCompetencyScore()}%</div><div class="sub">${state.assessmentDone?'Updated from assignment':'Role-based baseline'}</div></div>
    <div class="card metric"><div class="label">Recommended Courses</div><div class="value">${recommendedCourses().length}</div><div class="sub">Personalized for your role</div></div>
    <div class="card metric"><div class="label">Learning Progress</div><div class="value">42%</div><div class="sub">12.5 learning hours</div></div>
  </div>

  <div class="section-title"><h2>Future skill requirements</h2><button class="link" onclick="navigate('competencies')">Explore</button></div>
  <div class="grid grid-3">${future.map((x,i)=>`<div class="card"><span class="badge badge-orange">Future Skill</span><h3 style="margin-top:12px">${x}</h3><p>${['Build this skill for upcoming responsibilities in your role.','Strengthen this capability for future statistical and digital work.','Develop this skill to stay ready for emerging requirements.'][i]}</p></div>`).join("")}</div>

  <div class="section-title"><h2>Recommended courses</h2><button class="link" onclick="navigate('recommendations')">View all</button></div>
  <div class="course-row">${recommendedCourses().slice(0,4).map(courseCard).join("")}</div>
  `;
}

function currentCompetencyScore(){
  if(!state.assessmentDone) return 68;
  return Math.round(60 + (state.score / quiz.length) * 40);
}

function recommendedCourses(){
  if(!state.assessmentDone) return courses.slice(0,4);

  const d=roleData();
  const weakTopics = [];
  if(state.score < 4) weakTopics.push('SQL','Data Quality');
  if(state.score < 3) weakTopics.push('AI','Cloud','GIS');
  if(state.score <= 2) weakTopics.push('Survey');

  return courses.slice().sort((a,b)=>{
    const score=(course)=>{
      const text=(course.title+' '+course.domain+' '+course.level).toLowerCase();
      return weakTopics.reduce((n,t)=>n+(text.includes(t.toLowerCase())?4:0),0)
        + d.future.reduce((n,t)=>n+(text.includes(t.split(' ')[0].toLowerCase())?2:0),0);
    };
    return score(b)-score(a);
  }).slice(0,6);
}

function renderCompetencies(){
  const d=roleData();
  return `<div class="page-head"><div><h1>Competency Profile</h1><p>Initial/current competency view based on your role and assessment.</p></div></div>
  <div class="grid grid-3">
    <div class="card metric"><div class="label">Overall competency</div><div class="value">${state.assessmentDone?'76':'68'}%</div><div class="sub">${state.assessmentDone?'Updated after assessment':'Role-based baseline'}</div></div>
    <div class="card metric"><div class="label">Statistical domain</div><div class="value">72%</div><div class="sub">Survey • Sampling • Quality</div></div>
    <div class="card metric"><div class="label">Technical domain</div><div class="value">61%</div><div class="sub">Python • SQL • Visualization</div></div>
  </div>
  <div class="section-title"><h2>Current competencies</h2></div>
  <div class="card">${d.current.map(([name,val])=>`<div class="skill-line"><div class="row"><span>${name}</span><strong>${val}%</strong></div><div class="progress"><span style="width:${val}%"></span></div></div>`).join("")}</div>
  <div class="section-title"><h2>Future skill requirements</h2></div>
  <div class="card"><p>Default future skill areas linked to your registered role:</p><div class="tag-list">${d.future.map(x=>`<span class="badge badge-orange">${x}</span>`).join("")}</div></div>`;
}

function renderGaps(){
  const gaps=state.assessmentDone
    ? [["SQL","High","Upskill now"],["GIS","High","Recommended"],["AI / ML","Medium","Build foundation"],["Cloud Computing","Medium","Plan next"]]
    : [["SQL","High","Assess"],["GIS","High","Assess"],["AI / ML","Medium","Assess"],["Cloud Computing","Medium","Assess"],["Data Visualization","Low","Maintain"]];
  return `<div class="page-head"><div><h1>Skill Gap Analysis</h1><p>${state.assessmentDone?'Gaps are prioritized from your assessment results.':'These are preliminary areas; complete the assessment for a precise gap analysis.'}</p></div><button class="btn btn-primary" onclick="navigate('assessment')">${state.assessmentDone?'Retake Assessment':'Start Assessment'}</button></div>
  <div class="card table-wrap"><table><thead><tr><th>Skill</th><th>Priority</th><th>Status / Action</th></tr></thead><tbody>${gaps.map(g=>`<tr><td><strong>${g[0]}</strong></td><td><span class="badge ${g[1]==='High'?'badge-red':'badge-orange'}">${g[1]}</span></td><td>${g[2]}</td></tr>`).join("")}</tbody></table></div>`;
}

function courseCard(c){
  return `<div class="course"><div class="course-top ${c.theme||'blue'}"><span class="badge badge-${c.theme==='green'?'green':c.theme==='orange'?'orange':'blue'}">${escapeHtml(c.domain)}</span></div><div class="course-body"><div class="course-title">${escapeHtml(c.title)}</div><div class="course-meta">${escapeHtml(c.level)} • ${escapeHtml(c.hours)}</div><div class="course-foot"><span class="small">Role-aligned learning</span><button class="btn btn-secondary" onclick="toast('Course opened: ${escapeHtml(c.title).replace(/'/g,"\'")}')">Open</button></div></div></div>`;
}

function renderRecommendations(){
  return `<div class="page-head"><div><h1>Recommended Courses</h1><p>${state.assessmentDone?'Personalized after your competency assessment.':'Default role-aligned recommendations. Take the assessment to make them more precise.'}</p></div></div>
  <div class="card" style="margin-bottom:18px"><strong>Recommendation logic:</strong> role + department → default competency/future skill framework → assessment → skill gap → personalized learning path.</div>
  <div class="course-row">${recommendedCourses().map(courseCard).join("")}</div>
  <div class="section-title"><h2>Future-focused learning</h2></div>
  <div class="grid grid-3">${roleData().future.map((x,i)=>`<div class="card"><span class="badge badge-orange">Future Skill</span><h3 style="margin-top:12px">${x}</h3><p>${i%2===0?'Build capability aligned with evolving Official Statistics requirements.':'Strengthen digital and analytical readiness for future assignments.'}</p></div>`).join("")}</div>
  <div class="section-title"><h2>NSSTA / TPAC recommended training</h2></div>
  <div class="card"><p>Reserved area for recommended training programmes surfaced through your government learning ecosystem integration.</p><button class="btn btn-secondary" style="margin-top:12px" onclick="toast('Mock iGOT / TPAC catalogue opened')">View Training Catalogue</button></div>`;
}

const quiz = [
  {q:"Which skill is most relevant to analysing structured statistical data?", options:["SQL","Graphic Design","Video Editing","Audio Mixing"], ans:0},
  {q:"What should happen after identifying a competency gap?", options:["Ignore it","Recommend targeted learning","Delete profile","Disable dashboard"], ans:1},
  {q:"Which information can help create a competency profile?", options:["Designation and work experience","Favorite movie","Phone wallpaper","Browser theme"], ans:0},
  {q:"Why is the assessment included in this platform?", options:["To replace all courses","To refine skill gaps and recommendations","To create a social feed","To manage payroll"], ans:1}
];

function renderAssessment(){
  if(state.assessmentDone) return `<div class="page-head"><div><h1>Assessment Results</h1><p>Your baseline assessment has been completed.</p></div><button class="btn btn-secondary" onclick="startAssessment()">Retake</button></div>
  <div class="grid grid-3">
    <div class="card metric"><div class="label">Assessment score</div><div class="value">${state.score}/${quiz.length}</div><div class="sub">Completed</div></div>
    <div class="card metric"><div class="label">Current competency</div><div class="value">76%</div><div class="sub">Updated profile</div></div>
    <div class="card metric"><div class="label">Recommended next</div><div class="value">6</div><div class="sub">Course modules</div></div>
  </div>
  <div class="section-title"><h2>What changed</h2></div>
  <div class="grid grid-2">
    <div class="card"><h3>Skill gaps</h3><div class="tag-list"><span class="badge badge-red">SQL</span><span class="badge badge-red">GIS</span><span class="badge badge-orange">AI / ML</span><span class="badge badge-orange">Cloud Computing</span></div></div>
    <div class="card"><h3>Next learning path</h3><p>Start with the highest-priority technical gaps, then move into future-skill modules.</p><button class="btn btn-primary" style="margin-top:14px" onclick="navigate('recommendations')">View Recommendations</button></div>
  </div>`;
  return `<div class="page-head"><div><h1>Competency Assessment</h1><p>Baseline assessment to understand your current competency level.</p></div><span class="badge badge-orange">Question ${state.quizIndex+1} of ${quiz.length}</span></div>
  <div class="card"><h2 style="margin-top:0">${quiz[state.quizIndex].q}</h2><div style="margin-top:16px">${quiz[state.quizIndex].options.map((o,i)=>`<button class="quiz-option ${state.selected===i?'selected':''}" onclick="selectAnswer(${i})">${String.fromCharCode(65+i)}. ${o}</button>`).join("")}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px"><span class="small">This is a demo assessment for the frontend.</span><button class="btn btn-primary" onclick="nextQuestion()">${state.quizIndex===quiz.length-1?'Finish Assessment':'Next'}</button></div></div>`;
}
function startAssessment(){state.assessmentDone=false;state.quizIndex=0;state.score=0;state.selected=null;state.screen="assessment";render()}
function selectAnswer(i){state.selected=i;render()}
function nextQuestion(){
  if(state.selected===null){toast("Select an answer first");return}
  if(state.selected===quiz[state.quizIndex].ans) state.score++;
  if(state.quizIndex===quiz.length-1){
    state.assessmentDone=true;
    state.screen="home";
    render();
    toast("Assignment completed. Your recommendations are updated.");
  } else {
    state.quizIndex++;
    state.selected=null;
    render();
  }
}

function renderProgress(){
  return `<div class="page-head"><div><h1>Learning Progress</h1><p>Track learning hours, courses and competency growth.</p></div></div>
  <div class="grid grid-4">
    <div class="card metric"><div class="label">Overall progress</div><div class="value">42%</div><div class="sub">Across assigned learning</div></div>
    <div class="card metric"><div class="label">Learning hours</div><div class="value">12.5</div><div class="sub">This cycle</div></div>
    <div class="card metric"><div class="label">Courses completed</div><div class="value">3</div><div class="sub">Out of 8</div></div>
    <div class="card metric"><div class="label">Assessment score</div><div class="value">${state.assessmentDone?state.score*25:'—'}%</div><div class="sub">Latest attempt</div></div>
  </div>
  <div class="grid grid-2" style="margin-top:18px">
    <div class="card"><h3>Current learning</h3>${[
      ["Python for Official Statistics",64],["Survey Design & Sampling",38],["Data Visualization for Policy",22]
    ].map(x=>`<div class="skill-line"><div class="row"><span>${x[0]}</span><strong>${x[1]}%</strong></div><div class="progress"><span style="width:${x[1]}%"></span></div></div>`).join("")}</div>
    <div class="card"><h3>Competency growth</h3><div class="ring-wrap"><div class="ring"></div><div class="ring-value">+18%</div></div><p style="margin-top:14px">Estimated improvement since the first learning cycle.</p></div>
  </div>`;
}

function renderProfile(){
  const u=state.user,d=roleData();
  return `<div class="page-head"><div><h1>My Profile & Dashboard</h1><p>Interactive view of your profile, competencies, gaps and learning.</p></div></div>
  <div class="profile-grid">
    <div class="card">
      <div class="profile-avatar">${initials(u.name)}</div><h2 style="margin-bottom:4px">${escapeHtml(u.name)}</h2><div class="small">${escapeHtml(u.role)}</div>
      <div class="tag-list"><span class="badge badge-blue">${escapeHtml(u.org)}</span></div>
      <div style="margin-top:18px"><div class="small">Government Email</div><strong>${escapeHtml(u.email)}</strong></div>
      <div style="margin-top:12px"><div class="small">Department</div><strong>${escapeHtml(u.dept)}</strong></div>
      <div style="margin-top:12px"><div class="small">Experience</div><strong>${escapeHtml(u.experience)}</strong></div>
    </div>
    <div class="grid grid-2">
      <div class="card"><h3>Competency snapshot</h3>${d.current.slice(0,4).map(([n,v])=>`<div class="skill-line"><div class="row"><span>${n}</span><strong>${v}%</strong></div><div class="progress"><span style="width:${v}%"></span></div></div>`).join("")}</div>
      <div class="card"><h3>Skill gaps</h3><div class="tag-list"><span class="badge badge-red">SQL</span><span class="badge badge-red">GIS</span><span class="badge badge-orange">AI / ML</span><span class="badge badge-orange">Cloud</span></div><p style="margin-top:13px">Prioritized from the current competency profile.</p></div>
      <div class="card"><h3>Learning path</h3><p>1. Address high-priority gaps</p><p style="margin-top:8px">2. Complete recommended courses</p><p style="margin-top:8px">3. Reassess competencies</p></div>
      <div class="card"><h3>Future skill requirements</h3><div class="tag-list">${d.future.map(x=>`<span class="badge badge-orange">${x}</span>`).join("")}</div></div>
    </div>
  </div>
  <div class="section-title"><h2>Profile actions</h2></div>
  <div class="grid grid-3">
    <div class="card"><h3>Update profile</h3><p>Keep role, assignment and training details current.</p><button class="btn btn-secondary" style="margin-top:12px" onclick="toast('Profile edit opened')">Edit Profile</button></div>
    <div class="card"><h3>View recommendations</h3><p>Open the course path tailored to your role and gaps.</p><button class="btn btn-primary" style="margin-top:12px" onclick="navigate('recommendations')">Open Learning Path</button></div>
    <div class="card"><h3>Reassess competencies</h3><p>Refresh your competency status after learning.</p><button class="btn btn-secondary" style="margin-top:12px" onclick="startAssessment()">Start Reassessment</button></div>
  </div>`;
}

function renderAdmin(){
  return `<div class="page-head"><div><h1>Administrator Dashboard</h1><p>Organization-wide workforce competency and training insights.</p></div><span class="badge badge-orange">Admin View</span></div>
  <div class="grid grid-4">
    <div class="card metric admin-card"><div class="label">Employees</div><div class="value">1,248</div><div class="sub">Active profiles</div></div>
    <div class="card metric admin-card"><div class="label">Avg competency</div><div class="value">71%</div><div class="sub">Across workforce</div></div>
    <div class="card metric admin-card"><div class="label">Training completion</div><div class="value">64%</div><div class="sub">Current cycle</div></div>
    <div class="card metric admin-card"><div class="label">Emerging skills</div><div class="value">12</div><div class="sub">Priority areas</div></div>
  </div>
  <div class="section-title"><h2>Competency distribution</h2></div>
  <div class="grid grid-2">
    <div class="card">${["Statistical","Technical","Digital Governance","Behavioural & Managerial"].map((x,i)=>`<div class="skill-line"><div class="row"><span>${x}</span><strong>${[78,63,57,72][i]}%</strong></div><div class="progress"><span style="width:${[78,63,57,72][i]}%"></span></div></div>`).join("")}</div>
    <div class="card"><h3>Future workforce requirements</h3><div class="tag-list"><span class="badge badge-orange">AI / ML</span><span class="badge badge-orange">Cloud</span><span class="badge badge-orange">GIS</span><span class="badge badge-orange">APIs</span><span class="badge badge-orange">Cybersecurity</span></div><p style="margin-top:13px">Use workforce trends to prioritize future capacity-building programmes.</p></div>
  </div>
  <div class="section-title"><h2>Employee view</h2></div>
  <div class="card table-wrap"><table><thead><tr><th>Employee</th><th>Role</th><th>Competency</th><th>Skill Gaps</th><th>Learning Progress</th><th></th></tr></thead><tbody>
    ${[
      ["Ananya Sharma","Statistician","76%","4","42%"],["Rahul Mehta","Data Analyst","68%","6","55%"],["Priya Nair","Assistant Director","81%","3","72%"],["Arjun Rao","Statistician","73%","5","49%"]
    ].map(r=>`<tr><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><button class="link" onclick="toast('Employee detail view opened')">View</button></td></tr>`).join("")}
  </tbody></table></div>`;
}

function toast(msg){
  const el=document.createElement("div");el.className="toast";el.textContent=msg;document.body.appendChild(el);
  setTimeout(()=>el.remove(),2200);
}

render();

// Explicit globals for local-file previews and embedded browser runners.
window.loginUser = loginUser;
window.demoEmployee = demoEmployee;
window.demoAdmin = demoAdmin;
window.registerUser = registerUser;
window.logout = logout;
window.navigate = navigate;
window.startAssessment = startAssessment;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
