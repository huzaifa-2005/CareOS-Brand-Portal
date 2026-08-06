import { useEffect } from "react";

function App() {
  useEffect(() => {
    /* ---------------------------------------------------------
       Mobile nav toggle
    --------------------------------------------------------- */
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("main-nav");

    function handleNavToggle() {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    function handleNavLinkClick() {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && mainNav) {
      navToggle.addEventListener("click", handleNavToggle);
      mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", handleNavLinkClick);
      });
    }

    /* ---------------------------------------------------------
       Scroll reveal
    --------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
      ".problem-card, .feature-card, .usp-card, .platform-card, .roadmap-card, .flow-step, .section h2, .section-lede"
    );
    revealTargets.forEach((el) => el.classList.add("reveal"));

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io;

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach((el) => io.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    }

    /* ---------------------------------------------------------
       Hero phone mockup — bilingual conversation loop
    --------------------------------------------------------- */
    const chatBody = document.getElementById("chatBody");
    const phoneStatus = document.getElementById("phoneStatus");
    const inputGhost = document.getElementById("phoneInputGhost");

    let timer = null;
    let intervalId = null;

    if (chatBody) {
      const conversations = [
        {
          status: "online",
          script: [
            { side: "in", text: "Assalam o Alaikum, kal Dr. Ahsan se appointment mil sakti hai?" },
            { side: "typing" },
            { side: "out", text: "Ji zaroor! Kal 4pm ya 6pm dono slots free hain, aap kaunsa lein gi?" },
            { side: "in", text: "6pm theek rahega" },
            {
              side: "card",
              label: "Appointment confirmed",
              title: "Dr. Ahsan Raza — Tomorrow, 6:00 PM",
            },
          ],
        },
        {
          status: "online",
          script: [
            { side: "in", text: "Hi, is the clinic open on Sunday?" },
            { side: "typing" },
            { side: "out", text: "Yes — Sundays we're open 10am–2pm for general consultations." },
            { side: "in", text: "Great, can I book 11am with any available doctor?" },
            {
              side: "card",
              label: "Appointment confirmed",
              title: "Dr. Sana Malik — Sunday, 11:00 AM",
            },
          ],
        },
      ];

      let convoIndex = 0;
      let stepIndex = 0;

      function clearChat() {
        chatBody.innerHTML = "";
      }

      function renderStep(step) {
        const bubble = document.createElement("div");

        if (step.side === "typing") {
          bubble.className = "bubble typing";
          bubble.innerHTML = "<span></span><span></span><span></span>";
        } else if (step.side === "card") {
          bubble.className = "bubble card";
          bubble.innerHTML =
            '<span class="card-title">' + step.label + "</span><strong>" + step.title + "</strong>";
        } else {
          bubble.className = "bubble " + step.side;
          bubble.textContent = step.text;
        }

        chatBody.appendChild(bubble);

        while (chatBody.children.length > 5) {
          chatBody.removeChild(chatBody.firstChild);
        }
      }

      function playNextStep() {
        const convo = conversations[convoIndex];

        if (stepIndex === 0 && phoneStatus) {
          phoneStatus.textContent = convo.status;
        }

        if (stepIndex >= convo.script.length) {
          timer = setTimeout(() => {
            clearChat();
            convoIndex = (convoIndex + 1) % conversations.length;
            stepIndex = 0;
            timer = setTimeout(playNextStep, 500);
          }, 2200);
          return;
        }

        const step = convo.script[stepIndex];

        if (step.side === "typing") {
          renderStep(step);
          timer = setTimeout(() => {
            const typingBubble = chatBody.querySelector(".bubble.typing");
            if (typingBubble) typingBubble.remove();
            stepIndex++;
            playNextStep();
          }, 1100);
          return;
        }

        renderStep(step);
        stepIndex++;

        const delay = step.side === "card" ? 900 : 1300;
        timer = setTimeout(playNextStep, delay);
      }

      if (prefersReducedMotion) {
        renderStep({ side: "in", text: "Assalam o Alaikum, appointment chahiye thi." });
        renderStep({ side: "out", text: "Ji zaroor, kal 6pm ka slot free hai." });
        renderStep({ side: "card", label: "Appointment confirmed", title: "Dr. Ahsan Raza — Tomorrow, 6:00 PM" });
      } else {
        playNextStep();
      }
    }

    if (inputGhost) {
      const placeholders = ["Message", "Type a message…", "Message"];
      let pIndex = 0;
      intervalId = setInterval(() => {
        pIndex = (pIndex + 1) % placeholders.length;
        inputGhost.textContent = placeholders[pIndex];
      }, 4000);
    }

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header" id="top">
        <div className="header-inner">
          <a className="logo" href="#top">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 28 28" width="26" height="26">
                <path d="M14 2 C8 2 3.5 6.2 3.5 12.2 C3.5 19 9.5 24.4 14 26 C18.5 24.4 24.5 19 24.5 12.2 C24.5 6.2 20 2 14 2 Z" fill="none" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M8.5 13.6h3.1l1.3-3.4 2 6.8 1.4-3.4h3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            CareOS
          </a>

          <nav className="main-nav" id="main-nav">
            <a href="#problem">Problem</a>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#why">Why CareOS</a>
            <a href="#platform" className="mobile-only-cta">See It In Action</a>
            <a href="mailto:autofleetx.notifications@gmail.com?subject=Book%20a%20demo" className="mobile-only-cta">Book a Demo</a>
          </nav>

          <div className="header-actions">
            <a className="btn btn-primary btn-small" href="#platform">See It In Action</a>
            <button className="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
              <span></span><span></span><span></span>
            </button>
            <a className="social-link" href="https://www.linkedin.com/in/huzaifa-ahmed-7843ba336/" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v1.98h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.7c0-1.6-.03-3.65-2.22-3.65-2.23 0-2.57 1.74-2.57 3.54V23h-4V8.5z" fill="currentColor"/>
              </svg>
            </a>
            <a className="btn btn-primary btn-small" href="mailto:autofleetx.notifications@gmail.com?subject=Book%20a%20demo">Book a Demo</a>
          </div>
        </div>
      </header>

      <main id="main">

        {/* ============ HERO ============ */}
        <section className="hero" id="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">An AI front desk, on the app patients already trust</p>
              <h1>Patients already message you.<br/>Now it answers back — <em>and books the visit.</em></h1>
              <p className="hero-sub">CareOS is an AI agent for private clinics and small hospitals. It runs on WhatsApp and browser as well, replies in English or Roman Urdu, checks your real calendar, books or reschedules the appointment, and flags anything urgent to your staff — no receptionist glued to the phone required.</p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="mailto:autofleetx.notifications@gmail.com?subject=Book%20a%20demo">Book a Demo</a>
                <a className="btn btn-ghost" href="#how-it-works">See how it works <span aria-hidden="true">&darr;</span></a>
              </div>
              <p className="hero-note">No app to download for patients. No new interface for staff to learn.</p>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="phone">
                <div className="phone-notch"></div>
                <div className="phone-head">
                  <span className="phone-avatar">NMC</span>
                  <div className="phone-head-text">
                    <strong>National Medical Center</strong>
                    <small id="phoneStatus">online</small>
                  </div>
                </div>
                <div className="phone-body" id="chatBody"></div>
                <div className="phone-input">
                  <span id="phoneInputGhost">Message</span>
                </div>
              </div>
              <div className="phone-glow"></div>
            </div>
          </div>
        </section>

        {/* ============ PROBLEM ============ */}
        <section className="section" id="problem">
          <div className="section-inner">
            <p className="eyebrow">The problem</p>
            <h2>The front desk that never sleeps — but nobody's staffed it</h2>
            <p className="section-lede">Most clinics lose patients not to bad care, but to silence: a call that rings out, a message left on read, a booking that takes three calls to confirm.</p>

            <div className="card-grid problem-grid">
              <article className="problem-card">
                <span className="card-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M20 12v8l6 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3>After hours, the answer is silence</h3>
                <p>No clinic can staff a front desk 24/7. Patients calling at night or on a holiday get nothing — and often just message the next clinic instead.</p>
              </article>

              <article className="problem-card">
                <span className="card-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M10 14h20M10 20h20M10 26h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
                </span>
                <h3>Formal forms don't match how people type</h3>
                <p>Most digital clinic tools expect tidy English. Patients across Pakistan type casually, in Roman Urdu — and get ignored by systems built for someone else.</p>
              </article>

              <article className="problem-card">
                <span className="card-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><rect x="9" y="10" width="22" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 16h22" stroke="currentColor" strokeWidth="1.6"/></svg>
                </span>
                <h3>Booking by phone is slow, both ways</h3>
                <p>Checking a doctor's availability, cross-referencing a calendar, calling the patient back — every booking becomes a small chain of manual steps.</p>
              </article>

              <article className="problem-card">
                <span className="card-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M20 8v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="20" cy="28" r="1.6" fill="currentColor"/></svg>
                </span>
                <h3>Urgent messages get buried</h3>
                <p>A patient describing severe pain sits in the same queue as "what are your timings" — with nothing to tell your staff which one needs them right now.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="section section-alt" id="how-it-works">
          <div className="section-inner">
            <p className="eyebrow">How it works</p>
            <h2>One conversation, start to finish</h2>
            <p className="section-lede">No decision tree of button presses. CareOS reads what the patient actually needs and acts on it.</p>

            <ol className="flow">
              <li className="flow-step">
                <span className="flow-num">01</span>
                <div>
                  <h3>Patient messages, any time</h3>
                  <p>On your clinic's WhatsApp number, in English or Roman Urdu — whichever they type first.</p>
                </div>
              </li>
              <li className="flow-step">
                <span className="flow-num">02</span>
                <div>
                  <h3>CareOS decides what's needed</h3>
                  <p>A question, a new booking, a reschedule, or an urgent case — routed automatically, in the moment.</p>
                </div>
              </li>
              <li className="flow-step">
                <span className="flow-num">03</span>
                <div>
                  <h3>It checks the real calendar and acts</h3>
                  <p>Live availability from Google Calendar, then books, reschedules, or cancels — no back-and-forth call needed.</p>
                </div>
              </li>
              <li className="flow-step">
                <span className="flow-num">04</span>
                <div>
                  <h3>Your team stays informed</h3>
                  <p>Every conversation lands on the dashboard. Urgent cases trigger an instant email alert to staff.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* ============ FEATURES ============ */}
        <section className="section" id="features">
          <div className="section-inner">
            <p className="eyebrow">Features</p>
            <h2>What CareOS actually does</h2>
            <p className="section-lede">Every item here is a working part of the product today — nothing on this list is a promise.</p>

            <div className="card-grid features-grid">
              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M12 14h16v10H18l-4 4v-4h-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
                </span>
                <h3>Instant FAQ answers</h3>
                <p>Timings, fees, doctors, and location — from fixed quick-answers and an AI knowledge base grounded in your clinic's own data.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><circle cx="14" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="26" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
                </span>
                <h3>Genuinely bilingual</h3>
                <p>Understands and replies naturally in English or Roman Urdu, matching whichever language the patient uses.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><rect x="8" y="10" width="24" height="21" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M8 17h24" stroke="currentColor" strokeWidth="1.6"/><path d="M14 23l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3>Real-time booking</h3>
                <p>Books appointments conversationally, checking live doctor availability against Google Calendar.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M12 20a8 8 0 1 1 4 6.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 27v-5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3>Reschedule &amp; cancel</h3>
                <p>Patients change plans through the same chat thread — no separate call needed to update a booking.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><path d="M20 7l3.6 8.2 9 .9-6.8 6 2 8.9-7.8-4.7-7.8 4.7 2-8.9-6.8-6 9-.9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                </span>
                <h3>Automatic urgency detection</h3>
                <p>Recognises urgent language and alerts clinic staff by email immediately — no one has to be watching the queue.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><rect x="9" y="12" width="22" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 17h22M15 12v-3M25 12v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
                <h3>Appointment reminders</h3>
                <p>Sends a reminder email ahead of each scheduled visit, automatically.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><rect x="13" y="6" width="14" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M18 30h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
                <h3>Patient web chat portal</h3>
                <p>An account-based alternative to WhatsApp, with appointment history and a feedback form.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><rect x="7" y="9" width="26" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 24l5-5 4 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3>Receptionist dashboard</h3>
                <p>Every booking, conversation, urgent flag, and piece of patient feedback, visible in one place.</p>
              </article>

              <article className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="26" cy="14" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="20" cy="27" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/></svg>
                </span>
                <h3>Super-admin oversight</h3>
                <p>Onboard clinics, manage staff, and track how much usage was free (rule-based) versus paid (AI) — across the whole platform.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ WHY CAREOS ============ */}
        <section className="section section-dark" id="why">
          <div className="section-inner">
            <p className="eyebrow eyebrow-on-dark">Why CareOS</p>
            <h2 className="on-dark">Not a chatbot with a clinic logo on it</h2>
            <p className="section-lede on-dark">Six decisions that shape everything else about how CareOS works.</p>

            <div className="usp-grid">
              <article className="usp-card">
                <span className="usp-index">1</span>
                <h3>WhatsApp-first, not app-first</h3>
                <p>Patients message a number they already trust — nothing to download, nothing new to learn. Almost no one misses a WhatsApp message the way they miss an email or a push notification.</p>
              </article>
              <article className="usp-card">
                <span className="usp-index">2</span>
                <h3>Genuinely bilingual, not translated</h3>
                <p>Built for how patients actually type — casual Roman Urdu — not a translation layer bolted onto an English-only system.</p>
              </article>
              <article className="usp-card">
                <span className="usp-index">3</span>
                <h3>An agent, not a script</h3>
                <p>It decides between FAQ, booking, and urgent alert, checks a real calendar, and takes real action — instead of following a fixed tree of button taps.</p>
              </article>
              <article className="usp-card">
                <span className="usp-index">4</span>
                <h3>Built for clinic trust</h3>
                <p>Every automated conversation is visible to staff on the dashboard. Not a black box you're asked to trust blindly.</p>
              </article>
              <article className="usp-card">
                <span className="usp-index">5</span>
                <h3>Multi-clinic-ready</h3>
                <p>One platform that scales from a single clinic to a network of them — each isolated, each independently manageable.</p>
              </article>
              <article className="usp-card">
                <span className="usp-index">6</span>
                <h3>Low-cost by design</h3>
                <p>Routine questions are answered for free, by rules. AI is called in only when the conversation genuinely needs it.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ PLATFORM OVERVIEW ============ */}
        <section className="section" id="platform">
          <div className="section-inner">
            <p className="eyebrow">The platform - SEE THE AGENT IN ACTION</p>
            <h2>Four surfaces, one system</h2>
            <p className="section-lede">CareOS isn't a single bot — it's a small platform, with a surface for everyone who touches it.</p>

            <div className="platform-grid">
              <article className="platform-card">
                <span className="platform-tag"><a href="https://care-os-web-chat.vercel.app" target="_blank" rel="noreferrer">💬 Patient Chat Portal </a></span>
                <h3>WhatsApp &amp; web chat</h3>
                <p>Where a patient talks to the clinic — by WhatsApp, or through the browser-based portal with their own appointment history.</p>
              </article>
              <article className="platform-card">
                <span className="platform-tag"><a href="https://care-os-receptionist-dashboard.vercel.app" target="_blank" rel="noreferrer"> 🩺 Receptionist Dashboard </a></span>
                <h3>Clinic dashboard</h3>
                <p>Where staff see every booking, every conversation, every urgent flag, and every piece of feedback, as it happens.</p>
              </article>
              <article className="platform-card">
                <span className="platform-tag"><a href="https://care-os-super-admin.vercel.app" target="_blank" rel="noreferrer"> 🛡️ Super Admin Dashboard </a></span>
                <h3>Super-admin console</h3>
                <p>Where the platform owner onboards clinics, manages staff accounts, and tracks usage and cost across every location.</p>
              </article>
              <article className="platform-card">
                <span className="platform-tag"><a href="https://care-os-public.vercel.app" target="_blank" rel="noreferrer">Public</a></span>
                <h3>This site</h3>
                <p>Where a clinic first learns what CareOS does, before anyone on their team logs into anything.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ ROADMAP ============ */}
        <section className="section section-alt" id="roadmap">
          <div className="section-inner">
            <p className="eyebrow">What's next</p>
            <h2>On the roadmap</h2>
            <p className="section-lede">Built to be added, not promised as already live.</p>

            <div className="card-grid roadmap-grid">
              <article className="roadmap-card">
                <span className="roadmap-badge">Coming soon</span>
                <h3>Online payments</h3>
                <p>Letting patients pay for a consultation directly from the chat, before or after a visit.</p>
              </article>
              <article className="roadmap-card">
                <span className="roadmap-badge">Coming soon</span>
                <h3>Medical report uploads</h3>
                <p>A place for patients to share test results and reports ahead of an appointment.</p>
              </article>
              <article className="roadmap-card">
                <span className="roadmap-badge">Coming soon</span>
                <h3>Automated no-show recovery</h3>
                <p>Gentle, automatic follow-up messaging when a patient misses a booked appointment.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="section cta-section">
          <div className="section-inner cta-inner">
            <h2>See it answer a patient in real time</h2>
            <p className="section-lede">A short demo, in English or Roman Urdu — whichever your patients actually use.</p>
            <a className="btn btn-primary" href="mailto:autofleetx.notifications@gmail.com?subject=Book%20a%20demo">Book a Demo</a>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo">CareOS</span>
            <p>An AI front desk for clinics, on WhatsApp.</p>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:autofleetx.notifications@gmail.com">autofleetx.notifications@gmail.com</a></li>
              <li>Karachi, Pakistan</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Site</h4>
            <ul>
              <li><a href="#problem">Problem</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#platform">Platform</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul>
              <li><a href="https://www.linkedin.com/in/huzaifa-ahmed-7843ba336/" aria-label="CareOS on LinkedIn (placeholder)">LinkedIn</a></li>
              <li><a href="#" aria-label="CareOS on Instagram (placeholder)">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 CareOS. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;