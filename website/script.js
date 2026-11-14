const SUPABASE_URL = "https://bygfovftbizyimernjno.supabase.co";
// Publishable key: safe in the browser ONLY because RLS is enabled on
// service_requests with an insert-only policy (see supabase/policies.sql).
const SUPABASE_ANON_KEY = "sb_publishable_4bkbxW3nbh2uf_WSA2uC3w_0UBR1gll";

// If the Supabase CDN fails to load, keep the rest of the site working.
let supabaseClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase library did not load; the service form is disabled.');
  }
} catch (err) {
  console.error('Supabase init failed:', err);
}

const isArabic = document.documentElement.lang === 'ar';
const isRTL = document.documentElement.dir === 'rtl';

const MESSAGES = isArabic
  ? {
      sending: 'جارٍ إرسال الطلب...',
      success: 'وصلنا طلبك. سنرد عليك عبر البريد الإلكتروني الذي أدخلته.',
      error: 'لم يُرسَل طلبك. تأكد من اتصالك بالإنترنت ثم حاول مرة أخرى.',
      offline: 'الإرسال غير متاح الآن. راسلنا مباشرة على team@mawqfiplus.com'
    }
  : {
      sending: 'Sending request...',
      success: 'Request sent. We’ll reply to the email you entered.',
      error: 'Your request didn’t send. Check your connection and try again.',
      offline: 'Sending isn’t available right now. Email us at team@mawqfiplus.com'
    };


const header = document.getElementById('siteHeader');
const nav = document.getElementById('mainNav');
const toggle = document.getElementById('menuToggle');
const glow = document.querySelector('.cursor-glow');

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* =========================
   NAVBAR
   ========================= */

window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle(
      'scrolled',
      window.scrollY > 40
    );
  },
  { passive: true }
);

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');

  toggle.setAttribute(
    'aria-expanded',
    open
  );
});

document
  .querySelectorAll('.main-nav a')
  .forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });


/* =========================
   REVEAL ANIMATION
   ========================= */

const revealObserver =
  new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          revealObserver.unobserve(
            entry.target
          );
        }
      });
    },
    {
      threshold: 0.14
    }
  );

document
  .querySelectorAll('.reveal')
  .forEach(el => {
    revealObserver.observe(el);
  });


/* =========================
   ACTIVE NAVIGATION
   ========================= */

const sections = [
  ...document.querySelectorAll(
    'main section[id]'
  )
];

const navLinks = [
  ...document.querySelectorAll(
    '.nav-link'
  )
];

const sectionObserver =
  new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') ===
                `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      rootMargin:
        '-42% 0px -50% 0px'
    }
  );

sections.forEach(section => {
  sectionObserver.observe(section);
});


/* =========================
   ELEMENTS
   ========================= */

const heroMedia =
  document.getElementById(
    'heroMedia'
  );

const heroContent =
  document.getElementById(
    'heroContent'
  );

const journey =
  document.querySelector(
    '.journey'
  );

const journeyBg =
  document.getElementById(
    'journeyBg'
  );

const progressBar =
  document.getElementById(
    'journeyProgress'
  );

const journeyCopies = [
  ...document.querySelectorAll(
    '.journey-copy'
  )
];

const impactTrack =
  document.getElementById(
    'impactTrack'
  );

const parallaxImages = [
  ...document.querySelectorAll(
    '.parallax-image'
  )
];


/* =========================
   HELPERS
   ========================= */

const clamp = (
  n,
  min = 0,
  max = 1
) =>
  Math.min(
    max,
    Math.max(min, n)
  );

const lerp = (
  a,
  b,
  t
) =>
  a + (b - a) * t;


/* =========================
   SCROLL ANIMATIONS
   ========================= */

function updateScrollScenes() {

  if (reduceMotion) return;

  const vh =
    window.innerHeight;

  const sy =
    window.scrollY;


  /* =========================
     HERO
     ========================= */

  if (
    heroMedia &&
    heroContent
  ) {

    const heroP =
      clamp(
        sy / (vh * 0.95)
      );

    heroMedia.style.transform =
      `scale(${1.06 + heroP * 0.18})
       translate3d(
         0,
         ${heroP * -26}px,
         0
       )`;

    heroContent.style.transform =
      `translate3d(
         0,
         ${heroP * -90}px,
         0
       )
       scale(
         ${1 - heroP * 0.035}
       )`;

    heroContent.style.opacity =
      String(
        1 - heroP * 0.92
      );
  }


  /* =========================
     JOURNEY
     ========================= */

  if (
    journey &&
    journeyBg
  ) {

    const r =
      journey.getBoundingClientRect();

    const travel =
      journey.offsetHeight - vh;

    const p =
      clamp(
        (-r.top) / travel
      );

    const ease =
      1 -
      Math.pow(
        1 - p,
        2.2
      );


    /* Background moves forward */

    journeyBg.style.transform =
      `scale(
        ${1.12 + ease * 0.55}
      )
      translate3d(
        ${(p - 0.5) * -24}px,
        ${ease * -46}px,
        0
      )`;


    /* Progress bar */

    if (progressBar) {
      progressBar.style.height =
        `${p * 100}%`;
    }


    /* Journey text */

    const centers = [
      0.12,
      0.49,
      0.84
    ];

    journeyCopies.forEach(
      (copy, i) => {

        const d =
          Math.abs(
            p - centers[i]
          );

        const alpha =
          clamp(
            1 - d / 0.22
          );

        const shift =
          (p - centers[i]) *
          170;

        copy.style.opacity =
          alpha.toFixed(3);

        copy.style.transform =
          `translateY(
            calc(
              -45% +
              ${shift}px
            )
          )`;

        copy.style.filter =
          `blur(
            ${(1 - alpha) * 7}px
          )`;
      }
    );
  }


  /* =========================
     PARALLAX IMAGES
     ========================= */

  parallaxImages.forEach(
    el => {

      const r =
        el.parentElement
          .getBoundingClientRect();

      const center =
        r.top +
        r.height / 2 -
        vh / 2;

      const p =
        clamp(
          0.5 -
          center /
          (vh * 1.8),
          0,
          1
        );

      el.style.transform =
        `scale(
          ${1.09 + p * 0.06}
        )
        translate3d(
          0,
          ${center * -0.055}px,
          0
        )`;
    }
  );


  /* =========================
     MOVING TEXT
     ========================= */

  if (impactTrack) {

    const r =
      impactTrack
        .parentElement
        .getBoundingClientRect();

    const p =
      clamp(
        (vh - r.top) /
        (vh + r.height)
      );

    impactTrack.style.transform =
      `translate3d(
        ${isRTL ? lerp(-12, 42, p) : lerp(12, -42, p)}vw,
        0,
        0
      )`;
  }
}


/* =========================
   RUN SCROLL EFFECTS
   ========================= */

let scrollTicking = false;

function requestScrollUpdate() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateScrollScenes();
    scrollTicking = false;
  });
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);

updateScrollScenes();


/* =========================
   CURSOR EFFECT
   ========================= */

if (
  window
    .matchMedia(
      '(hover:hover)'
    )
    .matches &&
  !reduceMotion
) {

  window.addEventListener(
    'pointermove',
    e => {

      if (!glow) return;

      glow.style.left =
        `${e.clientX}px`;

      glow.style.top =
        `${e.clientY}px`;
    }
  );


  /* Magnetic buttons */

  document
    .querySelectorAll(
      '.magnetic'
    )
    .forEach(btn => {

      btn.addEventListener(
        'mousemove',
        e => {

          const r =
            btn.getBoundingClientRect();

          const x =
            e.clientX -
            (
              r.left +
              r.width / 2
            );

          const y =
            e.clientY -
            (
              r.top +
              r.height / 2
            );

          btn.style.transform =
            `translate(
              ${x * 0.08}px,
              ${y * 0.08}px
            )`;
        }
      );

      btn.addEventListener(
        'mouseleave',
        () => {
          btn.style.transform = '';
        }
      );
    });

} else if (glow) {

  glow.style.display =
    'none';
}


/* =========================
   SERVICE FORM
   ========================= */

const form =
  document.getElementById(
    'serviceForm'
  );

const note =
  document.getElementById(
    'formNote'
  );

form?.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    // Honeypot filled → almost certainly a bot. Pretend success, send nothing.
    if (formData.get('website')) {
      note.textContent = MESSAGES.success;
      note.style.color = '#0a9d55';
      form.reset();
      return;
    }

    if (!supabaseClient) {
      note.textContent = MESSAGES.offline;
      note.style.color = '#c0392b';
      return;
    }

    note.textContent = MESSAGES.sending;
    note.style.color = '#607788';
    if (submitBtn) submitBtn.disabled = true;

    const clean = key => String(formData.get(key) || '').trim();

    // status is NOT sent from the browser: the database sets it to 'NEW'.
    const requestData = {
      name: clean('name'),
      organization: clean('organization'),
      email: clean('email'),
      phone: clean('phone') || null,
      message: clean('message')
    };

    try {
      const { error } = await supabaseClient
        .from('service_requests')
        .insert([requestData]);

      if (error) throw error;

      note.textContent = MESSAGES.success;
      note.style.color = '#0a9d55';
      form.reset();

    } catch (error) {
      console.error('Supabase error:', error);
      note.textContent = MESSAGES.error;
      note.style.color = '#c0392b';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }
);
