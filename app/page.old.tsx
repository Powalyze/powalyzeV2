export default function HomePage() {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <title>Powalyze – Cockpit Exécutif & Gouvernance IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* ROOT TOKENS */
          :root {
            --gold: #C9A227;
            --blue: #0047FF;
            --text: #0A0A0A;
            --muted: #6B6B6B;
            --bg: #FFFFFF;
            --bg-soft: #F5F5F7;
            --border-soft: #E3E3E7;
            --radius: 14px;
            --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.06);
            --transition-fast: 0.2s ease;
            --transition-med: 0.35s ease;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --text: #F5F5F5;
              --muted: #A0A0A0;
              --bg: #050509;
              --bg-soft: #101018;
              --border-soft: #262633;
              --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.7);
            }
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
            background: radial-gradient(circle at top, #f7f7fb 0, var(--bg) 45%);
            color: var(--text);
            -webkit-font-smoothing: antialiased;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          img {
            max-width: 100%;
            display: block;
          }

          main {
            width: 92%;
            max-width: 1200px;
            margin: 0 auto;
            padding-top: 96px;
            padding-bottom: 80px;
          }

          section {
            margin-bottom: 96px;
          }

          h1, h2, h3 {
            letter-spacing: -0.03em;
          }

          h1 {
            font-size: clamp(2.6rem, 4vw, 3.4rem);
            color: #FFFFFF;
            margin-bottom: 18px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 2px 10px rgba(0, 0, 0, 0.6), 0 0 40px rgba(244, 208, 63, 0.3);
          }

          h2 {
            font-size: clamp(1.9rem, 3vw, 2.4rem);
            margin-bottom: 18px;
          }

          h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
          }

          p {
            color: var(--muted);
            line-height: 1.6;
            font-size: 0.98rem;
          }

          /* NAVBAR */
          .nav {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 9999;
            padding: 16px 0;
            background: transparent;
            transition: background var(--transition-med), backdrop-filter var(--transition-med), box-shadow var(--transition-med);
          }

          .nav.scrolled {
            backdrop-filter: blur(14px);
            background: rgba(255, 255, 255, 0.78);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          }

          @media (prefers-color-scheme: dark) {
            .nav.scrolled {
              background: rgba(5, 5, 9, 0.82);
            }
          }

          .nav-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: var(--gold);
            transition: width 0.1s linear;
          }

          .nav-inner {
            width: 92%;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .nav-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--text);
          }

          .nav-logo svg {
            filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12));
          }

          .nav-links {
            display: flex;
            gap: 26px;
            list-style: none;
            font-size: 0.95rem;
          }

          .nav-links a {
            position: relative;
            color: var(--muted);
            transition: color var(--transition-fast);
          }

          .nav-links a::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -6px;
            width: 0;
            height: 2px;
            background: var(--blue);
            border-radius: 999px;
            transition: width var(--transition-fast);
          }

          .nav-links a:hover {
            color: var(--text);
          }

          .nav-links a:hover::after {
            width: 100%;
          }

          .nav-links .pro-link {
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.08) 100%);
            padding: 6px 14px;
            border-radius: 999px;
            border: 1px solid rgba(201, 162, 39, 0.3);
            font-weight: 600;
            color: var(--gold);
          }

          .nav-links .pro-link::after {
            display: none;
          }

          .nav-links .pro-link:hover {
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.25) 0%, rgba(201, 162, 39, 0.15) 100%);
            border-color: rgba(201, 162, 39, 0.5);
          }

          .nav-cta {
            padding: 9px 18px;
            border-radius: 999px;
            background: var(--gold);
            color: #fff;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 12px 30px rgba(201, 162, 39, 0.35);
            transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
          }

          .nav-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 40px rgba(201, 162, 39, 0.45);
            background: #d4b33a;
          }

          .nav-burger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
          }

          .nav-burger span {
            width: 24px;
            height: 2.5px;
            background: var(--text);
            border-radius: 999px;
            transition: transform var(--transition-fast), opacity var(--transition-fast);
          }

          .nav-mobile {
            display: none;
            flex-direction: column;
            gap: 18px;
            padding: 18px 4%;
            background: var(--bg);
            border-bottom: 1px solid var(--border-soft);
          }

          .nav-mobile a {
            font-size: 0.98rem;
            color: var(--muted);
          }

          .nav-cta-mobile {
            background: var(--gold);
            color: #fff;
            padding: 10px 0;
            border-radius: 999px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 12px 30px rgba(201, 162, 39, 0.35);
          }

          /* HERO FULLSCREEN */
          .hero {
            position: relative;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            margin-left: calc(-50vw + 50%);
            margin-right: calc(-50vw + 50%);
            overflow: hidden;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 80px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          /* OVERLAY POUR LIRE LE TEXTE */
          .hero-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2;
          }

          /* CONTENT */
          .hero-content {
            position: relative;
            z-index: 3;
            max-width: 700px;
            width: 90%;
            padding: 40px;
            padding-bottom: 60px;
            color: white;
          }

          /* BADGE */
          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-size: 0.85rem;
            margin-bottom: 16px;
            color: white;
          }

          .hero-badge .dot {
            width: 8px;
            height: 8px;
            background: #1ED760;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(30, 215, 96, 0.3);
            animation: pulse 2s infinite;
          }

          /* TITRE */
          .hero-title {
            font-size: clamp(2.6rem, 5vw, 4.2rem);
            font-weight: 700;
            margin-bottom: 16px;
            color: #C9A227;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8), 0 4px 40px rgba(0, 0, 0, 0.6);
          }

          /* SOUS-TITRE */
          .hero-subtitle {
            font-size: clamp(1.1rem, 1.8vw, 1.4rem);
            margin-bottom: 26px;
            color: #FFFFFF;
            line-height: 1.7;
            text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8), 0 1px 5px rgba(0, 0, 0, 0.6);
          }

          /* CTAS */
          .hero-ctas {
            display: flex;
            gap: 14px;
          }

          .cta-primary {
            padding: 12px 22px;
            background: #C9A227;
            color: white;
            border-radius: 999px;
            font-weight: 600;
            transition: 0.25s ease;
            text-decoration: none;
            display: inline-block;
          }

          .cta-primary:hover {
            transform: translateY(-2px);
            background: #E8C547;
          }

          .cta-secondary {
            padding: 12px 22px;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.15);
            color: white;
            transition: 0.25s ease;
            text-decoration: none;
            display: inline-block;
          }

          .cta-secondary:hover {
            background: rgba(255, 255, 255, 0.25);
          }

          .video-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 999px;
            border: 1px solid rgba(244, 208, 63, 0.5);
            background: rgba(244, 208, 63, 0.15);
            backdrop-filter: blur(10px);
            font-size: 0.85rem;
            color: #F4D03F;
            margin-bottom: 20px;
            font-weight: 600;
            letter-spacing: 0.3px;
          }

          .hero-badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #1ED760;
            box-shadow: 0 0 0 3px rgba(30, 215, 96, 0.3), 0 0 8px rgba(30, 215, 96, 0.5);
            animation: pulse 2s infinite;
          }

          .hero-subtitle {
            font-size: 1.25rem;
            color: #F4D03F;
            margin-bottom: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 15px rgba(0, 0, 0, 0.7), 0 1px 5px rgba(0, 0, 0, 0.5);
          }

          .hero-text {
            margin-bottom: 32px;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 400;
            line-height: 1.8;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5);
          }

          .hero-ctas {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            margin-bottom: 18px;
          }

          .hero-cta-primary {
            padding: 11px 20px;
            border-radius: 999px;
            background: var(--gold);
            color: #fff;
            font-weight: 600;
            font-size: 0.95rem;
            box-shadow: 0 16px 40px rgba(201, 162, 39, 0.45);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
          }

          .hero-cta-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 20px 50px rgba(201, 162, 39, 0.55);
            background: #d4b33a;
          }

          .hero-cta-secondary {
            padding: 10px 18px;
            border-radius: 999px;
            border: 1px solid var(--border-soft);
            background: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--muted);
            transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          }

          .hero-cta-secondary:hover {
            background: var(--bg-soft);
            border-color: var(--gold);
            color: var(--text);
          }

          .hero-meta {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
          }

          .hero-meta span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .hero-meta-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--gold);
          }

          .hero-visual {
            position: relative;
            border-radius: 26px;
            background: radial-gradient(circle at top left, rgba(201, 162, 39, 0.18), transparent 55%), var(--bg-soft);
            padding: 18px;
            box-shadow: var(--shadow-soft);
            overflow: hidden;
            min-height: 260px;
          }

          .hero-visual-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            font-size: 0.8rem;
            color: var(--muted);
          }

          .hero-visual-dots {
            display: flex;
            gap: 6px;
          }

          .hero-visual-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #E57373;
          }

          .hero-visual-dots span:nth-child(2) {
            background: #FFB74D;
          }

          .hero-visual-dots span:nth-child(3) {
            background: #81C784;
          }

          .hero-visual-tag {
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.04);
            font-size: 0.75rem;
          }

          .hero-visual-main {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 16px;
            align-items: flex-start;
          }

          .hero-visual-panel {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 18px;
            padding: 12px 14px;
            border: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
            transform: translateY(10px);
            opacity: 0;
            animation: floatIn 0.9s var(--transition-med) forwards;
          }

          .hero-visual-panel:nth-child(2) {
            animation-delay: 0.18s;
          }

          @media (prefers-color-scheme: dark) {
            .hero-visual-panel {
              background: rgba(10, 10, 18, 0.96);
              border-color: rgba(255, 255, 255, 0.04);
            }
          }

          .hero-visual-panel h3 {
            font-size: 0.9rem;
            margin-bottom: 6px;
          }

          .hero-visual-panel p {
            font-size: 0.8rem;
          }

          .hero-visual-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
          }

          .hero-visual-badge {
            font-size: 0.7rem;
            padding: 4px 8px;
            border-radius: 999px;
            background: rgba(0, 71, 255, 0.06);
            color: var(--blue);
          }

          .hero-visual-badge.gold {
            background: rgba(201, 162, 39, 0.08);
            color: var(--gold);
          }

          .hero-visual-metric {
            margin-top: 10px;
            font-size: 0.78rem;
            color: var(--muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .hero-visual-metric strong {
            font-size: 1.1rem;
            color: var(--text);
          }

          .hero-visual-pill {
            position: absolute;
            bottom: 18px;
            right: 18px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
            font-size: 0.75rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(10px);
            transform: translateY(12px);
            opacity: 0;
            animation: pillIn 0.7s ease-out 0.4s forwards;
          }

          .hero-visual-pill-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #1ED760;
          }

          /* MANIFESTO */
          .manifesto {
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            gap: 40px;
            align-items: flex-start;
          }

          .manifesto-pillars {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .pillar {
            border-radius: 16px;
            padding: 14px 14px 16px;
            background: var(--bg-soft);
            border: 1px solid var(--border-soft);
            font-size: 0.85rem;
            transform: translateY(12px);
            opacity: 0;
          }

          .pillar h3 {
            font-size: 0.9rem;
            margin-bottom: 6px;
            color: var(--text);
          }

          .pillar span {
            display: inline-block;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
            margin-bottom: 6px;
          }

          /* COCKPIT SECTION */
          .cockpit {
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            gap: 40px;
            align-items: center;
          }

          .cockpit-visual {
            border-radius: 22px;
            background: var(--bg-soft);
            padding: 16px;
            box-shadow: var(--shadow-soft);
            position: relative;
            overflow: hidden;
          }

          .cockpit-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .cockpit-card {
            border-radius: 14px;
            padding: 12px 12px 14px;
            background: var(--bg);
            border: 1px solid var(--border-soft);
            font-size: 0.8rem;
            transform: translateY(14px);
            opacity: 0;
          }

          .cockpit-card h3 {
            font-size: 0.9rem;
            margin-bottom: 4px;
          }

          .cockpit-tag {
            font-size: 0.7rem;
            color: var(--muted);
            margin-bottom: 6px;
          }

          .cockpit-chip-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
          }

          .cockpit-chip {
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.04);
          }

          /* IA NARRATIVE */
          .ia {
            border-radius: 22px;
            background: var(--bg-soft);
            padding: 22px 20px;
            box-shadow: var(--shadow-soft);
          }

          .ia-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-top: 16px;
          }

          .ia-card {
            border-radius: 16px;
            padding: 14px;
            background: var(--bg);
            border: 1px solid var(--border-soft);
            font-size: 0.8rem;
            position: relative;
            overflow: hidden;
            transition: transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-med);
          }

          .ia-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            animation: scanline 3s linear infinite;
          }

          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .ia-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(201, 162, 39, 0.15);
            border-color: rgba(201, 162, 39, 0.4);
          }

          .ia-card h3 {
            font-size: 0.95rem;
            margin-bottom: 8px;
            color: var(--gold);
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .ia-card h3::before {
            content: "⚡";
            font-size: 0.85rem;
          }

          .ia-stream {
            margin-top: 8px;
            font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 0.75rem;
            color: var(--muted);
            min-height: 60px;
            white-space: pre-line;
            line-height: 1.5;
            position: relative;
            padding: 8px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.02);
          }

          .ia-cursor {
            display: inline-block;
            width: 8px;
            height: 1rem;
            background: var(--gold);
            margin-left: 2px;
            animation: blink 0.9s step-start infinite;
            vertical-align: bottom;
            box-shadow: 0 0 8px var(--gold);
            border-radius: 2px;
          }

          /* SERVICES */
          .services-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .service-card {
            border-radius: 18px;
            padding: 16px 16px 18px;
            border: 1px solid var(--border-soft);
            background: var(--bg);
            font-size: 0.85rem;
            transition: transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-med);
          }

          .service-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-soft);
            border-color: rgba(201, 162, 39, 0.6);
          }

          .service-card h3 {
            font-size: 1rem;
            margin-bottom: 8px;
          }

          .service-tag {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
            margin-bottom: 6px;
          }

          /* USE CASES */
          .usecases-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
          }

          .usecase-card {
            border-radius: 16px;
            padding: 12px 12px 14px;
            background: var(--bg-soft);
            border: 1px solid var(--border-soft);
            font-size: 0.8rem;
          }

          .usecase-role {
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .usecase-action {
            font-size: 0.78rem;
            color: var(--muted);
          }

          /* TESTIMONIALS */
          .testimonials {
            border-radius: 22px;
            background: var(--bg-soft);
            padding: 22px 20px;
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
            gap: 30px;
            align-items: center;
          }

          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .testimonial-card {
            border-radius: 16px;
            padding: 12px 12px 14px;
            background: var(--bg);
            border: 1px solid var(--border-soft);
            font-size: 0.8rem;
          }

          .testimonial-quote {
            font-size: 0.8rem;
            color: var(--muted);
            margin-bottom: 8px;
          }

          .testimonial-name {
            font-size: 0.8rem;
            font-weight: 600;
          }

          .testimonial-role {
            font-size: 0.75rem;
            color: var(--muted);
          }

          /* FAQ */
          .faq {
            max-width: 800px;
            margin: 0 auto;
          }

          .faq-item {
            border-bottom: 1px solid var(--border-soft);
            padding: 12px 0;
          }

          .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 0.95rem;
            padding: 6px 0;
          }

          .faq-question span {
            font-weight: 500;
          }

          .faq-toggle {
            font-size: 1.2rem;
            color: var(--muted);
            transition: transform var(--transition-fast);
          }

          .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.25s ease;
          }

          .faq-answer p {
            font-size: 0.85rem;
            padding: 4px 0 10px;
          }

          .faq-item.open .faq-answer {
            max-height: 200px;
          }

          .faq-item.open .faq-toggle {
            transform: rotate(45deg);
          }

          /* FINAL CTA */
          .final-cta {
            border-radius: 22px;
            padding: 26px 22px;
            background: radial-gradient(circle at top left, rgba(201, 162, 39, 0.16), transparent 55%), var(--bg-soft);
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .final-cta h2 {
            margin-bottom: 4px;
          }

          .final-cta p {
            margin-bottom: 10px;
          }

          .final-cta-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .final-cta-secondary {
            padding: 10px 18px;
            border-radius: 999px;
            border: 1px solid var(--border-soft);
            background: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            color: var(--muted);
            transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          }

          .final-cta-secondary:hover {
            background: var(--bg);
            border-color: var(--gold);
            color: var(--text);
          }

          /* FOOTER */
          footer {
            border-top: 1px solid var(--border-soft);
            padding: 22px 4% 26px;
            font-size: 0.8rem;
            color: var(--muted);
          }

          .footer-inner {
            width: 92%;
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .footer-title {
            font-weight: 600;
            margin-bottom: 6px;
            color: var(--text);
          }

          .footer-col a {
            display: block;
            margin-bottom: 4px;
          }

          .footer-meta {
            margin-top: 10px;
            font-size: 0.75rem;
          }

          /* ANIMATIONS */
          @keyframes floatIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pillIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes blink {
            0%, 50% {
              opacity: 1;
            }
            50.01%, 100% {
              opacity: 0;
            }
          }

          .reveal {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }

          .reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }

          /* MOBILE-FIRST ADAPTATION */
          @media (max-width: 900px) {
            main {
              padding-top: 82px;
            }

            .nav-inner {
              width: 92%;
            }

            .nav-links,
            .nav-cta {
              display: none;
            }

            .nav-burger {
              display: flex;
            }

            .nav-mobile.active {
              display: flex;
            }

            .hero {
              height: 100vh;
              padding-bottom: 40px;
            }

            .hero-content {
              text-align: center;
              padding: 20px;
              padding-bottom: 30px;
            }

            .hero-title {
              font-size: clamp(2rem, 8vw, 2.8rem);
              margin-bottom: 12px;
            }

            .hero-subtitle {
              font-size: clamp(1rem, 3.5vw, 1.2rem);
              margin-bottom: 20px;
            }

            .hero-ctas {
              flex-direction: column;
              align-items: center;
              gap: 12px;
            }

            .nav-lang {
              display: none;
            }

            .manifesto,
            .cockpit,
            .testimonials {
              grid-template-columns: minmax(0, 1fr);
            }

            .manifesto-pillars {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .cockpit-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .ia-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .services-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .usecases-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .testimonials-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .footer-inner {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 640px) {
            .manifesto-pillars {
              grid-template-columns: minmax(0, 1fr);
            }

            .cockpit-grid,
            .ia-grid,
            .services-grid,
            .usecases-grid,
            .testimonials-grid {
              grid-template-columns: minmax(0, 1fr);
            }

            .footer-inner {
              grid-template-columns: minmax(0, 1fr);
            }

            section {
              margin-bottom: 48px;
              padding: 0 20px;
            }

            .section-title {
              font-size: clamp(1.8rem, 6vw, 2.4rem);
              margin-bottom: 16px;
            }

            .section-subtitle {
              font-size: clamp(0.95rem, 3vw, 1.1rem);
              margin-bottom: 32px;
            }
          }
        `}} />
      </head>
      <body>
        {/* NAVBAR */}
        <nav className="nav">
          <div className="nav-progress"></div>
          <div className="nav-inner">
            <div className="nav-logo">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#C9A227" strokeWidth="4" />
                <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227" />
              </svg>
              <span>Powalyze</span>
            </div>
            <ul className="nav-links">
              <li><a href="#cockpit">Cockpit</a></li>
              <li><a href="#ia">IA Narrative</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="/pro" className="pro-link">Pro</a></li>
            </ul>
            <div className="nav-lang">
              <button className="active" data-lang="fr">FR</button>
              <button data-lang="en">EN</button>
            </div>
            <a href="/pro" className="nav-cta">Accès Client</a>
            <div className="nav-burger" id="nav-burger">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div className="nav-mobile" id="nav-mobile">
            <a href="#cockpit">Cockpit</a>
            <a href="#ia">IA Narrative</a>
            <a href="#services">Services</a>
            <a href="#faq">FAQ</a>
            <a href="/pro">Pro</a>
            <a href="/pro" className="nav-cta-mobile">Accès Client</a>
          </div>
        </nav>

        <main>
          {/* HERO */}
          <section className="hero" id="hero">
            <div className="hero-overlay"></div>

            <div className="hero-content">
              <div className="hero-badge">
                <span className="dot"></span>
                <span>Cockpit Exécutif · IA Narrative · Excellence</span>
              </div>

              <h1 className="hero-title">Le Cockpit Exécutif qui pense avec vous</h1>

              <p className="hero-subtitle">
                Une vue 360° de votre organisation, enrichie par l'IA narrative, pour piloter vos décisions avec précision et excellence.
              </p>

              <div className="hero-ctas">
                <a href="/cockpit" className="cta-primary">Accéder au cockpit</a>
                <a href="#cockpit" className="cta-secondary">Voir la démonstration</a>
              </div>
            </div>
          </section>

          {/* MANIFESTO */}
          <section className="manifesto" id="manifesto">
            <div>
              <h2>La précision appliquée à la gouvernance</h2>
              <p>
                Powalyze est conçu comme un instrument de précision : chaque module, chaque vue, chaque interaction est pensé pour servir la clarté, la rigueur et la fiabilité de votre gouvernance. Rien n'est décoratif, tout est utile.
              </p>
            </div>
            <div className="manifesto-pillars">
              <div className="pillar reveal">
                <span>Clarté</span>
                <h3>Une seule source de vérité</h3>
                <p>Vos décisions, vos risques, vos projets et vos comités sont alignés dans un cockpit unique.</p>
              </div>
              <div className="pillar reveal">
                <span>Rigueur</span>
                <h3>Structure exécutive sans compromis</h3>
                <p>Une architecture pensée pour les dirigeants, les PMO et les conseils d'administration.</p>
              </div>
              <div className="pillar reveal">
                <span>Fiabilité</span>
                <h3>Conçu pour durer</h3>
                <p>Une approche rigoureuse : stable, robuste, documentée, au service du temps long.</p>
              </div>
            </div>
          </section>

          {/* VIDEO COCKPIT EXECUTIF */}
          <section id="video-demo">
            <h2>Découvrez Powalyze en action</h2>
            <p className="mb-6 text-center max-w-[700px] mx-auto">
              Plongez dans l'univers du Cockpit Exécutif : une démonstration immersive de la gouvernance augmentée par l'IA.
            </p>
            <div className="video-container">
              <video 
                id="cockpit-video"
                controls
                loop
                preload="auto"
                poster="/video-poster.jpg"
                className="w-full max-w-[1200px] rounded-2xl shadow-lg"
              >
                <source src="/cockpit-executif.mp4" type="video/mp4" />
              </video>
            </div>
          </section>

          {/* COCKPIT */}
          <section className="cockpit" id="cockpit">
            <div>
              <h2>Votre centre de gravité exécutif</h2>
              <p>
                Le cockpit Powalyze rassemble vos données, vos décisions et vos arbitrages dans une interface unique. Vous ne consultez plus des tableaux : vous pilotez un système vivant, narratif et actionnable.
              </p>
              <div className="mt-4">
                <a href="/cockpit" className="hero-cta-primary px-4 py-2 text-[0.9rem]">Explorer le cockpit</a>
              </div>
            </div>
            <div className="cockpit-visual">
              <div className="cockpit-grid">
                <div className="cockpit-card reveal">
                  <div className="cockpit-tag">Vue 360°</div>
                  <h3>Écosystème complet</h3>
                  <p>Entités, projets, risques, décisions, comités : tout est relié, tout est traçable.</p>
                  <div className="cockpit-chip-row">
                    <span className="cockpit-chip">Portefeuille projets</span>
                    <span className="cockpit-chip">Risques critiques</span>
                  </div>
                </div>
                <div className="cockpit-card reveal">
                  <div className="cockpit-tag">Pilotage</div>
                  <h3>Objectifs & arbitrages</h3>
                  <p>Suivez vos objectifs, vos écarts, vos arbitrages et vos décisions dans un même flux.</p>
                  <div className="cockpit-chip-row">
                    <span className="cockpit-chip">OKR exécutifs</span>
                    <span className="cockpit-chip">Décisions en attente</span>
                  </div>
                </div>
                <div className="cockpit-card reveal">
                  <div className="cockpit-tag">Exécution</div>
                  <h3>Actions concrètes</h3>
                  <p>Chaque décision se traduit en actions, responsables, échéances et suivis.</p>
                  <div className="cockpit-chip-row">
                    <span className="cockpit-chip">Plans d'actions</span>
                    <span className="cockpit-chip">Suivi comités</span>
                  </div>
                </div>
                <div className="cockpit-card reveal">
                  <div className="cockpit-tag">Synchronisation</div>
                  <h3>Un cockpit vivant</h3>
                  <p>Le cockpit se met à jour en continu, au rythme de vos décisions et de vos projets.</p>
                  <div className="cockpit-chip-row">
                    <span className="cockpit-chip">Mises à jour IA</span>
                    <span className="cockpit-chip">Alertes intelligentes</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* IA NARRATIVE */}
          <section id="ia">
            <div className="ia">
              <h2>L'IA qui raconte votre entreprise</h2>
              <p>
                L'IA narrative de Powalyze ne se contente pas de résumer des données : elle raconte votre entreprise dans le langage des dirigeants, propose des scénarios et éclaire vos arbitrages.
              </p>
              <div className="ia-grid">
                <div className="ia-card">
                  <h3>Résumé exécutif</h3>
                  <div className="ia-stream" data-ia-text="Synthèse des risques critiques, des décisions en attente et des arbitrages à venir pour le prochain comité exécutif.">
                    <span className="ia-cursor"></span>
                  </div>
                </div>
                <div className="ia-card">
                  <h3>Analyse d'un risque</h3>
                  <div className="ia-stream" data-ia-text="Identification des impacts, scénarios de mitigation et recommandations priorisées pour la direction.">
                    <span className="ia-cursor"></span>
                  </div>
                </div>
                <div className="ia-card">
                  <h3>Simulation de scénario</h3>
                  <div className="ia-stream" data-ia-text="Projection des effets d'un arbitrage stratégique sur vos projets, vos ressources et vos risques.">
                    <span className="ia-cursor"></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services">
            <h2>Accompagnement exécutif sur mesure</h2>
            <p className="mb-4">
              Powalyze n'est pas seulement un cockpit : c'est aussi un accompagnement exécutif, data et IA, pour structurer, piloter et faire vivre votre gouvernance.
            </p>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-tag">Gouvernance & Stratégie</div>
                <h3>Architecture exécutive</h3>
                <p>Conception et structuration de votre cockpit de gouvernance, de vos comités et de vos circuits de décision.</p>
              </div>
              <div className="service-card">
                <div className="service-tag">Data & Power BI</div>
                <h3>Clarté des données</h3>
                <p>Modélisation, visualisation et mise en scène de vos données pour servir vos décisions, pas l'inverse.</p>
              </div>
              <div className="service-card">
                <div className="service-tag">IA & Automatisation</div>
                <h3>Décisions augmentées</h3>
                <p>Intégration d'IA narrative, d'alertes intelligentes et d'automatisations au cœur de votre gouvernance.</p>
              </div>
            </div>
          </section>

          {/* USE CASES */}
          <section>
            <h2>Conçu pour les dirigeants exigeants</h2>
            <p className="mb-4">
              Powalyze s'adresse aux dirigeants, aux PMO et aux conseils qui refusent les dashboards génériques et veulent un cockpit exécutif à la hauteur de leurs enjeux.
            </p>
            <div className="usecases-grid">
              <div className="usecase-card">
                <div className="usecase-role">CEO</div>
                <div className="usecase-action">Une vue claire des risques, des arbitrages et des décisions à prendre cette semaine.</div>
              </div>
              <div className="usecase-card">
                <div className="usecase-role">COO</div>
                <div className="usecase-action">Un pilotage opérationnel aligné avec la stratégie, sans perdre la vue d'ensemble.</div>
              </div>
              <div className="usecase-card">
                <div className="usecase-role">PMO</div>
                <div className="usecase-action">Un cockpit pour orchestrer projets, ressources, risques et comités sans friction.</div>
              </div>
              <div className="usecase-card">
                <div className="usecase-role">Conseil d'administration</div>
                <div className="usecase-action">Des synthèses exécutives fiables, structurées et actionnables à chaque séance.</div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="testimonials">
            <div>
              <h2>La confiance avant tout</h2>
              <p>
                Powalyze est pensé pour les organisations qui exigent de la précision, de la fiabilité et une gouvernance sans compromis. Chaque cockpit est construit comme un instrument de confiance.
              </p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-quote">« Nous avons enfin un cockpit qui parle le langage du comité exécutif. »</div>
                <div className="testimonial-name">Directeur Général</div>
                <div className="testimonial-role">Groupe industriel européen</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-quote">« Les décisions sont plus rapides, mieux documentées et mieux suivies. »</div>
                <div className="testimonial-name">COO</div>
                <div className="testimonial-role">Entreprise de services</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-quote">« Le cockpit a transformé la façon dont nous préparons nos conseils. »</div>
                <div className="testimonial-name">Secrétaire du Conseil</div>
                <div className="testimonial-role">Institution financière</div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="faq">
            <h2>Clarté totale</h2>
            <div className="faq-item">
              <div className="faq-question">
                <span>Powalyze est-il un outil ou une méthode&nbsp;?</span>
                <div className="faq-toggle">+</div>
              </div>
              <div className="faq-answer">
                <p>Powalyze est les deux : un cockpit SaaS et une méthode de gouvernance exécutive, conçus ensemble.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>Combien de temps faut-il pour mettre en place un cockpit&nbsp;?</span>
                <div className="faq-toggle">+</div>
              </div>
              <div className="faq-answer">
                <p>Selon votre maturité et vos données, un premier cockpit opérationnel peut être livré en quelques semaines.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>L'IA narrative est-elle personnalisée à notre organisation&nbsp;?</span>
                <div className="faq-toggle">+</div>
              </div>
              <div className="faq-answer">
                <p>Oui. L'IA est calibrée sur votre contexte, vos enjeux, votre langage et vos circuits de décision.</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-question">
                <span>Powalyze remplace-t-il nos outils existants&nbsp;?</span>
                <div className="faq-toggle">+</div>
              </div>
              <div className="faq-answer">
                <p>Powalyze agit comme un cockpit au-dessus de vos outils : il les orchestre, les relie et les rend lisibles.</p>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="final-cta">
            <h2>Votre gouvernance mérite la précision absolue</h2>
            <p>
              Powalyze est le cockpit exécutif de 2026 : vivant, narratif, rigoureux. Prêt à piloter vos décisions les plus importantes.
            </p>
            <div className="final-cta-actions">
              <a href="/cockpit" className="hero-cta-primary">Accéder au cockpit</a>
              <a href="#contact" className="final-cta-secondary">Parler à un expert</a>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer>
          <div className="footer-inner">
            <div>
              <div className="footer-title">Powalyze</div>
              <p>Cockpit exécutif & gouvernance IA, précision et innovation.</p>
              <div className="footer-meta">Powalyze — Innovation & Excellence</div>
            </div>
            <div className="footer-col">
              <div className="footer-title">Produit</div>
              <a href="#cockpit">Cockpit</a>
              <a href="#ia">IA narrative</a>
              <a href="#services">Services</a>
            </div>
            <div className="footer-col">
              <div className="footer-title">Ressources</div>
              <a href="#faq">FAQ</a>
              <a href="#hero">Vitrine</a>
            </div>
            <div className="footer-col" id="contact">
              <div className="footer-title">Contact</div>
              <a href="mailto:contact@powalyze.com">contact@powalyze.com</a>
              <a href="/cockpit">Accéder au cockpit</a>
            </div>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{ __html: `
          // NAVBAR SCROLL + PROGRESS
          const nav = document.querySelector(".nav");
          const progressBar = document.querySelector(".nav-progress");

          window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const width = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = width + "%";

            if (scrollTop > 20) nav.classList.add("scrolled");
            else nav.classList.remove("scrolled");
          });

          // MOBILE NAV
          const burger = document.getElementById("nav-burger");
          const mobileNav = document.getElementById("nav-mobile");

          burger.addEventListener("click", () => {
            mobileNav.classList.toggle("active");
          });

          // REVEAL ON SCROLL
          const revealElements = document.querySelectorAll(".reveal");

          const revealObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("visible");
                  revealObserver.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.15 }
          );

          revealElements.forEach((el) => revealObserver.observe(el));

          // IA TYPING EFFECT - Enhanced Virtual AI
          const iaStreams = document.querySelectorAll(".ia-stream");

          iaStreams.forEach((stream, streamIndex) => {
            const text = stream.getAttribute("data-ia-text") || "";
            const cursor = stream.querySelector(".ia-cursor");
            let index = 0;
            let isPaused = false;

            // Simulate thinking pauses
            const shouldPause = () => Math.random() < 0.15;
            const pauseDuration = () => 200 + Math.random() * 400;

            const type = () => {
              if (index <= text.length) {
                // Add character
                const char = text.charAt(index);
                const contentNode = stream.firstChild;
                if (contentNode && contentNode.nodeType === Node.TEXT_NODE) {
                  contentNode.textContent = text.slice(0, index);
                }
                
                index++;
                
                // Variable speed: faster for spaces, slower for punctuation
                let speed = char === ' ' ? 15 : char.match(/[.,;:!?]/) ? 120 : 35;
                
                // Random thinking pauses
                if (shouldPause() && !isPaused) {
                  isPaused = true;
                  setTimeout(() => {
                    isPaused = false;
                    type();
                  }, pauseDuration());
                } else {
                  setTimeout(type, speed + Math.random() * 20);
                }
              } else {
                // Finished typing
                if (cursor) {
                  cursor.style.display = "inline-block";
                  cursor.style.animation = "blink 1s step-start infinite";
                }
              }
            };

            // Stagger start times for each stream
            setTimeout(type, 600 + streamIndex * 800);
          });

          // FAQ ACCORDION
          const faqItems = document.querySelectorAll(".faq-item");

          faqItems.forEach((item) => {
            const question = item.querySelector(".faq-question");
            question.addEventListener("click", () => {
              const isOpen = item.classList.contains("open");
              faqItems.forEach((i) => i.classList.remove("open"));
              if (!isOpen) item.classList.add("open");
            });
          });
        `}} />
      </body>
    </html>
  );
}

