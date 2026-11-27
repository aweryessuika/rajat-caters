export const BRAND = {
  name: "Rajat Caterers",
  founded: 1986,
  phones: [
    { display: "+91 98113 75848", tel: "+919811375848" },
    { display: "+91 99712 32315", tel: "+919971232315" },
  ],
  /** WhatsApp Business line (different from the call numbers). */
  whatsapp: "919811375242",
  whatsappDisplay: "+91 98113 75242",
  email: "caterersrajat@gmail.com",
  address: ["F-302, Ibiza Town, Surajkund", "Faridabad, 121010"],
  website: "www.rajatcaterers.com",
  websiteUrl: "https://www.rajatcaterers.com",
} as const;

export const SERVICE_REGIONS = [
  { label: "Delhi NCR", note: "Home ground" },
  { label: "Worldwide", note: "Destination weddings & conferences" },
] as const;

export const CUISINES = ["North Indian", "Continental", "Mughlai", "Live Stations"] as const;

export const NAV_LINKS = [
  { id: "story", label: "Story" },
  { id: "signatures", label: "Signatures" },
  { id: "services", label: "Services" },
  { id: "menu", label: "Menu" },
  { id: "weekly", label: "Weekly Menu" },
  { id: "gallery", label: "Gallery" },
] as const;

export const MARQUEE_ITEMS = [
  "Royal Buffets",
  "Live Food Stations",
  "Plated Fine Dining",
  "Weddings",
  "Corporate Galas",
  "Destination Weddings",
  "Conferences Worldwide",
  "Since 1986",
] as const;

export type Signature = {
  id: string;
  name: string;
  cuisine: string;
  veg: boolean;
  desc: string;
};

/** The house signatures, supplied by the owner. Descriptions describe the dish, not invented history. */
export const SIGNATURES: readonly Signature[] = [
  {
    id: "signature-smoked-butter-chicken",
    name: "Smoked Butter Chicken",
    cuisine: "North Indian",
    veg: false,
    desc: "Tandoor-charred chicken in a silken tomato and butter gravy, finished with a breath of charcoal smoke.",
  },
  {
    id: "signature-dal-makhani",
    name: "Dal Makhani",
    cuisine: "North Indian",
    veg: true,
    desc: "Whole black lentils simmered low and slow for hours, then enriched with butter and cream.",
  },
  {
    id: "signature-paneer-lababdar",
    name: "Paneer Lababdar",
    cuisine: "Mughlai",
    veg: true,
    desc: "Soft paneer in a rich, gently spiced onion and tomato gravy with cashew and cream.",
  },
  {
    id: "signature-sarson-ka-saag",
    name: "Sarson ka Saag & Makki ki Roti",
    cuisine: "Punjabi",
    veg: true,
    desc: "The Punjabi winter classic: slow-cooked mustard greens with white butter and maize-flour roti.",
  },
  {
    id: "signature-chicken-alfredo-pasta",
    name: "Chicken Alfredo Pasta",
    cuisine: "Continental",
    veg: false,
    desc: "Tender chicken tossed through a creamy parmesan Alfredo, for the guests who want a taste of the continent.",
  },
];

export type ServiceStyle = {
  id: string;
  title: string;
  desc: string;
  frame: number;
  position: string;
};

export const SERVICE_STYLES: readonly ServiceStyle[] = [
  {
    id: "royal-buffet",
    title: "Royal Buffets",
    desc: "Brass, gold and a long, generous spread, set and labelled before the first guest arrives.",
    frame: 0,
    position: "60% 50%",
  },
  {
    id: "live-stations",
    title: "Live Food Stations",
    desc: "Tandoor, grill and tawa cooked in front of your guests, hot off the flame.",
    frame: 60,
    position: "55% 50%",
  },
  {
    id: "plated",
    title: "Plated Fine Dining",
    desc: "Composed plates served course by course, for galas, conferences and intimate dinners.",
    frame: 100,
    position: "42% 50%",
  },
];

export const STORY = {
  eyebrow: "Our Story",
  title: "40 Years of Family, Flavors & Festivities",
  kicker: "A Legacy Born in Delhi’s Heart",
  paragraphs: [
    "In 1986, my father Mr Ashok Sarin, a self-taught chef from Punjab, launched Rajat Caterers from our modest south Delhi kitchen. He was fresh out of school when he was asked to join our family’s new restaurant by his father and his brothers. That is where his journey and passion for food began.",
    "Rooted in family recipes from this heritage, he mastered North Indian delights like Butter Chicken, Dal Makhani, Kadhai Paneer and numerous others. His first 200-guest wedding set the stage for a journey that has fed Delhi’s celebrations for four decades.",
  ],
  signatureDishes: ["Butter Chicken", "Dal Makhani", "Kadhai Paneer"],
  today:
    "Today, our strong team delivers seamless Delhi catering services across weddings, corporates, and more.",
  quote: "Every plate carries my father’s wisdom:",
  quoteEmphasis: "Create memories that last.",
} as const;

export const STATS = [
  { value: 40, suffix: "", label: "Years feeding Delhi’s celebrations", note: "Since 1986" },
  { value: 10000, suffix: "+", label: "Events served", note: "Weddings to galas" },
  { value: 5, suffix: "", label: "Consecutive years with Ircon International", note: "Repeat client" },
  { value: 4, suffix: "", label: "Countries catered abroad", note: "Singapore · Malaysia · Egypt · Thailand" },
] as const;

export const MILESTONES = [
  "Served 10,000+ events, from Big Fat Indian weddings to Fortune 500 galas and various government functions.",
  "Served meals to Ircon International for 5 consecutive years.",
  "Worked internationally with the Airtel and Hitachi groups in Singapore, Malaysia, Egypt and Thailand.",
  "Practised and promoted sustainability by reducing food wastage and donating leftovers, if any.",
  "Eco-friendly packaging and customised menus as per the client’s requirement.",
] as const;

export const FOOTPRINT = [
  { label: "New Delhi", note: "Home kitchen" },
  { label: "Singapore", note: "Overseas" },
  { label: "Malaysia", note: "Overseas" },
  { label: "Thailand", note: "Overseas" },
  { label: "Egypt", note: "Overseas" },
] as const;

export const TRUSTED_BY = [
  "Ircon International",
  "Airtel",
  "Hitachi Group",
  "Government functions",
  "Fortune 500 galas",
] as const;

export type Service = {
  id: string;
  title: string;
  desc: string;
  tags: readonly string[];
  frame: number;
  position: string;
};

export const SERVICES: readonly Service[] = [
  {
    id: "weddings",
    title: "Weddings & Celebrations",
    desc: "From the 200-guest wedding that started it all in 1986 to today’s Big Fat Indian weddings, we cook the dishes your families grew up on and build the menu around your guests.",
    tags: ["Big Fat Indian weddings", "Live counters", "Customised menus"],
    frame: 0,
    position: "50% 50%",
  },
  {
    id: "corporate",
    title: "Corporate & Institutional",
    desc: "Fortune 500 galas, company events and daily meal service for teams. Ircon International has trusted us for five years running.",
    tags: ["Fortune 500 galas", "Daily meal plans", "Repeat clients"],
    frame: 100,
    position: "35% 50%",
  },
  {
    id: "government",
    title: "Government Functions",
    desc: "Large-format service for various government functions, run on time and to the head-count, with the same kitchen discipline as a family wedding.",
    tags: ["Large-format service", "On-time delivery"],
    frame: 52,
    position: "55% 50%",
  },
  {
    id: "destination",
    title: "Destination Weddings & Conferences",
    desc: "Delhi NCR is home, but the kitchen travels. We cater destination weddings and conferences around the world, and have already served the Airtel and Hitachi groups in Singapore, Malaysia, Egypt and Thailand.",
    tags: ["Worldwide", "Destination weddings", "Conferences"],
    frame: 12,
    position: "50% 50%",
  },
];

export type Dish = { id: string; name: string; note?: string; veg?: boolean };
export type MenuGroup = { title: string; dishes: readonly Dish[] };
export type MenuCategory = {
  id: string;
  label: string;
  blurb: string;
  groups: readonly MenuGroup[];
};

const d = (group: string, name: string, note?: string): Dish => ({
  id: `${group}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  note,
});

export const MENU: readonly MenuCategory[] = [
  {
    id: "starters",
    label: "Starters",
    blurb: "Non-vegetarian starters, from the tandoor, the grill and the fryer.",
    groups: [
      {
        title: "Chicken",
        dishes: [
          d("starter-chicken", "Chicken Tikka", "Classic Tandoori, creamy Malai Tikka, or tangy Achari Tikka."),
          d("starter-chicken", "Chicken Lollipop", "A staple Indo-Chinese starter, often served fried."),
          d("starter-chicken", "Chicken Seekh Kebab", "Minced chicken skewers."),
          d("starter-chicken", "Chicken 65", "Spicy, deep-fried chicken, popular in South India."),
          d("starter-chicken", "Tangdi Kebab / Drums of Heaven", "Chicken drumsticks marinated and grilled."),
          d("starter-chicken", "Lemon Chicken", "A tangy, dry preparation made by drizzling lemon, coriander and butter onto fried chicken pieces."),
          d("starter-chicken", "Chicken Manchurian"),
        ],
      },
      {
        title: "Mutton & Lamb",
        dishes: [
          d("starter-mutton", "Mutton Seekh Kebab", "Juicy, spiced minced meat skewers."),
          d("starter-mutton", "Galouti Kebab", "Melt-in-the-mouth, finely minced patty."),
          d("starter-mutton", "Shami Kebab", "Spiced, shallow-fried patties."),
          d("starter-mutton", "Mutton Burra", "Smoky grilled mutton chops."),
        ],
      },
      {
        title: "Fish & Seafood",
        dishes: [
          d("starter-fish", "Fish Amritsari", "Battered and fried fish, a popular North Indian choice."),
          d("starter-fish", "Fish Fingers / Orly", "Breaded or battered fish strips served with orly sauce."),
          d("starter-fish", "Tandoori Prawns", "Skewered, marinated prawns."),
          d("starter-fish", "Fish Tikka", "Smoky, marinated fish cubes."),
          d("starter-fish", "Grilled Fish in Lemon Butter Sauce"),
        ],
      },
    ],
  },
  {
    id: "mains",
    label: "Main Course",
    blurb: "Slow-cooked gravies, from the Punjabi classics to the coast.",
    groups: [
      {
        title: "Chicken",
        dishes: [
          d("main-chicken", "Butter Chicken"),
          d("main-chicken", "Kadhai Chicken"),
          d("main-chicken", "Chicken Curry"),
          d("main-chicken", "Chicken Korma"),
          d("main-chicken", "Chicken Do Pyaza"),
          d("main-chicken", "Chicken Chettinad"),
          d("main-chicken", "Chilli Chicken Gravy"),
        ],
      },
      {
        title: "Mutton & Lamb",
        dishes: [
          d("main-mutton", "Mutton Rogan Josh"),
          d("main-mutton", "Mutton Curry"),
          d("main-mutton", "Mutton Korma"),
          d("main-mutton", "Mutton Rara"),
          d("main-mutton", "Laal Maas"),
          d("main-mutton", "Mutton Nihari"),
        ],
      },
      {
        title: "Seafood",
        dishes: [
          d("main-seafood", "Fish Curry"),
          d("main-seafood", "Fish Fry"),
          d("main-seafood", "Fish Moilee"),
          d("main-seafood", "Prawn Masala"),
          d("main-seafood", "Prawn Malai Curry"),
        ],
      },
    ],
  },
  {
    id: "rice",
    label: "Rice & Biryani",
    blurb: "Dum-cooked biryanis and pulao.",
    groups: [
      {
        title: "Non-Veg Rice & Biryani",
        dishes: [
          d("rice", "Chicken Biryani"),
          d("rice", "Mutton Biryani"),
          d("rice", "Hyderabadi Dum Biryani"),
          d("rice", "Chicken Pulao"),
        ],
      },
    ],
  },
  {
    id: "live",
    label: "Live Counters",
    blurb: "Cooked in front of your guests.",
    groups: [
      {
        title: "Live Counters",
        dishes: [
          d("live", "Tandoori Chicken Live Counter"),
          d("live", "Kebab Live Grill"),
          d("live", "Fish Fry Live Station"),
          d("live", "Teppanyaki Counter"),
          d("live", "Shawarma Counter"),
        ],
      },
    ],
  },
];

export const MEALS = ["Breakfast", "Lunch", "Dinner"] as const;
export type Meal = (typeof MEALS)[number];

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export type WeeklyItem = { name: string; nonVeg?: boolean };
const v = (name: string): WeeklyItem => ({ name });
const nv = (name: string): WeeklyItem => ({ name, nonVeg: true });

export const WEEKLY_MENU: Record<Meal, Record<WeekDay, readonly WeeklyItem[]>> = {
  Breakfast: {
    Sunday: [v("Assorted Paratha"), v("Achar & Curd"), v("Tea"), v("Milk"), v("Fruit"), nv("Eggs")],
    Monday: [v("Veg Sandwich"), v("Cutlet"), v("Tea"), v("Milk")],
    Tuesday: [v("Bedmi Puri"), v("Aloo"), v("Tea"), v("Milk")],
    Wednesday: [v("Poha"), v("Bread Toast"), v("Tea"), v("Milk")],
    Thursday: [v("Upma"), v("Aloo Bonda"), v("Tea"), v("Milk")],
    Friday: [v("Mixed Veg Seviyan"), v("Bread Toast"), v("Tea"), v("Milk")],
    Saturday: [v("Bread Pakoda"), v("Aloo Roll"), v("Tea"), v("Milk")],
  },
  Lunch: {
    Sunday: [v("Matar Paneer"), v("Yellow Dal"), v("Rice"), v("Chapati"), v("Raita")],
    Monday: [v("Aloo Methi"), v("Kadhi Pakora"), v("Rice"), v("Chapati")],
    Tuesday: [v("Lauki Kofta"), v("Rajma Masala"), v("Rice"), v("Chapati")],
    Wednesday: [v("Aloo Matar"), v("Amritsari Chana"), v("Rice"), v("Chapati")],
    Thursday: [v("Gajar Matar"), v("Moong Dhuli Dal"), v("Rice"), v("Chapati")],
    Friday: [v("Mixed Veg"), v("Panchmel Dal"), v("Rice"), v("Chapati")],
    Saturday: [v("Aloo Beans"), v("Lahori Chana"), v("Rice"), v("Chapati")],
  },
  Dinner: {
    Sunday: [nv("Kadai Chicken"), v("Dal Makhani"), v("Rice"), v("Chapati"), v("Moong Dal Halwa")],
    Monday: [v("Palak Kofta"), v("Moong Sabut Dal"), v("Rice"), v("Chapati"), v("Shahi Tukda")],
    Tuesday: [v("Aloo Gobhi"), v("Dhaba Dal"), v("Rice"), v("Chapati"), v("Gajar Halwa")],
    Wednesday: [nv("Chicken Curry"), v("Yellow Dal"), v("Rice"), v("Chapati"), v("Malpua")],
    Thursday: [v("Veg Noodles"), v("Manchurian"), v("Fried Rice"), v("Spring Roll"), v("Any Sweet")],
    Friday: [v("Aloo Baingan"), v("Arhar Dal"), v("Rice"), v("Chapati"), v("Suji Halwa")],
    Saturday: [v("Bedmi Aloo"), v("Veg Biryani"), v("Kesari Kheer")],
  },
};

export type GalleryItem = {
  frame: number;
  title: string;
  caption: string;
  position: string;
};

export const GALLERY: readonly GalleryItem[] = [
  { frame: 0, title: "The Golden Buffet", caption: "Brass and gold service, set for the evening.", position: "60% 50%" },
  { frame: 10, title: "Set for Service", caption: "Every chafing dish placed and labelled before the first guest arrives.", position: "62% 50%" },
  { frame: 40, title: "From the Kitchen Window", caption: "The chef at work, just before the plates go out.", position: "30% 50%" },
  { frame: 60, title: "Tikka on the Skewer", caption: "Marinated chicken, ready for the grill.", position: "55% 50%" },
  { frame: 80, title: "Mise en Place", caption: "Every plate is prepared and composed by hand.", position: "40% 50%" },
  { frame: 100, title: "Plated with Care", caption: "Finishing touches in the kitchen.", position: "42% 50%" },
];

export const PROMISES = [
  {
    title: "Less food wasted",
    body: "We practise and promote sustainability by actively reducing food wastage at every event.",
  },
  {
    title: "Leftovers donated",
    body: "If there is food left over, it is donated rather than discarded.",
  },
  {
    title: "Eco-friendly packaging",
    body: "Thoughtful, eco-friendly packaging for what leaves our kitchen.",
  },
  {
    title: "Menus made to measure",
    body: "Customised menus built around your guests, your tradition and your requirement.",
  },
] as const;

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  context: string;
  rating?: number;
};

/** Real client reviews, forwarded by the owner on WhatsApp. Quotes are verbatim. Never add invented ones. */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "millin",
    quote:
      "Rajat Caterers bring so much care to the entire experience. The food is delicious, beautifully presented, and the kind your guests go back for seconds of. Their team is warm and attentive, and the service runs so smoothly that you can actually relax and enjoy your own celebration. I’d happily recommend them to anyone looking for great food and genuinely thoughtful service.",
    name: "Millin Sangha Gujral",
    context: "Celebration",
  },
  {
    id: "cgst",
    quote:
      "Working with Rajat Caterers has been a seamless experience. Their team understands our corporate requirements perfectly and ensures smooth execution, quality food, and excellent hospitality every time. Their professionalism and commitment to customer satisfaction make them a dependable choice for corporate catering.",
    name: "Anshuman Jain",
    role: "Superintendent, CGST",
    context: "Corporate catering",
    rating: 5,
  },
  {
    id: "ed",
    quote:
      "We have been associated with Rajat caterers for a long time. They are absolutely reliable and ensures great quality food and service for any occasion big or small! Our experience have been pleasant with them and their team.",
    name: "Sharat Kumar",
    role: "Senior Officer, Enforcement Directorate",
    context: "Long-standing client",
  },
];

export const EVENT_TYPES =["Wedding", "Destination wedding", "Corporate", "Conference", "Government", "Social", "Other"] as const;

export const frameSrc = (n: number) =>
  `/sequence/frame_${String(n).padStart(3, "0")}_delay-0.05s.webp`;
