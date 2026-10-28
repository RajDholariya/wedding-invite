// Gujarati page content. Anything not overridden here comes from data.js (images, map links, countdown, gate art).
import * as en from "./data.js";

export * from "./data.js";

export const couple = {
  groom: { ...en.couple.groom, first: "રાજ", full: "", parents: "શ્રી મિલનભાઈ ઢોલરિયા અને શ્રીમતી રેખાબેન ઢોલરિયાના સુપુત્ર" },
  bride: { ...en.couple.bride, first: "શ્યામા", full: "", parents: "શ્રી નિપુલભાઈ પટાડિયા અને શ્રીમતી રૂપલબેન પટાડિયાની સુપુત્રી" },
};

export const coupleLine = `${couple.groom.first} અને ${couple.bride.first}`;
export const weddingTime = "સાંજે ૭:૦૦ વાગ્યે";
export const shortDate = "૨ ફેબ્રુઆરી ૨૦૨૭";
export const dateLabel = "મંગળવાર, ૨ ફેબ્રુઆરી ૨૦૨૭";
export const placeLabel = "મધુવન ફાર્મ, જૂનાગઢ";
export const revealAlt = "તારાઓ ભરેલા આકાશ નીચે દીવાઓથી ઝગમગતા મહેલના બગીચામાં દંપતી";

// Same order as data.js `events`; colours, art and map links are kept from there.
const guPlace = { venueName: "મધુવન ફાર્મ", address: "હોટેલ દેશી પકવાન પાસે, ખલીલપુર ચોકડી પાસે, જૂનાગઢ - ૩૬૨૦૦૨" };
const eventText = [
  { name: "મંડપ વિધિ", line: "મંડપ મુહૂર્ત — શુભ પ્રસંગોનો મંગલ પ્રારંભ", dateLong: "સોમવાર, ૧ ફેબ્રુઆરી ૨૦૨૭", time: "સવારે ૮:૩૦", ...guPlace },
  { name: "હલ્દી", line: "શુભ હલ્દી — હળદર અને ઉબટનની વિધિ", dateLong: "સોમવાર, ૧ ફેબ્રુઆરી ૨૦૨૭", time: "સાંજે ૫:૦૦", ...guPlace },
  { name: "સંગીત સંધ્યા", line: "સૂરીલી સંગીત સંધ્યા — ગીત, નૃત્ય અને ઉમંગ", dateLong: "સોમવાર, ૧ ફેબ્રુઆરી ૨૦૨૭", time: "રાત્રે ૮:૩૦", ...guPlace },
  { name: "હસ્તમેળાપ", line: "પવિત્ર સપ્તપદી — અગ્નિની સાક્ષીએ સાત ફેરા", dateLong: "મંગળવાર, ૨ ફેબ્રુઆરી ૨૦૨૭", time: "સાંજે ૭:૦૦", ...guPlace },
];
export const events = en.events.map((e, i) => ({ ...e, ...eventText[i] }));

export const venue = {
  ...en.venue,
  name: "મધુવન ફાર્મ (મધુવન પાર્ટી પ્લોટ)",
  address: "હોટેલ દેશી પકવાન પાસે, ખલીલપુર ચોકડી પાસે, જૂનાગઢ - ૩૬૨૦૦૨",
  date: dateLabel,
  time: weddingTime,
};

const captions = ["રાજવી જોડી", "મહેલનું આંગણું", "લગ્ન મંડપ", "પીઠીની સવાર", "સરોવર કિનારે સાંજ", "ઝરૂખો", "મહેલના દરવાજા"];
export const gallery = en.gallery.map((g, i) => ({ ...g, caption: captions[i] ?? g.caption }));
