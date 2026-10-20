import { useState } from 'react'
import './App.css'

const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  scan: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M11 8v6M8 11h6" /></>,
  history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4L5.5 15a8 8 0 0 1 0-1.9l-1.4-1.2 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.2a8 8 0 0 1-.1 1.9Z" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  alert: <><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
}

function Icon({ name, size = 18, ...props }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {iconPaths[name]}
    </svg>
  )
}

const initialHistory = [
  { type: 'URL scan', value: 'https://accounts.google.com', time: '2 min ago', risk: 'Safe', score: 4 },
  { type: 'Email scan', value: 'Invoice payment overdue', time: '18 min ago', risk: 'Suspicious', score: 68 },
  { type: 'URL scan', value: 'https://github.com/security', time: '1 hr ago', risk: 'Safe', score: 7 },
]

const recommendations = [
  { id: 1, icon: 'link', title: 'Double-check unfamiliar links', detail: 'Hover over links to preview the destination before opening.' },
  { id: 2, icon: 'shield', title: 'Turn on two-factor authentication', detail: 'Add an extra layer of protection to your important accounts.' },
  { id: 3, icon: 'mail', title: 'Pause before you click', detail: 'Unexpected urgency is a common sign of a phishing attempt.' },
]

function App() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [history, setHistory] = useState(initialHistory)
  const [riskScore, setRiskScore] = useState(24)
  const [urlResult, setUrlResult] = useState(null)
  const [emailResult, setEmailResult] = useState(null)
  const [dismissed, setDismissed] = useState([])
  const [notice, setNotice] = useState(false)

  const runUrlScan = (value = url) => {
    const cleaned = value.trim()
    if (!cleaned) {
      setUrlResult({ error: 'Enter a URL to run a scan.' })
      return
    }
    let parsed
    try {
      parsed = new URL(cleaned.includes('://') ? cleaned : `https://${cleaned}`)
    } catch {
      setUrlResult({ error: 'That doesn’t look like a valid URL. Check it and try again.' })
      return
    }
    const suspicious = /login|verify|secure|account|free|gift|update|bit\.ly|tinyurl/i.test(parsed.hostname + parsed.pathname) || /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname)
    const score = suspicious ? 82 : 8
    const result = { kind: 'URL scan', value: cleaned, score, risk: suspicious ? 'Suspicious' : 'Safe' }
    setUrlResult(result)
    setRiskScore(score)
    setHistory((items) => [{ ...result, time: 'Just now' }, ...items].slice(0, 8))
  }

  const runEmailScan = () => {
    const cleaned = email.trim()
    if (!cleaned) {
      setEmailResult({ error: 'Paste an email message to analyze.' })
      return
    }
    const suspicious = /urgent|immediately|password|verify|wire transfer|gift card|suspended|click here|payment overdue/i.test(cleaned)
    const score = suspicious ? 76 : 12
    const result = { kind: 'Email scan', value: cleaned.split('\n')[0].slice(0, 56) || 'Email message', score, risk: suspicious ? 'Suspicious' : 'Likely safe' }
    setEmailResult(result)
    setRiskScore(score)
    setHistory((items) => [{ ...result, time: 'Just now' }, ...items].slice(0, 8))
  }

  const visibleRecommendations = recommendations.filter((item) => !dismissed.includes(item.id))
  const scoreTone = riskScore > 60 ? 'high' : riskScore > 35 ? 'medium' : 'low'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActiveTab('overview')}>
          <span className="brand-mark"><Icon name="shield" size={21} /></span>
          <span>shield<span className="brand-ai">ai</span></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {[['overview', 'Overview', 'grid'], ['scans', 'New scan', 'scan'], ['history', 'Scan history', 'history'], ['protection', 'Protection tips', 'shield']].map(([id, label, icon]) => (
            <button className={`nav-item ${activeTab === id ? 'selected' : ''}`} key={id} onClick={() => {
              setActiveTab(id)
              if (id === 'scans') document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })
              if (id === 'history') document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })
              if (id === 'protection') document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })
              if (id === 'overview') window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
              <Icon name={icon} size={18} /> <span>{label}</span>
              {id === 'scans' && <span className="nav-plus">+</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <span className="plan-icon"><Icon name="sparkle" size={16} /></span>
            <strong>Stay one step ahead</strong>
            <p>Your protection is active and up to date.</p>
            <span className="plan-status"><i /> All systems protected</span>
          </div>
          <button className="nav-item settings-item" onClick={() => setNotice(!notice)}><Icon name="settings" size={18} /><span>Settings</span></button>
          <div className="user-profile">
            <div className="avatar">JD</div>
            <div className="user-info"><strong>Jordan Davis</strong><span>Personal workspace</span></div>
            <button className="icon-button user-menu" aria-label="Profile options" onClick={() => setNotice(!notice)}><Icon name="dots" size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><strong>{activeTab === 'overview' ? 'Overview' : activeTab === 'scans' ? 'New scan' : activeTab === 'history' ? 'Scan history' : activeTab === 'protection' ? 'Protection tips' : 'Settings'}</strong></div>
          <div className="topbar-actions">
            <span className="secure-status"><i /> Protected</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice(!notice)}><Icon name="bell" size={18} /><i /></button>
            <div className="top-avatar">JD</div>
            {notice && <div className="notification-popover"><strong>You’re all caught up</strong><span>No new security alerts right now.</span></div>}
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> YOUR DIGITAL SAFETY, AT A GLANCE</div>
              <h1>Good morning, Jordan <span className="wave">✦</span></h1>
              <p className="welcome-copy">Your digital world is looking good. Let’s keep it that way.</p>
            </div>
            <div className="date-chip"><Icon name="clock" size={15} /> Tuesday, October 20</div>
          </section>

          <section className="stats-grid" aria-label="Security overview">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon violet"><Icon name="scan" size={18} /></span><span className="trend positive">+12.5%</span></div>
              <span className="stat-value">{history.length + 125}</span><span className="stat-label">Items scanned</span>
              <div className="mini-bars" aria-hidden="true">{[26, 40, 33, 58, 46, 69, 53, 81, 60, 92, 72, 100].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon pink"><Icon name="alert" size={18} /></span><span className="trend neutral">This month</span></div>
              <span className="stat-value">08</span><span className="stat-label">Threats blocked</span>
              <div className="stat-foot"><span className="tiny-dot pink-dot" /> You’re safer than 94% of users</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon green"><Icon name="shield" size={18} /></span><span className="trend positive">Excellent</span></div>
              <span className="stat-value">98<span className="value-unit">/100</span></span><span className="stat-label">Protection score</span>
              <div className="progress-track"><i style={{ width: '98%' }} /></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon blue"><Icon name="globe" size={18} /></span><span className="trend neutral">Last 7 days</span></div>
              <span className="stat-value">24<span className="value-unit"> hrs</span></span><span className="stat-label">Time protected</span>
              <div className="stat-foot"><span className="tiny-dot green-dot" /> Real-time monitoring active</div>
            </article>
          </section>

          <section className="section-heading" id="scanner">
            <div><h2>Quick scan</h2><p>Check links and messages before you trust them.</p></div>
            <span className="demo-tag"><span /> DEMO ANALYSIS</span>
          </section>

          <section className="scanner-grid">
            <article className="panel scan-panel">
              <div className="panel-heading">
                <span className="panel-icon url-icon"><Icon name="link" size={19} /></span>
                <div><h3>URL phishing scanner</h3><p>Is this link safe to open?</p></div>
                <span className="input-badge">URL</span>
              </div>
              <label className="sr-only" htmlFor="url-input">Website URL to scan</label>
              <div className="input-wrap"><Icon name="globe" size={17} /><input id="url-input" type="text" placeholder="Paste a link, e.g. https://example.com" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && runUrlScan()} /><button className="scan-button" onClick={() => runUrlScan()}>Scan link <Icon name="arrow" size={15} /></button></div>
              {urlResult ? <div className={`scan-result ${urlResult.error ? 'error-result' : urlResult.score > 60 ? 'danger-result' : 'safe-result'}`} role="status">
                <span className="result-symbol"><Icon name={urlResult.error || urlResult.score > 60 ? 'alert' : 'check'} size={15} /></span>
                <span>{urlResult.error || <><strong>{urlResult.risk}</strong> · Demo risk score {urlResult.score}/100 for <b>{urlResult.value}</b></>}</span>
                {!urlResult.error && <span className="result-score">{urlResult.score}/100</span>}
              </div> : <button className="sample-link" onClick={() => { setUrl('https://accounts.google.com'); runUrlScan('https://accounts.google.com') }}>Try a sample URL <Icon name="arrow" size={13} /></button>}
              <div className="scan-footnote"><Icon name="shield" size={13} /> Your scans stay private on this device</div>
            </article>

            <article className="panel scan-panel email-panel">
              <div className="panel-heading">
                <span className="panel-icon email-icon"><Icon name="mail" size={19} /></span>
                <div><h3>Suspicious email analyzer</h3><p>Spot red flags in a message.</p></div>
                <span className="input-badge">EMAIL</span>
              </div>
              <label className="sr-only" htmlFor="email-input">Email message to analyze</label>
              <textarea id="email-input" placeholder="Paste the email text you'd like to check..." value={email} onChange={(event) => setEmail(event.target.value)} />
              <div className="email-controls"><span className="input-hint">We’ll look for common phishing signals.</span><button className="scan-button" onClick={runEmailScan}>Analyze email <Icon name="arrow" size={15} /></button></div>
              {emailResult && <div className={`scan-result ${emailResult.error ? 'error-result' : emailResult.score > 60 ? 'danger-result' : 'safe-result'}`} role="status">
                <span className="result-symbol"><Icon name={emailResult.error || emailResult.score > 60 ? 'alert' : 'check'} size={15} /></span>
                <span>{emailResult.error || <><strong>{emailResult.risk}</strong> · Demo risk score {emailResult.score}/100 — “{emailResult.value}”</>}</span>
                {!emailResult.error && <span className="result-score">{emailResult.score}/100</span>}
              </div>}
            </article>
          </section>

          <section className="insights-grid">
            <article className="panel risk-panel">
              <div className="panel-title-row"><div><h3>Your risk overview</h3><p>Based on your most recent scan</p></div><button className="icon-button subtle-button" aria-label="Risk overview options"><Icon name="dots" size={18} /></button></div>
              <div className="risk-content">
                <div className={`risk-gauge ${scoreTone}`} style={{ '--score': `${riskScore * 3.6}deg` }}><div className="gauge-center"><strong>{riskScore}</strong><span>RISK SCORE</span></div></div>
                <div className="risk-copy"><span className={`risk-state ${scoreTone}`}><i /> {scoreTone === 'low' ? 'Looking good' : scoreTone === 'medium' ? 'Stay alert' : 'Needs attention'}</span><h4>{scoreTone === 'low' ? 'You’re in a safe zone' : scoreTone === 'medium' ? 'Be cautious online' : 'Potential threat detected'}</h4><p>{scoreTone === 'low' ? 'No major threats detected. Keep up your safe browsing habits.' : 'Your latest scan flagged a few things worth reviewing.'}</p><span className="updated-label"><Icon name="clock" size={13} /> Updated just now</span></div>
              </div>
              <div className="risk-legend"><span><i className="legend-low" /> Low risk <b>0–35</b></span><span><i className="legend-medium" /> Medium <b>36–60</b></span><span><i className="legend-high" /> High <b>61–100</b></span></div>
            </article>

            <article className="panel recommendations-panel" id="recommendations">
              <div className="panel-title-row"><div><h3>Safety recommendations</h3><p>Small habits, stronger security.</p></div><span className="recommendation-count">{visibleRecommendations.length}</span></div>
              <div className="recommendation-list">
                {visibleRecommendations.length ? visibleRecommendations.map((item) => <div className="recommendation" key={item.id}>
                  <span className="recommendation-icon"><Icon name={item.icon} size={16} /></span><div className="recommendation-text"><strong>{item.title}</strong><span>{item.detail}</span></div><button className="dismiss-button" aria-label={`Dismiss ${item.title}`} onClick={() => setDismissed((items) => [...items, item.id])}><Icon name="close" size={15} /></button>
                </div>) : <div className="all-done"><span><Icon name="check" size={18} /></span><strong>You’re all caught up!</strong><p>Check back later for new safety tips.</p></div>}
              </div>
            </article>
          </section>

          <section className="panel history-panel" id="history">
            <div className="panel-title-row history-title"><div><h3>Recent scans</h3><p>Your latest security checks in one place.</p></div><button className="view-all-button" onClick={() => setActiveTab('history')}>View all scans <Icon name="arrow" size={14} /></button></div>
            <div className="history-table-wrap">
              <table>
                <thead><tr><th>TYPE</th><th>ITEM SCANNED</th><th>TIME</th><th>RESULT</th><th>RISK SCORE</th><th /></tr></thead>
                <tbody>{history.slice(0, 4).map((item, index) => <tr key={`${item.time}-${index}-${item.value}`}>
                  <td><span className={`history-type ${item.type === 'Email scan' ? 'email-type' : ''}`}><Icon name={item.type === 'Email scan' ? 'mail' : 'link'} size={15} />{item.type}</span></td>
                  <td className="history-value" title={item.value}>{item.value}</td><td className="history-time">{item.time}</td><td><span className={`result-pill ${item.score > 60 ? 'pill-danger' : 'pill-safe'}`}><i />{item.risk}</span></td><td><span className={`score-pill ${item.score > 60 ? 'score-danger' : ''}`}>{String(item.score).padStart(2, '0')}<span>/100</span></span></td>
                  <td><button className="icon-button row-menu" aria-label={`More options for ${item.value}`}><Icon name="dots" size={17} /></button></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="history-footer"><span><Icon name="shield" size={13} /> Demo scans are analyzed locally and aren’t sent to a server.</span><button onClick={() => setHistory([])} disabled={!history.length}>Clear history</button></div>
          </section>
          <footer className="page-footer"><span>© 2026 Shield AI</span><span><i /> All systems operational</span><span>Built for a safer internet <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
