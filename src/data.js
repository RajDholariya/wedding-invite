// Sample content shown on the reference preview (invitima.com/template-frame/blush-romance).
export const asset = (p) => `/templates/blush-romance/${p}`;

export const couple = {
  groom: {
    first: "Raj",
    full: "Raj Dholariya",
    parents: "Son of Milanbhai Dholariya & Rekhaben Dholariya",
    portrait: { src: asset("couple/groom.webp"), focus: "50% 25%" },
  },
  bride: {
    first: "Shyama",
    full: "Shyama Patadiya",
    parents: "Daughter of Nipulbhai Patadiya & Rupalben Patadiya",
    portrait: { src: asset("couple/bride.webp"), focus: "50% 25%" },
  },
};

export const coupleLine = `${couple.groom.first} & ${couple.bride.first}`;
export const weddingDate = "2027-02-02";
export const weddingTime = "7:00 PM";
export const shortDate = "2 February 2027";
export const dateLabel = "Tuesday, 2 February 2027";
export const placeLabel = "Shubh Vivah Banquet Hall";
export const hashtag = "#RajWedsShyama";
// Local wall-clock target, as the reference builds it from date + time.
export const countdownTo = new Date(2027, 1, 2, 19, 0).getTime();

export const gate = {
  portrait: {
    layout: "portrait",
    image: asset("gate/portrait.webp"),
    aspect: 941 / 1671,
    centre: "50.16% 67.53%",
    opening: asset("gate/portrait-opening.png"),
    reveal: { image: asset("gate/portrait-reveal.webp"), aspect: 941 / 1672 },
    left: { image: asset("gate/portrait-left.webp"), box: { left: "23.592%", width: "26.886%", top: "50.928%", height: "32.316%" } },
    right: { image: asset("gate/portrait-right.webp"), box: { left: "49.841%", width: "26.78%", top: "50.928%", height: "32.316%" } },
    lock: { image: asset("gate/portrait-lock.webp"), box: { left: "46.546%", width: "7.651%", top: "64.034%", height: "7.002%" } },
  },
  landscape: {
    layout: "landscape",
    image: asset("gate/landscape.webp"),
    aspect: 1672 / 941,
    centre: "49.94% 75.72%",
    opening: asset("gate/landscape-opening.png"),
    reveal: { image: asset("gate/landscape-reveal.webp"), aspect: 1672 / 941 },
    left: { image: asset("gate/landscape-left.webp"), box: { left: "39.175%", width: "10.945%", top: "57.173%", height: "32.944%" } },
    right: { image: asset("gate/landscape-right.webp"), box: { left: "49.761%", width: "11.244%", top: "57.173%", height: "32.944%" } },
    lock: { image: asset("gate/landscape-lock.webp"), box: { left: "48.026%", width: "3.828%", top: "70.988%", height: "9.458%" } },
  },
};
export const revealAlt = "The couple in a candlelit palace garden under the starlit sky";

export const story = [
  { year: "2019", when: "March 2019", title: "We First Met", description: "A mutual friend's birthday party in Delhi — Raj spilled chai on Shyama's dupatta." },
  { year: "2021", when: "June 2021", title: "First Trip Together", description: "A weekend in Manali that turned into a week — neither of us wanted to come back." },
  { year: "2025", when: "December 2025", title: "The Proposal", description: "On a rooftop in Udaipur, under fairy lights, with both families secretly watching." },
];

export const family = [
  {
    side: "groom",
    title: "The Groom's Family",
    members: [
      { relation: "Father of the Groom", name: "Suresh Verma", art: "man" },
      { relation: "Mother of the Groom", name: "Anita Verma", art: "woman" },
      { relation: "Brother of the Groom", name: "Rohan Verma", art: "man" },
    ],
  },
  {
    side: "bride",
    title: "The Bride's Family",
    members: [
      { relation: "Father of the Bride", name: "Rakesh Sharma", art: "man" },
      { relation: "Mother of the Bride", name: "Sunita Sharma", art: "woman" },
      { relation: "Sister of the Bride", name: "Nisha Sharma", art: "woman" },
    ],
  },
];

const mapsSearch = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const eventStyle = {
  haldi: { art: "events/haldi.webp", line: "शुभ हल्दी — Pithi & Ubtan Ceremony", color: "oklch(0.78 0.18 85)", cardBg: "#fef9e8", cardBorder: "#f0d986", cardText: "#614908" },
  mehendi: { art: "events/mehendi.webp", line: "मेहंदी की शाम — Henna, Music & Melodies", color: "oklch(0.58 0.16 142)", cardBg: "#edf7f0", cardBorder: "#bde3c6", cardText: "#174e28" },
  sangeet: { art: "events/sangeet.webp", line: "सुरमई संगीत — A Musical Gala Night", color: "oklch(0.55 0.22 330)", cardBg: "#fdf0f7", cardBorder: "#f5c3e4", cardText: "#731656" },
  pheras: { art: "events/pheras.webp", line: "पवित्र सात फेरे — Sacred Vows Around Holy Agni", color: "oklch(0.52 0.22 25)", cardBg: "#fdf1f2", cardBorder: "#f4c4c9", cardText: "#7f141a" },
  reception: { art: "events/reception.webp", line: "भव्य आशीर्वाद समारोह — Grand Gala Feast", color: "oklch(0.52 0.16 240)", cardBg: "#edf4fa", cardBorder: "#c3daf1", cardText: "#163a73" },
};

const ev = (id, kind, name, dateLong, time, venueName, address, dressCode, note = "") => ({
  id,
  name,
  dateLong,
  time,
  venueName,
  address,
  dressCode,
  note,
  mapUrl: mapsSearch(`${venueName}, ${address}`),
  ...eventStyle[kind],
  art: asset(eventStyle[kind].art),
});

export const venue = {
  name: "Madhuvan Farm",
  address: "Near Hotel Deshi Pakwan, near Khalilpur Chowkdi, Junagadh - 362002",
  date: dateLabel,
  time: "7:00 PM",
  mapUrl: "https://maps.app.goo.gl/MLd81BytVMwmx7gg8",
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.2410257302076!2d70.43669937476766!3d21.537428880242278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39580205964c557f%3A0x90af55f4e0b774ba!2sMadhuvan%20Farm(Madhuvan%20Party%20Plot)!5e0!3m2!1sen!2sin!4v1793094615815!5m2!1sen!2sin",
};

const madhuvan = ["Madhuvan Farm", "Near Hotel Deshi Pakwan, near Khalilpur Chowkdi, Junagadh - 362002"];

export const events = [
  { ...ev("mandap", "mehendi", "Mandap Vidhi", "Monday, 1 February 2027", "8:30 AM", ...madhuvan, ""), line: "मंडप विधि — Sacred Rituals to Begin the Celebrations", art: asset("events/mandap.webp") },
  { ...ev("haldi", "haldi", "Haldi", "Monday, 1 February 2027", "5:00 PM", ...madhuvan, ""), art: asset("events/mehendi.webp") },
  ev("sangeet", "sangeet", "Sangeet", "Monday, 1 February 2027", "8:30 PM", ...madhuvan, ""),
  ev("wedding", "pheras", "Wedding", "Tuesday, 2 February 2027", "7:00 PM", ...madhuvan, ""),
].map((e) => ({ ...e, mapUrl: venue.mapUrl }));


export const gallery = [
  { src: asset("gallery/couple.jpg"), caption: "The Royal Couple" },
  { src: asset("gallery/courtyard.jpg"), caption: "The Palace Courtyard" },
  { src: asset("gallery/mandap.jpg"), caption: "The Wedding Mandap" },
  { src: asset("gallery/haldi.jpg"), caption: "Haldi Morning" },
  { src: asset("gallery/lake.jpg"), caption: "Lakeside Evening" },
  { src: asset("gallery/jharokha.jpg"), caption: "The Jharokha" },
  { src: asset("gallery/gate.jpg"), caption: "The Palace Gates" },
];

export const wishes = [
  { name: "Anjali Mehta", relation: "Shyama's college friend", message: "So happy for you both! Wishing you a lifetime of love and laughter." },
  { name: "Vikram Singh", relation: "Raj's cousin", message: "Finally! Can't wait to dance at your sangeet, bhai." },
  { name: "The Kapoor Family", relation: "Family friends", message: "May your journey together be as beautiful as your love story." },
];

export const contacts = [
  { relation: "Groom's Brother", name: "Rohan Verma", phone: "+91 98765 43210" },
  { relation: "Bride's Sister", name: "Nisha Sharma", phone: "+91 91234 56789" },
];

// Theme colours the shared scratch-card / wishes widgets read from the template config.
export const theme = { primaryColor: "#2A2D5C", secondaryColor: "#E8A98F" };
