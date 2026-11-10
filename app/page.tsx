import { CoreCanvas } from '@/components/CoreCanvas';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Darkdome } from '@/components/sections/Darkdome';
import { Automate } from '@/components/sections/Automate';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <CoreCanvas />
      <Nav />
      <main className="wrap">
        <Hero />
        <About />
        <Skills />
        <Darkdome />
        <Automate />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
