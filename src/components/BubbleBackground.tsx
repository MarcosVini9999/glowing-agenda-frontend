"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const BubbleBackground = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#f0f4f8", // Fundo claro e clean
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "attract", // Efeito suave de atração
          },
        },
        modes: {
          push: {
            quantity: 3, // Menos partículas por clique para um efeito mais leve
          },
          attract: {
            distance: 150,
            duration: 0.3,
            speed: 1.5,
          },
        },
      },
      particles: {
        color: {
          value: ["#567d99", "#7da0b4", "#a6bbc8"], // Cores mais escuras para maior contraste
        },
        links: {
          color: "#7da0b4", // Cor clara para os links, mas contrastante
          distance: 130,
          enable: true,
          opacity: 0.6, // Aumentar a opacidade dos links para maior visibilidade
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out, // Manter partículas fora da tela
          },
          random: false,
          speed: 2, // Movimento mais suave e lento
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 60, // Menos partículas para um visual mais clean
        },
        opacity: {
          value: { min: 0.4, max: 0.7 }, // Aumentar a opacidade das partículas
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.4,
            sync: false,
          },
        },
        shape: {
          type: "circle", // Manter o círculo para simplicidade
        },
        size: {
          value: { min: 3, max: 5 }, // Aumentar o tamanho das partículas
          animation: {
            enable: true,
            speed: 3,
            minimumValue: 1,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
  }

  return <></>;
};

export default BubbleBackground;
