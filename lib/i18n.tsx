'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'pt';

const en = {
  langLabel: 'Language',
  hero: {
    q: 'who is Pedro Fernandes?',
    a1: 'AI & Software Engineer.',
    a2: 'UI/UX-minded. Building scalable, secure, intelligent systems.',
    tagline: 'AI · Software · UI/UX',
    scroll: 'Scroll',
  },
  about: {
    eyebrow: 'About',
    lead: 'I design and build AI systems end to end,',
    rest: 'from architecture to the interface people touch.',
  },
  skills: {
    eyebrow: 'Focus',
    core: 'Core',
    build: 'Build',
    soft: ['Technical Leadership', 'Problem Solving', 'Product Thinking'],
  },
  darkdome: {
    eyebrow: 'Selected work · CPO',
    desc: 'B2B SaaS that triages and responds to security alerts for MSSPs and mid-size SOCs.',
    deckLabel: 'Darkdome product demos',
  },
  automate: {
    sub: 'Visual workflows. Triggers, conditions, actions, reusable groups.',
    label: 'Darkdome workflow automation',
  },
  experience: {
    eyebrow: 'Experience',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  contact: {
    title: "Let's talk.",
    email: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    fName: 'Name',
    fEmail: 'Email',
    fMessage: 'Message',
    phName: 'Ada Lovelace',
    phEmail: 'ada@company.com',
    phMessage: "We're hiring an AI engineer for…",
    send: 'Send message',
    sending: 'Sending…',
    sent: "Message sent. I'll get back to you soon.",
    invalid: 'Fill in every field with a valid email.',
    failed: "Couldn't send right now. Reach me on LinkedIn or by email instead.",
  },
};

export type Dict = typeof en;

const pt: Dict = {
  langLabel: 'Idioma',
  hero: {
    q: 'quem é Pedro Fernandes?',
    a1: 'AI & Software Engineer.',
    a2: 'Com olhar de UI/UX. Construindo sistemas escaláveis, seguros e inteligentes.',
    tagline: 'AI · Software · UI/UX',
    scroll: 'Role',
  },
  about: {
    eyebrow: 'Sobre',
    lead: 'Projeto e construo sistemas de IA de ponta a ponta,',
    rest: 'da arquitetura à interface que as pessoas usam.',
  },
  skills: {
    eyebrow: 'Foco',
    core: 'Núcleo',
    build: 'Base',
    soft: ['Liderança Técnica', 'Resolução de Problemas', 'Visão de Produto'],
  },
  darkdome: {
    eyebrow: 'Projeto em destaque · CPO',
    desc: 'SaaS B2B que faz a triagem e a resposta a alertas de segurança para MSSPs e SOCs de médio porte.',
    deckLabel: 'Demonstrações do produto Darkdome',
  },
  automate: {
    sub: 'Workflows visuais. Gatilhos, condições, ações, grupos reutilizáveis.',
    label: 'Automação de workflows da Darkdome',
  },
  experience: {
    eyebrow: 'Experiência',
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  },
  contact: {
    title: 'Vamos conversar.',
    email: 'E-mail',
    copy: 'Copiar',
    copied: 'Copiado',
    fName: 'Nome',
    fEmail: 'E-mail',
    fMessage: 'Mensagem',
    phName: 'Ada Lovelace',
    phEmail: 'ada@empresa.com',
    phMessage: 'Estamos contratando um AI engineer para…',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    sent: 'Mensagem enviada. Respondo em breve.',
    invalid: 'Preencha todos os campos com um e-mail válido.',
    failed: 'Não foi possível enviar agora. Fale comigo pelo LinkedIn ou por e-mail.',
  },
};

const dicts: Record<Lang, Dict> = { en, pt };
const STORAGE_KEY = 'pf-lang';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const I18nContext = createContext<Ctx>({ lang: 'en', setLang: () => {}, t: en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'pt') setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return <I18nContext.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
