// Synthetic data for demo mode (/?demo=true).
// Nothing here comes from real messages - it's all generated from a fixed seed
// so the demo looks the same on the server and the client (no hydration flicker)
// and stays the same between refreshes.

import type { DayData } from "@/components/MessageCalendar";

// deterministic PRNG so the "random" data is stable
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// a neutral three year window, unrelated to any real dates
const START_DATE = '2020-01-01';
const TOTAL_DAYS = 1096;

export const DEMO_NAMES = { you: 'Me', him: 'You' };

const ERAS = [
    { label: 'The First Winter', end: '2020-06-30' },
    { label: 'Different Cities', end: '2021-05-31' },
    { label: 'Same Postcode', end: '2022-04-30' },
    { label: 'Year Three', end: '2022-12-31' },
];

const MILESTONES: Record<string, string> = {
    '2020-01-01': 'day one',
    '2020-02-29': 'first road trip',
    '2020-05-16': 'met the dog',
    '2020-08-08': 'the bad haircut summer',
    '2021-01-01': 'one year',
    '2021-03-14': 'first flat viewing',
    '2021-07-04': 'holiday by the sea',
    '2021-10-31': 'matching costumes',
    '2022-01-01': 'two years',
    '2022-04-02': 'moving day',
    '2022-09-18': 'birthday picnic',
    '2022-12-31': 'three years',
};

const APART_PERIODS = [
    { start: '2020-07-05', end: '2020-09-12' },
    { start: '2020-11-20', end: '2021-01-18' },
    { start: '2021-06-01', end: '2021-07-20' },
    { start: '2022-02-10', end: '2022-03-05' },
];

// generic filler lines - the point is to show the layout, not to say anything
const QUOTES = [
    'we should get noodles',
    'landed, will text when i find the bus',
    'the cat sat on my keyboard again',
    'i cannot believe you said that out loud',
    'ok but hear me out: second breakfast',
    'call me when you are free, no rush',
    'it is raining sideways here',
    'i finished the show without you, sorry',
    'do we still have milk',
    'made it to the top, the view is worth it',
    'my train is delayed forty minutes',
    'this playlist is objectively perfect',
    'goodnight, see you tomorrow',
    'i am bringing snacks, do not argue',
    'the plant is somehow still alive',
    'four more days',
    'guess who got the last pastry',
    'that meeting could have been an email',
    'i miss the good kettle',
    'wear a jacket, it is colder than it looks',
    'we are officially out of biscuits',
    'i took a photo of a very round bird',
    'remind me to book the tickets',
    'left my keys at yours again',
    'home in twenty',
];

const EMOJIS = ['😊', '🥲', '😂', '🌸', '☕️', '🐈', '🌧️', '✨', '🍜', '🫶', '🎧', '🌙'];

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);

const getEra = (iso: string) => {
    for (const era of ERAS) {
        if (iso <= era.end) return era.label;
    }
    return ERAS[ERAS.length - 1].label;
};

const isApart = (iso: string) =>
    APART_PERIODS.some(period => iso >= period.start && iso <= period.end);

const labelFor = (compound: number) => {
    if (compound < -0.3) return 'very_negative';
    if (compound < -0.05) return 'negative';
    if (compound <= 0.05) return 'neutral';
    if (compound <= 0.3) return 'positive';
    return 'very_positive';
};

function generateDemoDays(): DayData[] {
    const random = mulberry32(1096);
    const days: DayData[] = [];
    const start = toDate(START_DATE);

    for (let i = 0; i < TOTAL_DAYS; i++) {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i);
        const iso = toIso(date);
        const apart = isApart(iso);
        const milestone = MILESTONES[iso] ?? null;

        // a slow seasonal wave plus noise, so the grid has visible texture
        const wave = Math.sin(i / 47) * 0.5 + 0.5;
        const silent = random() < 0.02 && !milestone;
        const base = apart ? 150 : 70;
        const messageCount = silent
            ? 0
            : Math.round(base + wave * 90 + random() * 110 + (milestone ? 80 : 0));

        // mostly warm, with enough range to show every colour in the legend
        const roll = random();
        let compound: number;
        if (milestone) compound = 0.55 + random() * 0.4;
        else if (roll < 0.05) compound = -0.75 + random() * 0.4;
        else if (roll < 0.13) compound = -0.28 + random() * 0.2;
        else if (roll < 0.17) compound = -0.04 + random() * 0.09;
        else if (roll < 0.42) compound = 0.06 + random() * 0.23;
        else compound = 0.32 + random() * 0.6;

        const share = 0.42 + random() * 0.16;

        days.push({
            date: iso,
            messageCount,
            fromYou: Math.round(messageCount * share),
            fromHim: messageCount - Math.round(messageCount * share),
            sentiment: {
                compound: Number(compound.toFixed(3)),
                label: labelFor(compound),
            },
            quote: messageCount === 0 ? '' : QUOTES[Math.floor(random() * QUOTES.length)],
            topEmoji: messageCount === 0 ? '' : EMOJIS[Math.floor(random() * EMOJIS.length)],
            era: getEra(iso),
            milestone,
            isApart: apart,
        });
    }

    return days;
}

export const demoDays = generateDemoDays();

const round = (n: number) => Number(n.toFixed(2));
const mean = (values: number[]) =>
    values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : 0;

const apartDays = demoDays.filter(day => day.isApart);
const togetherDays = demoDays.filter(day => !day.isApart);
const counts = demoDays.map(day => day.messageCount);

export const demoStats = {
    totalDays: demoDays.length,
    daysTogether: togetherDays.length,
    daysApart: apartDays.length,
    totalMessages: counts.reduce((sum, n) => sum + n, 0),
    avgMessagesPerDay: round(mean(counts)),
    apartAvg: round(mean(apartDays.map(day => day.messageCount))),
    togetherAvg: round(mean(togetherDays.map(day => day.messageCount))),
    sentimentBreakdown: {
        very_positive: demoDays.filter(day => day.sentiment.label === 'very_positive').length,
        very_negative: demoDays.filter(day => day.sentiment.label === 'very_negative').length,
    },
};
