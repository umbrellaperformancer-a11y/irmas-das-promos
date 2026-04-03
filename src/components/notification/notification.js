// VipJoinNotifier.js
import React from "react";
import { notification } from "antd";

// 👩‍🦰 Lista SOMENTE feminina
const MALE_NAMES = [
  "Mariana Almeida",
  "Joana Vitória",
  "Luísa Ferreira",
  "Paula Henriques",
  "Rafaela Costa",
  "Bruna Lima",
  "Matheusa Rocha",
  "Felipa Santos",
  "Gustava Nogueira",
  "Andrea Ribeiro",
  "Thiara Martins",
  "Daniela Oliveira",
  "Carla Eduarda",
  "Renata Azevedo",
  "Vitória Moreira",
];

const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = (arr) => arr[randInt(0, arr.length - 1)];
const randomDelay = () => randInt(5000, 9000); // ⏱ 2 a 4 segundos

export default function VipJoinNotifier({
  enabled = true,
  placement = "top",
  title = "🔥 Aproveite os melhores ACHADOS de 2025 🔥",
}) {
  const timerRef = React.useRef(null);
  const runningRef = React.useRef(false);
  const lastNameRef = React.useRef(null);

  React.useEffect(() => {
    if (!enabled) return;

    runningRef.current = true;

    const loop = () => {
      if (!runningRef.current) return;

      // evita repetir o mesmo nome em sequência
      let name;
      do {
        name = pickOne(MALE_NAMES);
      } while (name === lastNameRef.current);

      lastNameRef.current = name;

      notification.open({
        message: title,
        description: (
          <span>
            <strong>{name}</strong> acabou de entrar no Grupo VIP
          </span>
        ),
        placement,
        duration: 2.2,
      });

      timerRef.current = setTimeout(loop, randomDelay());
    };

    timerRef.current = setTimeout(loop, randomDelay());

    return () => {
      runningRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      notification.destroy();
    };
  }, [enabled, placement, title]);

  return null;
}
