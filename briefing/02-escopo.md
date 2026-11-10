# Escopo: decisões

Preenchido conforme as rodadas de perguntas. Status: `aberto` | `decidido` | `revisar`.

## 1. Objetivo e público
| Tema | Decisão | Status |
|---|---|---|
| Objetivo principal | Impressionar à primeira vista quem chega pelo LinkedIn | decidido |
| Público-alvo | Recrutadores técnicos da área | decidido |
| Posicionamento | AI & Software Engineer · CPO @ DarkDome · Scalable SaaS · Cybersecurity · Cloud-Native Architecture & Automation | decidido |
| Ação esperada do visitante | Todas as opções sem hierarquia: LinkedIn (principal na prática), e-mail, formulário de contato, GitHub | decidido |

## Conceito da experiência
| Tema | Decisão | Status |
|---|---|---|
| Navegação | Experiência 100% guiada por scroll | decidido |
| Transições | Zoom in/out entre seções, animadas | decidido |
| Linguagem visual | Efeito de digitação estilo prompt / interação com IA | decidido |

## 2. Identidade
| Tema | Decisão | Status |
|---|---|---|
| Foco do site | Vender VOCÊ como profissional; o próprio site é a amostra do trabalho. DarkDome é só um projeto, não o protagonista | decidido |
| Tom / personalidade | Sombrio e minimalista; poucas palavras, muito visual (texto completo fica no LinkedIn) | decidido |
| Paleta | Fundo escuro + acento laranja bem vivo | decidido |
| Uso do acento | Efeito/luz do hero e destaques pontuais | decidido |
| Tipografia | Grotesk limpa (estilo Geist/Inter) + mono só no prompt | decidido |
| Tema claro/escuro | Só escuro | decidido |
| Saída rápida / TL;DR para recrutadores | Não terá | decidido |

## 3. Hero e primeira impressão
| Tema | Decisão | Status |
|---|---|---|
| Elemento 3D (o quê) | Abstrato, sem referência à DarkDome. Híbrido de metal líquido/vidro premium (B) com campo de partículas (C): proposta "Liquid Core" | decidido |
| Presença do 3D | Atravessa o site inteiro; a câmera faz zoom in/out nele para as transições entre seções | decidido |
| Interação (mouse, scroll, nenhuma) | Mouse + scroll | revisar |
| Hero: prompt | `> who is Pedro Fernandes?` → loading rápido com verbos "pensantes" rotativos → resposta digitada mencionando AI, Software Engineering e UI/UX | decidido |
| Origem do modelo (Blender, Spline, gerado em código) | | aberto |

## 4. Conteúdo
| Tema | Decisão | Status |
|---|---|---|
| Seções | | aberto |
| Projetos | DarkDome (primeiro); outros depois | decidido |
| DarkDome: o que é | SaaS B2B de triagem e resposta a incidentes para MSSPs e SOCs de médio porte. Ingestão de alertas de qualquer fornecedor (e-mail/API), console multi-tenant, correlação, extração de IoCs, enriquecimento com threat intel, análise com IA, ações recomendadas, editor visual de workflows, dashboards (executivo, tático, analítico, SLA) | decidido |
| DarkDome: papel | CPO | decidido |
| DarkDome: vídeos | 5 vídeos curtos verticais, todos visíveis ao mesmo tempo, dispostos como um leque de cartas de baralho; loop infinito, sem controles, sem pausa (autoplay, muted, playsinline) | decidido |
| DarkDome: arquivos | `briefing/refs/videos/`: every-second, incident-report, officially-launching, replace-analysts, still-investigating (15s cada, ~37 MB cada). Remover áudio e comprimir para ~1–3 MB cada (H.264 MP4 + WebM, ~720p) + poster | decidido |
| Experiência | NGXit: Full-stack Software Developer (Feb 2020 – Feb 2022) → AI Engineer & Full-Stack Software Developer (Feb 2022 – Jun 2025) → Tech Lead & Senior AI Engineer (Jun 2025 – Dec 2026) | decidido |
| Links | LinkedIn: https://www.linkedin.com/in/pedropefernandes/ · GitHub: https://github.com/pouzadap · E-mail: pouzadap@gmail.com | decidido |
| Formulário | Envio via Resend para o e-mail acima | decidido |
| Skills (hard) | Software Architecture & System Design · AI Engineering & LLM Integration · Backend Engineering · Cloud-Native Architecture · Distributed Systems & Event-Driven Architecture · AI Agents & Workflow Automation | decidido |
| Skills (soft) | Technical Leadership · Problem Solving · Product Thinking | decidido |
| Seções | Hero → Sobre → Stack/Skills → Experiência → Projetos (DarkDome) → Contato · sem foto (assumido; confirmar) | revisar |
| Contato | Links de LinkedIn, e-mail, GitHub + formulário de e-mail | decidido |
| Formato do case DarkDome | Seção de showcase própria, com estética de terminal/CLI (a única parte do site com essa linguagem) | decidido |

## 5. Técnico
| Tema | Decisão | Status |
|---|---|---|
| Hospedagem | Vercel, domínio `.vercel.app` por enquanto | decidido |
| Repositório | Público no GitHub (pouzadap); vídeos brutos fora do git | decidido |
| Idiomas | Inglês padrão, com opção de português | decidido |
| Conteúdo (MDX, CMS, hardcoded) | | aberto |

## Stack proposta (a confirmar)
- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- React Three Fiber + drei (3D), modelos glTF comprimidos (Draco/Meshopt)
- GSAP + ScrollTrigger (scroll) e Motion (transições de UI)
- Lenis (smooth scroll)
- Deploy na Vercel
