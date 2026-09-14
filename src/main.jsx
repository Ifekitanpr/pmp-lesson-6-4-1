import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  Target,
  Volume2,
  VolumeX,
  X,
  ShieldCheck,
  Radar,
  Scale,
  Zap,
  ShieldAlert,
  LifeBuoy,
  Wrench,
} from "lucide-react";
import { useLessonAudio } from "../../shared/useLessonAudio";
import "./styles.css";
const illustrationFiles = import.meta.glob("./assets/illustrations/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
const img = (n) => illustrationFiles[`./assets/illustrations/${n}.png`];
const tabs = [
  "Staying armed",
  "Monitor Risks",
  "Three checks",
  "What remains",
  "The ladder",
  "Exam lens",
];
const checks = [
  [
    "Are Responses Actually Effective?",
    "A mitigation strategy that isn't reducing the risk the way it was meant to needs to be revisited, not left running on autopilot.",
    "response-effectiveness",
  ],
  [
    "Are New Risks Surfacing?",
    "Watching for risks that genuinely couldn't have been foreseen at the original planning stage, as the project evolves into territory the original plan never covered.",
    "new-risks-radar",
  ],
  [
    "Are Reserves, Assumptions, and Processes Still Valid?",
    "An assumption that held true at kickoff may no longer hold six months in, and a reserve sized against an old risk profile may no longer be the right size.",
    "reserve-assumption-review",
  ],
];
const ladder = [
  [
    "Trigger",
    "An event or condition signaling that a risk is about to occur — recorded explicitly in the risk register. What makes a contingent response actually executable in the moment, rather than a vague intention nobody knows when to activate. Example: production credentials haven’t arrived by the end of week six.",
    "trigger-credentials",
  ],
  [
    "Contingency Plan",
    "A pre-agreed response, executed only when its specific trigger fires, funded by the contingency reserve. Example: the team switches the integration order to certify the refunds pathway first while the credentials clear. Reserve gets spent, but the date holds.",
    "contingency-resequence",
  ],
  [
    "Fallback Plan",
    "The plan behind the plan — used specifically when the primary response, or even the contingency response, fails to work. Example: if credentials are still absent by week eight, the pilot launches instead on the payment gateway’s certified hosted checkout page. The user experience is reduced, but compliance stays intact and the launch date is preserved.",
    "fallback-hosted-checkout",
  ],
  [
    "Workaround",
    "The unplanned reaction to a risk that has already occurred, with no trigger, no pre-agreed plan, no contingency reserve lined up in advance. By the time a workaround is needed, the risk has already become an issue, managed through the issue log and change control rather than the risk response machinery.",
    "workaround-improvised",
  ],
];
const reveals = {
  hook: {
    title: "Risk management needs that same permanence.",
    text: "A response plan built and implemented perfectly is still only as good as the ongoing watch that confirms it’s actually working — and catches whatever new risk shows up after the plan was written. This lesson covers that continuous watch, and something equally important: what a risk response leaves behind, even when it succeeds.",
    image: "smoke-detector-timeline",
  },
  meaning: {
    title: "Monitor Risks is a recurring discipline.",
    text: "This enabler is previewed here — through triggers, watch lists, and thresholds — but it’s fully performed in PMBOK® 8’s Monitor Risks process, the final step in the risk management cycle. Monitor Risks confirms that planned responses are actually working, watches for new risks emerging as the project evolves, and checks whether the original reserves, assumptions, and processes are still valid as reality unfolds. This happens through risk reviews, audits, team meetings, and ongoing performance data analysis — not a single checkpoint, but a recurring discipline built into how the project runs.",
    image: "monitor-process",
  },
  gap: {
    title: "What happens when a gap turns up",
    text: "Update the project plan or backlog, log any newly discovered risks into the register, and raise change requests where the gap is significant enough to require one. Monitor Risks is what keeps the whole risk management process alive — proof that risk management isn’t a one-time event completed during planning, but a continuous safeguard running for the life of the project.",
    image: "monitor-gap-actions",
  },
  residual: {
    title: "Residual Risk",
    text: "What remains after the response has been applied. Example: mitigating a vendor delay risk with a rented backup sandbox and weekly checkpoints might drop the delay probability from 30% to 10% — but that remaining 10%, multiplied by a $60,000 impact, is $6,000 of exposure that’s still there. It’s not a failure of the response. It’s a knowingly accepted remainder, consciously priced and covered by contingency reserve.",
    image: "residual-risk",
  },
  secondary: {
    title: "Secondary Risk",
    text: "A brand-new risk created by the response itself, one that didn’t exist before the response was implemented. Example: that same rented sandbox, brought in to mitigate the vendor delay risk, can itself drift out of alignment with the production environment over time — a risk that only exists because the mitigation was put in place.",
    image: "secondary-risk",
  },
  exam: {
    title: "Monitoring and controlling risk keeps the entire process alive.",
    text: "Monitoring and controlling risk means tracking whether responses are actually working, watching for risks that surface only as the project evolves, and validating that reserves and assumptions still hold. A response changes the risk picture without erasing it. Residual risk is the priced, consciously accepted remainder of the original risk. Secondary risk is a brand-new risk the response itself created. And the ladder from trigger to contingency to fallback to workaround runs from planned to improvised — with the goal always being to stay as high on that ladder as the planning allows, so risk gets managed on the project’s terms, not discovered as a crisis on its own.",
    image: "exam-monitoring",
    bullets: [
      "Three continuous checks: response effectiveness, new emerging risks, validity of reserves/assumptions/processes",
      "Residual risk = leftover portion of the original risk, priced and accepted. Secondary risk = a brand-new risk created by the response itself",
      "Ladder: trigger → contingency plan → fallback plan → workaround",
      "The goal is always to live as high on the ladder as possible — planned beats improvised",
    ],
  },
};
const quizzes = [
  {
    q: "A project mitigates a supplier delay risk by renting a backup testing environment. Months later, the team discovers this backup environment has quietly drifted out of sync with the actual production system. What does this drift represent?",
    a: [
      "Residual risk, since it’s what remains after the original mitigation was applied",
      "Secondary risk, since it’s a new risk created directly by the mitigation response",
      "A workaround, since the team is now reacting to an unplanned situation",
      "A trigger, since it signals that the original supplier delay risk is about to occur",
    ],
    c: 1,
    g: "Correct! This is exactly what secondary risk means — a risk that didn’t exist until the response was implemented. The correct discipline is to identify this at response-planning time and manage it in the register like any other risk, rather than discovering it as an unpleasant surprise later.",
    b: "Reconsider — residual risk is the leftover portion of the original risk itself; this drift issue didn’t exist before the mitigation and was created entirely by the response, which is a different category.",
  },
  {
    q: "Production credentials still haven’t arrived by week eight, so the team launches the pilot on the payment gateway’s certified hosted checkout page instead. What does this represent?",
    a: [
      "A contingency plan, since it was triggered by a specific condition",
      "A fallback plan, since it’s the plan used after the original contingency response didn’t fully resolve the situation",
      "A workaround, since it was improvised on the spot with no prior planning",
      "A trigger, since it signals a new risk is about to occur",
    ],
    c: 1,
    g: "Right — this is specifically the plan behind the plan, used because the contingency response didn’t fully resolve things by week eight. It was pre-agreed, not improvised, which is what separates a fallback from a workaround.",
    b: "Reconsider — this response was pre-planned in advance for exactly this situation, and it’s specifically the backup used after the contingency plan alone wasn’t enough — not the contingency itself, and not an unplanned improvisation.",
  },
];
function Modal({ d, close, done }) {
  const [step, setStep] = useState(0);
  return createPortal(
    <div className="modal-backdrop" onClick={close}>
      <section className="focus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={close}>
          <X />
        </button>
        {step === 0 ? (
          <>
            <img className="modal-illustration" src={img(d.image)} />
            <h3>{d.title}</h3>
            <div className="modal-copy">
              <p>{d.text}</p>
            </div>
          </>
        ) : (
          <div className="memory-step">
            <h3>Exam-Relevant Enablers to Remember</h3>
            <ul>
              {d.bullets.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
        {d.bullets && step === 0 ? (
          <button className="modal-action" onClick={() => setStep(1)}>
            Next <ArrowRight />
          </button>
        ) : (
          <button
            className="modal-action"
            onClick={() => {
              done();
              close();
            }}
          >
            Mark as read <Check />
          </button>
        )}
      </section>
    </div>,
    document.body,
  );
}
function Quiz({ d, finish }) {
  const [p, setP] = useState(null);
  return createPortal(
    <div className="knowledge-backdrop">
      <section className="knowledge-modal">
        <p className="quiz-label">
          <Target /> MICRO KNOWLEDGE CHECK
        </p>
        <h3>{d.q}</h3>
        <div className="answers">
          {d.a.map((x, i) => (
            <button
              key={x}
              onClick={() => setP(i)}
              className={p === i ? (i === d.c ? "correct" : "wrong") : ""}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {x}
            </button>
          ))}
        </div>
        {p !== null && (
          <>
            <p className={`feedback ${p === d.c ? "good" : "bad"}`}>
              {p === d.c ? d.g : d.b}
            </p>
            <button className="finish-check" onClick={finish}>
              Finish check <ArrowRight />
            </button>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
function App() {
  const [s, setS] = useState(0),
    [done, setDone] = useState(Array(6).fill(false)),
    [modal, setModal] = useState(null),
    [quiz, setQuiz] = useState(null),
    [sound, setSound] = useState(true),
    [checkRead, setCheckRead] = useState([false, false, false]),
    [cardRead, setCardRead] = useState([false, false]),
    [ladderRead, setLadderRead] = useState([false, false, false, false]);
  useLessonAudio(sound);
  useEffect(() => {
    if (s === 2 && checkRead.every(Boolean)) setModal("gap");
  }, [checkRead, s]);
  const mark = (i = s) => setDone((d) => d.map((x, j) => (j === i ? true : x)));
  const go = (i) => i >= 0 && i < 6 && (i <= s + 1 || done[i - 1]) && setS(i);
  let c;
  if (s === 0)
    c = (
      <div className="hero-layout">
        <div>
          <p className="eyebrow">LESSON 6.4.1 · MONITOR AND CONTROL RISKS</p>
          <h1>
            A smoke detector stays <span>armed.</span>
          </h1>
          <p className="lead">
            A smoke detector doesn’t go off once during installation and then
            shut off forever. It stays armed for the life of the building,
            watching continuously — because the danger it’s guarding against
            doesn’t stop existing just because the detector was installed
            correctly on day one.
          </p>
          <button
            className="primary-cta"
            disabled={done[0]}
            onClick={() => !done[0] && setModal("hook")}
          >
            {done[0] ? "Permanent watch reviewed" : "Reveal the permanent watch"} <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("smoke-detector-timeline")} />
      </div>
    );
  if (s === 1)
    c = (
      <div className="hero-layout">
        <div>
          <h2>What This Enabler Means</h2>
          <p className="lead">
            This isn’t a checkpoint that happens once. It’s a discipline built
            into the rhythm of how the project runs, for as long as the project
            runs.
          </p>
          <button
            className="primary-cta"
            disabled={done[1]}
            onClick={() => !done[1] && setModal("meaning")}
          >
            {done[1] ? "Monitor Risks reviewed" : "Reveal Monitor Risks"} <ArrowRight />
          </button>
        </div>
        <img className="lesson-art" src={img("monitor-process")} />
      </div>
    );
  if (s === 2)
    c = (
      <div className="wide-page">
        <h2>Three Continuous Checks</h2>
        <p className="lead">
          Monitoring risk covers three continuous checks, running side by side
          for the whole life of the project. Click each to explore.
        </p>
        <div className="card-grid three">
          {checks.map((x, i) => {
            const icons = [ShieldCheck, Radar, Scale];
            const Icon = icons[i];
            const isRead = checkRead[i];
            return (
              <button
                className={`click-card ${isRead ? "read" : ""}`}
                onClick={() => {
                  setCheckRead((r) => r.map((v, j) => (j === i ? true : v)));
                  setModal({
                    title: x[0],
                    text: x[1],
                    image: x[2],
                    direct: true,
                  });
                }}
                key={x[0]}
              >
                <span className="card-icon">
                  <Icon size={28} />
                </span>
                <strong>{x[0]}</strong>
                {isRead ? (
                  <Check className="card-arrow check" size={20} />
                ) : (
                  <ArrowRight className="card-arrow" size={20} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  if (s === 3)
    c = (
      <div className="wide-page">
        <h2>What Responses Leave Behind</h2>
        <p className="lead">
          Here’s something worth sitting with carefully: a risk response changes
          the risk landscape. It does not erase it. Flip both cards to see the
          two things it can leave behind.
        </p>
        <div className="flip-grid">
          {["residual", "secondary"].map((k, i) => (
            <div className="illustrated-flip" key={k}>
              <button
                className={`flip ${cardRead[i] ? "flipped" : ""}`}
                onClick={() =>
                  setCardRead((r) => r.map((v, j) => (j === i ? true : v)))
                }
                aria-label={`Flip ${reveals[k].title} card`}
              >
                <div className="flip-inner">
                  <div className="flip-front risk-flip-front">
                    <img
                      className="flip-card-art"
                      src={img(reveals[k].image)}
                      alt=""
                    />
                    <small>
                      {i ? "NEW RISK CREATED" : "REMAINDER AFTER RESPONSE"}
                    </small>
                    <h3>{reveals[k].title}</h3>
                    <span>Click to flip</span>
                  </div>
                  <div className="flip-back risk-flip-back">
                    <small>{i ? "SECONDARY RISK" : "RESIDUAL RISK"}</small>
                    <h3>{reveals[k].title}</h3>
                    <p>{reveals[k].text}</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
        {cardRead.every(Boolean) && (
          <>
            <p className="callout">
              The discipline that matters here: residual risk gets priced and
              consciously accepted. Secondary risk gets identified right at
              response-planning time and managed like any other entry in the
              register — not discovered as an unpleasant surprise months later.
              A response evaluated without accounting for both its residual and
              secondary consequences hasn’t actually been fully evaluated at
              all.
            </p>
            <button
              className="knowledge-cta centered"
              disabled={done[3]}
              onClick={() => !done[3] && setQuiz(0)}
            >
              {done[3] ? (
                <><Check /> Knowledge check completed</>
              ) : (
                <><Target /> Start knowledge check <ArrowRight /></>
              )}
            </button>
          </>
        )}
      </div>
    );
  if (s === 4)
    c = (
      <div className="wide-page">
        <h2>The Ladder: Trigger, Contingency, Fallback, Workaround</h2>
        <p className="lead">
          One project scenario, followed all the way through, shows exactly how
          these four terms connect — running from fully planned to fully
          improvised. Click each rung to explore.
        </p>
        <div className="card-grid four">
          {ladder.map((x, i) => {
            const icons = [Zap, ShieldAlert, LifeBuoy, Wrench];
            const Icon = icons[i];
            const isRead = ladderRead[i];
            return (
              <button
                className={`click-card ${isRead ? "read" : ""}`}
                onClick={() => {
                  setLadderRead((r) => r.map((v, j) => (j === i ? true : v)));
                  setModal({
                    title: x[0],
                    text: x[1],
                    image: x[2],
                    direct: true,
                  });
                }}
                key={x[0]}
              >
                <span className="card-icon">
                  <Icon size={28} />
                </span>
                <strong>{x[0]}</strong>
                {isRead ? (
                  <Check className="card-arrow check" size={20} />
                ) : (
                  <ArrowRight className="card-arrow" size={20} />
                )}
              </button>
            );
          })}
        </div>
        {ladderRead.every(Boolean) && (
          <>
            <p className="callout">
              This forms a ladder — trigger, to contingency, to fallback, to
              workaround — running from fully planned to fully improvised. The
              entire purpose of good risk planning is to live as high on that
              ladder as possible, so that when trouble arrives, the project is
              executing a plan rather than scrambling for a reaction.
            </p>
            <button
              className="knowledge-cta centered"
              disabled={done[4]}
              onClick={() => !done[4] && setQuiz(1)}
            >
              {done[4] ? (
                <><Check /> Knowledge check completed</>
              ) : (
                <><Target /> Start knowledge check <ArrowRight /></>
              )}
            </button>
          </>
        )}
      </div>
    );
  if (s === 5)
    c = (
      <div className="exam-layout">
        <div className="exam-visual">
          <img src={img("exam-monitoring")} />
        </div>
        <div>
          <h2>Synthesis (Exam Lens)</h2>
          <p className="lead">
            Back to the smoke detector one more time — because the whole point
            of staying armed is that the danger never actually goes away just
            because the plan was written.
          </p>
          <button
            className="primary-cta"
            disabled={done[5]}
            onClick={() => !done[5] && setModal("exam")}
          >
            {done[5] ? "Exam lens reviewed" : "Reveal the exam lens"} <ArrowRight />
          </button>
        </div>
      </div>
    );
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <Award />
          <span>PMP Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                className={`progress-dot ${i < 5 ? "done" : i === 5 ? "active" : ""}`}
                key={i}
              >
                {i < 9 ? <Check size={10} /> : <span />}
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 /> : <VolumeX />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <article className="lesson-card">
            <div className="section-tabs">
              <p>SECTION {s + 1} OF 6</p>
              <div>
                {tabs.map((x, i) => (
                  <button
                    className={`${done[i] ? "done" : ""} ${s === i ? "active" : ""}`}
                    key={x}
                    onClick={() => go(i)}
                  >
                    {done[i] && <Check />}
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="lesson-content">{c}</div>
            {done[s] && (
              <p className="completion">
                <Check /> Interaction complete — continue when ready.
              </p>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={!s}
                onClick={() => go(s - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className={`primary-button ${done[s] ? "unlocked" : ""}`}
                disabled={!done[s]}
                onClick={() => s < 5 && go(s + 1)}
              >
                Continue <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      {modal && (
        <Modal
          d={typeof modal === "string" ? reveals[modal] : modal}
          close={() => setModal(null)}
          done={() => {
            if (modal === "gap") mark(2);
            else if (
              typeof modal === "string" &&
              !["residual", "secondary"].includes(modal)
            )
              mark();
          }}
        />
      )}
      {quiz !== null && (
        <Quiz
          d={quizzes[quiz]}
          finish={() => {
            mark(quiz === 0 ? 3 : 4);
            setQuiz(null);
          }}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
