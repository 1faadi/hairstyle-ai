/** Homepage long-form copy sourced from the site content spec. */

export const WHAT_IS_LEAD =
  "An AI hairstyle is a smart virtual styling software that places different haircuts, lengths, textures, and colours onto your uploaded photo. It studies your face shape, forehead, jawline, cheekbones, and hairline to create a realistic result."

export const WHAT_IS_BODY =
  "This tool works using advanced artificial intelligence technology that has learned from thousands of real haircuts. It can understand how hair naturally falls, how light reflects on different textures, and how colour changes appear on various hair types. This is what makes AI hairstyle previews look so realistic. You can get the following benefits from this:"

export const WHAT_IS_BENEFITS = [
  "100+ to 200+ hairstyles",
  "Realistic hair texture",
  "Face shape analysis",
  "Male and female styles",
  "No app browser version",
  "HD download",
  "Hair color support",
  "Privacy-safe uploads",
  "Fast results",
  "Hairstyle recommendations",
  "100% free",
] as const

export const WHY_LOVE_INTRO =
  "People often feel nervous before trying something new with their hair. Finding a small change in haircut can feel so big. A haircut changes your poise, makes an impact on your chicness and sometimes even on walks. And that is why hairstyle AI changes are very popular today. Here is how our free AI hairstyle helps you see your new look before making any real changes."

export type WhyLoveBlock = {
  title: string
  body: string
  bullets?: readonly string[]
}

export const WHY_LOVE_BLOCKS: readonly WhyLoveBlock[] = [
  {
    title: "No More Guesswork",
    body:
      "Rather than wondering whether a style will look good on you, you can immediately get a preview of it. If you want short layers, curly bangs or a bewitching pixie cut, by the time it’s time to head to the salon, you’ll know. It enables you to act quickly and decisively.",
  },
  {
    title: "Saves Money",
    body:
      "An expensive visit to the salon can go wrong. AI hairstyle preview minimises haircut blunders. By virtual experimenting, you can avoid the expensive blunders and focus only on the styles that make your heart sing. However, you don't have to pay money to experiment with various styles.",
  },
  {
    title: "Better Confidence",
    body:
      "Knowing ahead of time what your haircut might look like, you can enter the stylist’s chair with more confidence. It helps you walk into the salon with a clear picture in your mind and prevents second-guessing. This makes the entire salon experience less stressful.",
  },
  {
    title: "Great for Hair Color Testing",
    body:
      "If you want blonde, copper, silver, red, platinum or pastel pink, you can test everything first. That protects your hair from all that extra chemical damage and confusion. You can see how bold or subtle colours truly work for your skin tone.",
  },
  {
    title: "Useful for Men & Women",
    body:
      "It works well for all styles, from men’s fades to women’s bridal hairstyles. You can also try styles for teens, kids and seniors. All stakeholders benefit from a virtual preview. Perfect for the family or professional consultations.",
  },
  {
    title: "100% Free to Use",
    body:
      "The tool is completely free to use, and you don’t have to sign up. You can try out hundreds of hairstyles and colours without signing up for anything or providing personal information. It’s the easiest way to try on new looks and discover the style that’s best for you. It is ideal for those who seek immediate access with no obstacles.",
  },
  {
    title: "Lightning-Fast Hairstyle Previews in Seconds",
    body:
      "You can see your new look instantly. Just upload a photo of yourself and see how you look with any hairstyle, from classic to trendy, with realistic texturing and colouring suited to your face. With realistic results, you can change your hair in seconds.",
  },
  {
    title: "Privacy and Safety Features",
    body:
      "Many people worry before uploading personal photos online. Making AI hairstyles online for free without login platforms is even more attractive. You can easily play with test data without worrying about personal data. Our trusted AI hairstyle free tool usually offers:",
    bullets: [
      "Secure encryption",
      "Temporary storage",
      "Photos deleted automatically within 24 hours",
      "No sharing",
      "No third-party use",
      "No training usage",
      "Browser-based privacy controls",
    ],
  },
  {
    title: "Styles for All Hair Types and Lengths",
    body:
      "If you’re going for a short pixie cut, long layered waves or a daring colour switch-up, our hairstyle tool does it all. It’s for men and women of all ages and tailors to your specific features and style preferences. It offers:",
    bullets: [
      "Short Styles: Pixie, Bob, Crew Cut",
      "Long Styles: Layers, Waves, Straight",
      "Color Choices: Natural colors, Fashion colours, Hair lightening",
      "Trendy Cuts: Modern, Classic, Edgy",
    ],
  },
] as const

export type HowStep = {
  stepLabel: string
  title: string
  body: string
  bullets?: readonly string[]
  footnote?: string
}

export const HOW_IT_WORKS_INTRO =
  "Now, discovering your perfect hairstyle is easier than ever with the virtual hairstyle changer. Follow these steps to try multiple styles, colours, and lengths before visiting a salon:"

export const HOW_IT_WORKS_STEPS: readonly HowStep[] = [
  {
    stepLabel: "Step 1",
    title: "Upload Your Photo",
    body: "Start by uploading a clear, front-facing photo. For the most accurate results:",
    bullets: [
      "Keep your face fully visible",
      "Avoid sunglasses or hats",
      "Use a simple, neutral background",
      "Make sure your hairline is clear",
      "Use a neutral facial expression",
    ],
    footnote:
      "JPG, PNG, or WebP files up to 10–20MB are supported. Once uploaded, the AI analyses your facial features and hair structure to suggest styles that match your face shape and hair type.",
  },
  {
    stepLabel: "Step 2",
    title: "Pick Gender and Hairstyle",
    body: "Choose the gender category that matches you:",
    bullets: ["Male hairstyles", "Female hairstyles", "Kids styles", "Unisex styles"],
    footnote:
      "Next, browse popular style categories: straight, wavy, curly; bob, layered, shag; high ponytail, low ponytail, bun styles; braids, undercut, textured crop; crew cut, fade, slick back. Our tool also offers seasonal or trendy suggestions, keeping you updated with the latest hair fashion.",
  },
  {
    stepLabel: "Step 3",
    title: "Try Hair Colors",
    body:
      "Trying out different hair colours is the most fun part of our AI hairstyle tool. The AI simulates lighting and hair texture, ensuring colours look realistic and natural in your preview. You can see how many shades look on you before actually colouring your hair.",
    bullets: [
      "Jet black, brown, blonde, caramel, honey blonde",
      "Silver, copper, burgundy",
      "Blue highlights, purple, rose gold, fantasy green",
    ],
  },
  {
    stepLabel: "Step 4",
    title: "Get Instant Preview",
    body:
      "Once you select a style and colour, the AI generates your new look in 10–30 seconds. Our tools are trained on 150+ salon hairstyles, producing highly realistic results. You can try multiple combinations in a single session to see which style suits you best. The AI provides a side-by-side comparison, making decision-making easier.",
  },
  {
    stepLabel: "Step 5",
    title: "Download & Share",
    body: "Once you love your new look:",
    bullets: [
      "Download the high-quality image",
      "Share with your stylist, friends, or family",
      "Use it for bridal makeup planning or salon consultations",
    ],
    footnote:
      "You can even create a digital lookbook of your favourite hairstyles. This ensures clear communication with your stylist and reduces the chance of mistakes during your real haircut.",
  },
] as const

export const TOP_STYLES_INTRO =
  "One of the main reasons why people love virtual hairstyle changers is the ever-expanding variety. You have unlimited freedom to experiment without having to subscribe. Here are different hairstyles for women and men that you can test:"

export const WOMEN_STYLES_INTRO =
  "You can experiment with different textures and colours, to see several options before settling on one."

export const WOMEN_STYLES = [
  "Pixie cut",
  "Short bob",
  "Angled bob",
  "Layered bob",
  "Long layers",
  "Glamorous waves",
  "Hollywood curls",
  "Messy bun",
  "French braid",
  "Crown braid",
  "Top knot",
  "Blunt bangs",
  "Side bangs",
  "Wedding bun",
  "Chignon",
  "Braided crown",
] as const

export const MEN_STYLES_INTRO =
  "Today, male searches are highly viral. In some advanced apps, men can also try out a variety of facial hair styles and even experiment with their hairline."

export const MEN_STYLES = [
  "Buzz cut",
  "Fade",
  "Undercut",
  "Side part",
  "Slick back",
  "Textured crop",
  "Crew cut",
  "Messy top",
  "Curly fade",
  "Medium layered",
  "Beard combinations",
] as const

export const FACE_SHAPE_INTRO =
  "One of the most valuable features of a virtual hairstyle changer is face shape matching. It answers the question: Which hairstyle suits me? Different haircuts suit different face shapes, and AI helps you choose wisely."

export const FACE_TYPES = [
  "Oval face",
  "Round face",
  "Square face",
  "Diamond face",
  "Heart face",
  "Long face",
] as const

export const FACE_EXAMPLES = [
  "Round face — long layers, and side parts",
  "Square face — soft curls, textured layers",
  "Oval face — nearly all frame styles",
  "Heart shape — bangs, shoulder cuts",
  "Diamond face — bob, and waves",
] as const

export const WEDDINGS_INTRO =
  "Wedding and party looks are a huge reason people use the virtual hairstyle changer. You can plan your perfect look weeks before the event. You can preview:"

export const WEDDINGS_PREVIEW = [
  "Bridal buns",
  "Soft curls",
  "Crown braids",
  "Flower bun styles",
  "Formal ponytails",
  "Event updos",
  "Elegant twists",
] as const

export const WEDDINGS_ALSO = [
  "Engagement shoots",
  "Graduation",
  "Birthday looks",
  "Eid styling",
  "Office events",
  "Family functions",
] as const

export const COLOUR_INTRO =
  "Hair colour is one of the biggest reasons people regret salon visits. Choosing a bold or light shade without testing it first can cause disappointment. A good hairstyle AI tool allows you to safely test shades before applying real dye. Popular colours include:"

export const COLOUR_LIST = [
  "Platinum blonde",
  "Ash brown",
  "Chestnut",
  "Burgundy",
  "Silver",
  "Copper",
  "Blue",
  "Purple",
  "Rose gold",
  "Pink streaks",
] as const

export const COLOUR_OUTRO =
  "You can even mix colours, highlights, and balayage effects in most apps. This is extremely useful if you want a dramatic makeover."

export const SALON_INTRO =
  "A salon visit becomes much easier when you already know what you want. With an AI hairstyle free preview, you can:"

export const SALON_BULLETS = [
  "Avoid miscommunication",
  "Show exact cut reference",
  "Save consultation time",
  "Reduce styling mistakes",
  "Choose color confidently",
] as const

export const WHO_INTRO =
  "Virtual hairstyle changers are flexible and easy to use, making them great for anyone. They help you see how a style will look before making a real change. This saves time, reduces mistakes, and boosts confidence. Here is who can use it:"

export type WhoLine = { role: string; text: string }

export const WHO_LINES: readonly WhoLine[] = [
  {
    role: "Brides",
    text: "Experiment with wedding buns and curls before the big day.",
  },
  {
    role: "Men",
    text: "Preview fades, beard and haircut styles to avoid fumbles and save styling time.",
  },
  {
    role: "Stylish students",
    text: "Trend-chasing college hairstyles and dare to experiment with trendy colours safely.",
  },
  {
    role: "Professionals",
    text: "Look for office-appropriate cuts that meet both professional and stylish standards.",
  },
  {
    role: "Busy moms",
    text: "Discover haircuts that require minimal salon time.",
  },
  {
    role: "Teens",
    text: "Safe AI previews let you play with colourful styles.",
  },
  {
    role: "Stylists",
    text: "When consulting clients, use the previews to provide accurate recommendations and instil confidence.",
  },
] as const

export const USER_FEEDBACK_INTRO =
  "User feedback shows that people love how easy and accurate the virtual hairstyle changer is. Over 68% of users say AI previews reduce anxiety before salon visits, and 55% tried styles they wouldn’t have considered without AI guidance. Here’s what users say about our AI Hairstyle tool:"

export type LandingTestimonial = { name: string; quote: string }

export const LANDING_TESTIMONIALS: readonly LandingTestimonial[] = [
  {
    name: "Celia R.",
    quote:
      "I tried different hair colours with the AI tool and felt confident before visiting the salon. I even experimented with a bold pastel pink that I wouldn’t have considered otherwise. It made choosing a style fun and stress-free.",
  },
  {
    name: "Ahmed K.",
    quote:
      "Using the AI tool helped me pick the perfect fade and beard style. I could see exactly how it would look, which saved me time and worry. Now I walk into the barber's with a clear idea.",
  },
  {
    name: "Leila M.",
    quote:
      "I explored trendy college hairstyles safely. The AI preview showed me which cuts and colours suited my face. I even tried a pixie cut virtually, which I never thought I’d do in real life.",
  },
  {
    name: "Nadia S.",
    quote:
      "As a busy mom, I don’t have time for trial and error. The virtual hairstyle changer helped me choose a flattering style quickly. I saved money and avoided unnecessary mistakes at the salon.",
  },
  {
    name: "Mariam T.",
    quote:
      "I loved how quickly I could try different hairstyles without leaving home. The AI tool showed me exactly what suited my face shape, and I finally chose a cut I’ve been dreaming of for months.",
  },
  {
    name: "John R.",
    quote:
      "I was nervous to try a new hairstyle, but the AI preview made it easy. I tested several trendy cuts and colours virtually, and it saved me both time and money at the salon.",
  },
] as const

export const CONCLUSION_TEXT =
  "It is hard to underestimate the influence of a hairstyle on your look, style, and level of confidence. For example, decide to take advantage of a hairstyle AI before you go to a hairdresser. If you want to make your transformation easy and incredibly smart, using an AI hairstyle app or an AI hairstyle free online tool is the best solution today."
