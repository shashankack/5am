export type ClientLogo = {
  src: string;
  alt: string;
};

const FILES: { file: string; alt: string }[] = [
  { file: "adidas-black-vector-logo 2.png", alt: "Adidas" },
  { file: "Audi-BW 2.png", alt: "Audi" },
  { file: "crocs-BW 2.png", alt: "Crocs" },
  { file: "DIOR-BW 2.png", alt: "Dior" },
  { file: "GUCCI-BW 2.png", alt: "Gucci" },
  { file: "PUMA-BW 2.png", alt: "Puma" },
  { file: "Rolling-Stone-India-BW 2.png", alt: "Rolling Stone India" },
  { file: "SHEIN-BW 2.png", alt: "Shein" },
  { file: "ZARA-BW 2.png", alt: "Zara" },
  { file: "08-image 1.png", alt: "Client" },
  { file: "path2.png", alt: "Client" },
  { file: "images (1) 2.png", alt: "Client" },
  { file: "images (2) 2.png", alt: "Client" },
  { file: "exec-1fcda94a-c53f-4164-a680-c74909de02c1 1.png", alt: "Client" },
  { file: "exec-20a075aa-6a3b-4574-a8bf-b2905f2e837d 1.png", alt: "Client" },
  { file: "exec-28f6d1ca-6bbc-45d1-90e0-46a0b347b76b 1.png", alt: "Client" },
  { file: "exec-2b560a05-7e37-4eca-9021-4f2ecfc90780 1.png", alt: "Client" },
  { file: "exec-39e872f7-e448-44af-b148-9fc457586b6c 2.png", alt: "Client" },
  { file: "exec-4a688829-6990-4913-97d4-8a52bf386417 2.png", alt: "Client" },
  { file: "exec-5acd8a20-1f16-4b15-ac3d-61e64346247d 1.png", alt: "Client" },
  { file: "exec-79d81aa8-41fe-4a3e-9c67-f26d918324fb 1.png", alt: "Client" },
  { file: "exec-8bd0faae-352d-494e-b8a8-3a7cfe05c918 1.png", alt: "Client" },
  { file: "exec-bd184bc3-9c24-4990-a712-0932347ebfa6 2.png", alt: "Client" },
  { file: "exec-d349a8de-0c15-456f-990c-3cc1b90ee3ef 2.png", alt: "Client" },
  { file: "exec-db568370-fca4-4b5f-aeee-df25466c1381 1.png", alt: "Client" },
  { file: "exec-f906ae1c-662a-478c-8c96-8a4c6cb8b315 2.png", alt: "Client" },
];

export const CLIENT_LOGOS: ClientLogo[] = FILES.map(({ file, alt }) => ({
  src: `/assets/logos/${encodeURI(file)}`,
  alt,
}));
