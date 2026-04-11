export const CHARACTER_AVATARS = [
  { id: "2bobo", name: "2Bobo", src: "/loader/2bobo.png" },
  { id: "chief", name: "Chief", src: "/loader/chief.png" },
  { id: "chioma", name: "Chioma", src: "/loader/chioma.png" },
  { id: "femi", name: "Femi", src: "/loader/femi.png" },
  { id: "iya-bose", name: "Iya Bose", src: "/loader/iya bose.png" },
  { id: "madam", name: "Madam", src: "/loader/madam.png" },
  { id: "obi", name: "Obi", src: "/loader/obi.png" },
  { id: "precious", name: "Precious", src: "/loader/precious.png" },
] as const;

export type AvatarId = (typeof CHARACTER_AVATARS)[number]["id"];

export function getAvatarById(id: string) {
  return CHARACTER_AVATARS.find((a) => a.id === id) ?? CHARACTER_AVATARS[0];
}
