(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The opening screen makes the first visit feel like a tiny celebration.
  const introScreen = $('#introScreen');
  document.body.classList.add('intro-open');
  $('#enterButton').addEventListener('click', () => {
    introScreen.classList.add('is-hidden');
    document.body.classList.remove('intro-open');
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 18);
    window.setTimeout(() => introScreen.remove(), 1100);
  });

  // A soft shower of glowing hearts greets Sevanthi on the opening screen.
  const introHeartRain = $('#introHeartRain');
  if (!reducedMotion) {
    const introHeartSymbols = ['♡', '♥', '✧', '♡', '✦'];
    const introHeartColors = ['#ffc2dc', '#f7a8c9', '#e4caff', '#ffe4b9'];
    for (let i = 0; i < 32; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'intro-falling-heart';
      heart.textContent = introHeartSymbols[Math.floor(Math.random() * introHeartSymbols.length)];
      heart.style.setProperty('--left', `${Math.random() * 100}%`);
      heart.style.setProperty('--size', `${12 + Math.random() * 22}px`);
      heart.style.setProperty('--duration', `${9 + Math.random() * 10}s`);
      heart.style.setProperty('--delay', `${-Math.random() * 18}s`);
      heart.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
      heart.style.setProperty('--heart-alpha', `${0.3 + Math.random() * 0.48}`);
      heart.style.setProperty('--heart-color', introHeartColors[Math.floor(Math.random() * introHeartColors.length)]);
      introHeartRain.appendChild(heart);
    }
  }

  // Soft falling hearts in the background.
  const heartRain = $('#heartRain');
  if (!reducedMotion) {
    const heartSymbols = ['♡', '♥', '✧'];
    const colors = ['#ff9fc6', '#e7b7ff', '#f5d7aa', '#ffc5dc'];
    for (let i = 0; i < 23; i += 1) {
      const heart = document.createElement('span');
      heart.className = 'falling-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.setProperty('--left', `${Math.random() * 100}%`);
      heart.style.setProperty('--size', `${9 + Math.random() * 13}px`);
      heart.style.setProperty('--duration', `${11 + Math.random() * 15}s`);
      heart.style.setProperty('--delay', `${-Math.random() * 22}s`);
      heart.style.setProperty('--drift', `${-65 + Math.random() * 130}px`);
      heart.style.setProperty('--alpha', `${0.18 + Math.random() * 0.24}`);
      heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
      heartRain.appendChild(heart);
    }
  }

  // Cursor glow and tiny heart/sparkle trail. On touch screens, tapping makes a burst instead.
  const cursorGlow = $('#cursorGlow');
  let lastTrail = 0;
  if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
    document.addEventListener('pointermove', (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = '1';
      const now = performance.now();
      if (now - lastTrail > 72) {
        lastTrail = now;
        const trail = document.createElement('span');
        trail.className = `cursor-heart${Math.random() > 0.68 ? ' sparkle' : ''}`;
        trail.textContent = Math.random() > 0.25 ? '♡' : '✧';
        trail.style.left = `${event.clientX}px`;
        trail.style.top = `${event.clientY}px`;
        trail.style.setProperty('--x', `${-24 + Math.random() * 48}px`);
        trail.style.setProperty('--y', `${-38 - Math.random() * 30}px`);
        document.body.appendChild(trail);
        window.setTimeout(() => trail.remove(), 950);
      }
    });
    document.addEventListener('pointerleave', () => { cursorGlow.style.opacity = '0'; });
  }
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && !reducedMotion) burstHearts(event.clientX, event.clientY, 7);
  });

  function burstHearts(x, y, amount = 12) {
    if (reducedMotion) return;
    const symbols = ['♡', '♥', '✦', '✧'];
    const palette = ['#ff9fc6', '#e8c1ff', '#f4d69c', '#ffc5dc'];
    for (let i = 0; i < amount; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'confetti-heart';
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.color = palette[Math.floor(Math.random() * palette.length)];
      particle.style.setProperty('--x', `${-145 + Math.random() * 290}px`);
      particle.style.setProperty('--y', `${-175 + Math.random() * 250}px`);
      particle.style.setProperty('--r', `${-150 + Math.random() * 300}deg`);
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1800);
    }
  }

  // Mobile navigation.
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open', !isOpen);
  });
  $$('#mainNav a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  }));

  // Scroll progress at the top of the screen.
  const scrollProgress = $('#scrollProgress');
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Soft animated rain gives the entire page its dreamy rainy-evening mood.
  const rainLayer = $('#rainLayer');
  if (rainLayer && !reducedMotion) {
    for (let i = 0; i < 58; i += 1) {
      const drop = document.createElement('span');
      drop.className = 'rain-drop';
      drop.style.setProperty('--rain-left', `${Math.random() * 105}%`);
      drop.style.setProperty('--rain-height', `${24 + Math.random() * 58}px`);
      drop.style.setProperty('--rain-opacity', `${0.12 + Math.random() * 0.34}`);
      drop.style.setProperty('--rain-speed', `${1.7 + Math.random() * 2.3}s`);
      drop.style.setProperty('--rain-delay', `${-Math.random() * 4}s`);
      rainLayer.appendChild(drop);
    }
  }

  // Rainy-day wish: every click sends a fresh little wish into the rain.
  const rainWishes = [
    'May every drop remind you how deeply you are loved. ♡',
    'A tiny wish: may your dreams find their way to you.',
    'Sending a thousand soft kisses with the rainy breeze.',
    'Even the clouds look prettier when I think of you.',
    'May today be gentle, pink, peaceful, and full of magic.'
  ];
  let rainWishIndex = 0;
  $('#rainWishButton')?.addEventListener('click', (event) => {
    $('#rainNote').textContent = rainWishes[rainWishIndex % rainWishes.length];
    rainWishIndex += 1;
    const rect = event.currentTarget.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
  });

  // Open-when letters unfold one at a time; opening all four completes the set.
  const envelopeCards = $$('.envelope-card');
  envelopeCards.forEach((card) => {
    const button = $('.note-open-button', card);
    const message = $('.envelope-message', card);
    button.addEventListener('click', () => {
      const opening = message.hidden;
      message.hidden = !opening;
      card.classList.toggle('is-open', opening);
      button.innerHTML = opening ? 'Fold this note <span>↗</span>' : 'Open this note <span>↗</span>';
      const opened = envelopeCards.filter((item) => !$('.envelope-message', item).hidden).length;
      $('#allNotesMessage').hidden = opened !== envelopeCards.length;
      if (opening) {
        const rect = card.getBoundingClientRect();
        burstHearts(rect.left + rect.width / 2, rect.top + 110, 9);
      }
    });
  });

  // Six little stars hold six wishes. Discover the full constellation.
  const starWishes = [
    'I wish you confidence on the days you doubt yourself.',
    'I wish your laugh stays loud and your heart stays light.',
    'I wish every dream you carry finds a beautiful beginning.',
    'I wish you feel appreciated in a thousand little ways.',
    'I wish you soft mornings, peaceful nights, and happy surprises.',
    'And my biggest wish: that you always know how loved you are. ♡'
  ];
  const constellationStars = $$('.constellation-star');
  let discoveredStars = 0;
  constellationStars.forEach((star) => {
    star.addEventListener('click', () => {
      if (star.classList.contains('discovered')) return;
      star.classList.add('discovered');
      star.setAttribute('aria-pressed', 'true');
      discoveredStars += 1;
      $('#starProgress').textContent = String(discoveredStars).padStart(2, '0');
      $('#constellationReveal').textContent = starWishes[Number(star.dataset.star)];
      $('#constellationSky').classList.add('has-stars');
      const rect = star.getBoundingClientRect();
      burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
      if (discoveredStars === constellationStars.length) {
        $('#constellationReveal').textContent = 'You found every star. But the brightest one will always be you, Aishu. ♡';
        showToast('You completed your constellation. Make a wish, birthday girl! ✨');
        burstHearts(window.innerWidth * .72, window.innerHeight * .42, 30);
      }
    });
  });

  // A new reason appears on every tap. The counter carries the surprise to 100.
  const reasons = [
    'Because your existence makes my world a gentler place.',
    'Because your smile can turn an ordinary day into a favourite memory.',
    'Because you make even silence feel comfortable.',
    'Because your dreams matter to me as much as my own.',
    'Because you are wonderfully and unapologetically yourself.',
    'Because I love the way your happiness makes me happy.',
    'Because your little stories are never little to me.',
    'Because you make distance feel worth crossing.',
    'Because your voice feels like my favourite song.',
    'Because you deserve all the softness this world can give.',
    'Because you make me want to become a kinder person.',
    'Because every version of you is worth celebrating.',
    'Because you are strong, even when you do not notice it.',
    'Because you make the future feel exciting.',
    'Because your laugh is a place I want to visit often.',
    'Because I can be silly around you and still feel understood.',
    'Because you bring colour to the quietest moments.',
    'Because you make a simple hello feel special.',
    'Because you inspire me without even trying.',
    'Because choosing you is my favourite everyday decision.',
    'Because you are a whole universe of lovely little details.',
    'Because you make rainy evenings feel romantic.',
    'Because your kindness leaves a mark on my heart.',
    'Because there is no one else quite like you.',
    'Because I want to hear about your day, every day.',
    'Because you make my favourite memories feel even brighter.',
    'Because you are worth every patient moment and every mile.',
    'Because you remind me that love lives in the little things.',
    'Because you are my favourite notification.',
    'Because the world is more beautiful with you in it.'
  ];
  let reasonStep = 1;
  let lastReason = 0;
  $('#nextReasonButton')?.addEventListener('click', (event) => {
    let next = Math.floor(Math.random() * reasons.length);
    if (reasons.length > 1) while (next === lastReason) next = Math.floor(Math.random() * reasons.length);
    lastReason = next;
    reasonStep = reasonStep >= 100 ? 1 : reasonStep + 1;
    $('#reasonCount').textContent = `${String(reasonStep).padStart(2, '0')} / 100`;
    const reasonText = $('#reasonText');
    reasonText.classList.remove('reason-change');
    void reasonText.offsetWidth;
    reasonText.textContent = reasons[next];
    reasonText.classList.add('reason-change');
    const rect = event.currentTarget.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);
  });

  // A future date ticket: the plan is revealed only when she opens it.
  $('#ticketButton')?.addEventListener('click', () => {
    const reveal = $('#ticketReveal');
    reveal.hidden = !reveal.hidden;
    $('#ticketButton').innerHTML = reveal.hidden ? 'Reveal our date plan <span>↗</span>' : 'Our little promise ♡';
    if (!reveal.hidden) {
      $('#dateTicket').classList.add('ticket-open');
      const rect = $('#dateTicket').getBoundingClientRect();
      burstHearts(rect.left + rect.width / 2, rect.top + 100, 16);
    }
  });

  // Gift surprise.
  const giftCard = $('#giftCard');
  const giftReveal = $('#giftReveal');
  const giftButton = $('#giftButton');
  function openGift() {
    giftCard.classList.add('is-open');
    giftReveal.hidden = false;
    giftButton.textContent = 'Gift opened ♡';
    giftButton.disabled = true;
    const rect = giftCard.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + 170, 22);
  }
  giftButton.addEventListener('click', openGift);
  $('#heroGiftButton').addEventListener('click', () => {
    document.querySelector('#surprises').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    window.setTimeout(openGift, reducedMotion ? 0 : 650);
  });

  // Long-distance virtual hug.
  const hugScene = $('#hugScene');
  const hugButton = $('#hugButton');
  const hugFeedback = $('#hugFeedback');
  let hugTimeout;
  hugButton.addEventListener('click', () => {
    hugScene.classList.add('hugging');
    hugButton.innerHTML = 'Hug delivered <span>♥</span>';
    hugFeedback.textContent = 'Squeeze tight, Aishu. Imagine I am right there. ♡';
    const rect = hugScene.getBoundingClientRect();
    burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    window.clearTimeout(hugTimeout);
    hugTimeout = window.setTimeout(() => {
      hugScene.classList.remove('hugging');
      hugButton.innerHTML = 'Send me another hug <span>♡</span>';
      hugFeedback.textContent = 'A warm hug is always waiting right here.';
    }, 3600);
  });

  // Shuffle helper shared by the replayable memory and quiz games.
  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  // Memory match: each new round gets a fresh card arrangement.
  const memoryBoard = $('#memoryBoard');
  const memorySymbols = ['♡', '✦', '☾', '❀', '♫', '∞'];
  let memoryOpenCards = [];
  let memoryMatchedPairs = 0;
  let memoryMoves = 0;
  let memoryLocked = false;
  let memoryMismatchTimeout;

  function startMemoryGame() {
    window.clearTimeout(memoryMismatchTimeout);
    memoryOpenCards = [];
    memoryMatchedPairs = 0;
    memoryMoves = 0;
    memoryLocked = false;
    $('#memoryMoves').textContent = '0';
    $('#memoryMatches').textContent = '0 / 6';
    $('#memoryStatus').textContent = 'Find the matching pairs, birthday girl ♡';
    memoryBoard.replaceChildren();

    shuffled([...memorySymbols, ...memorySymbols]).forEach((symbol) => {
      const card = document.createElement('button');
      card.className = 'memory-card';
      card.type = 'button';
      card.setAttribute('aria-label', 'Hidden memory card');
      card.setAttribute('aria-pressed', 'false');
      card.dataset.symbol = symbol;
      card.innerHTML = '<span class="memory-card-inner"><span class="memory-card-face memory-card-back">♡</span><span class="memory-card-face memory-card-front"></span></span>';
      $('.memory-card-front', card).textContent = symbol;
      card.addEventListener('click', () => {
        if (memoryLocked || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;
        card.classList.add('is-flipped');
        card.setAttribute('aria-pressed', 'true');
        card.setAttribute('aria-label', `Memory card: ${symbol}`);
        memoryOpenCards.push(card);

        if (memoryOpenCards.length < 2) return;
        memoryMoves += 1;
        $('#memoryMoves').textContent = String(memoryMoves);
        const [first, second] = memoryOpenCards;
        if (first.dataset.symbol === second.dataset.symbol) {
          first.classList.add('is-matched');
          second.classList.add('is-matched');
          first.disabled = true;
          second.disabled = true;
          first.setAttribute('aria-label', `Matched pair: ${symbol}`);
          second.setAttribute('aria-label', `Matched pair: ${symbol}`);
          memoryMatchedPairs += 1;
          $('#memoryMatches').textContent = `${memoryMatchedPairs} / 6`;
          memoryOpenCards = [];
          if (memoryMatchedPairs === memorySymbols.length) {
            $('#memoryStatus').textContent = `All matched in ${memoryMoves} moves! Your memory is full of love ♡`;
            const rect = memoryBoard.getBoundingClientRect();
            burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
          } else {
            $('#memoryStatus').textContent = 'A perfect match! Find another pair ♡';
          }
          return;
        }

        memoryLocked = true;
        $('#memoryStatus').textContent = 'Not a pair this time. Try another little combination!';
        memoryMismatchTimeout = window.setTimeout(() => {
          [first, second].forEach((openCard) => {
            openCard.classList.remove('is-flipped');
            openCard.setAttribute('aria-pressed', 'false');
            openCard.setAttribute('aria-label', 'Hidden memory card');
          });
          memoryOpenCards = [];
          memoryLocked = false;
        }, 760);
      });
      memoryBoard.appendChild(card);
    });
  }
  $('#memoryReset').addEventListener('click', startMemoryGame);
  startMemoryGame();

  // Heart catcher: a short timed round with a moving, tappable target.
  const catchTarget = $('#catchTarget');
  let catchMoveTimer;
  let catchClockTimer;
  let catchRemaining = 20;
  let catchScore = 0;
  let catchBest = 0;
  let catchActive = false;

  function moveCatchTarget() {
    catchTarget.style.left = `${10 + Math.random() * 80}%`;
    catchTarget.style.top = `${18 + Math.random() * 68}%`;
  }

  function finishCatchRound() {
    window.clearInterval(catchMoveTimer);
    window.clearInterval(catchClockTimer);
    catchActive = false;
    catchTarget.hidden = true;
    $('#catchHint').hidden = false;
    $('#catchHint').textContent = `Time's up! You caught ${catchScore} ${catchScore === 1 ? 'heart' : 'hearts'} ♡`;
    $('#catchStatus').textContent = catchScore > catchBest ? 'New personal best! You are a heart-catching star ✨' : 'Lovely catching! Fancy another round?';
    catchBest = Math.max(catchBest, catchScore);
    $('#catchBest').textContent = String(catchBest);
    $('#catchStart').disabled = false;
    $('#catchStart').innerHTML = 'Play again <span>↻</span>';
  }

  $('#catchStart').addEventListener('click', () => {
    window.clearInterval(catchMoveTimer);
    window.clearInterval(catchClockTimer);
    catchRemaining = 20;
    catchScore = 0;
    catchActive = true;
    $('#catchScore').textContent = '0';
    $('#catchTime').textContent = '20';
    $('#catchStatus').textContent = 'Go, birthday girl! Catch those hearts!';
    $('#catchHint').hidden = true;
    catchTarget.hidden = false;
    $('#catchStart').disabled = true;
    $('#catchStart').innerHTML = 'Heart rain is falling… <span>♡</span>';
    moveCatchTarget();
    catchMoveTimer = window.setInterval(moveCatchTarget, 1050);
    catchClockTimer = window.setInterval(() => {
      catchRemaining -= 1;
      $('#catchTime').textContent = String(catchRemaining);
      if (catchRemaining <= 0) finishCatchRound();
    }, 1000);
  });
  catchTarget.addEventListener('click', () => {
    if (!catchActive) return;
    catchScore += 1;
    $('#catchScore').textContent = String(catchScore);
    moveCatchTarget();
    if (catchScore % 4 === 0) {
      const rect = catchTarget.getBoundingClientRect();
      burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
    }
  });

  // A fresh question and answer order makes the birthday quiz replayable.
  const quizQuestions = [
    { question: 'Which song starts our little soundtrack?', options: ['Those Eyes', 'A Thousand Years', 'Humnava', 'Soul Vibez'], answer: 'A Thousand Years' },
    { question: 'What name is on this birthday surprise?', options: ['Aishu', 'Sevanthi', 'Birthday star', 'Sweetheart'], answer: 'Sevanthi' },
    { question: 'How many favourite photos are in the gallery?', options: ['Six', 'Seven', 'Nine', 'Twelve'], answer: 'Nine' },
    { question: 'How many stars are waiting in the constellation?', options: ['Four', 'Five', 'Six', 'Nine'], answer: 'Six' },
    { question: 'Which little weather corner is made just for us?', options: ['A sunny beach', 'A rainy window', 'A snowy cabin', 'A garden picnic'], answer: 'A rainy window' }
  ];
  let quizRound = [];
  let quizQuestionIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  let quizComplete = false;
  const quizAnswers = $('#quizAnswers');
  const quizAction = $('#quizAction');

  function startQuiz() {
    quizRound = shuffled(quizQuestions);
    quizQuestionIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    quizComplete = false;
    quizAction.hidden = false;
    quizAction.innerHTML = "Let's play <span>↗</span>";
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const item = quizRound[quizQuestionIndex];
    $('#quizProgress').textContent = `QUESTION ${quizQuestionIndex + 1} / ${quizRound.length} · SCORE ${quizScore}`;
    $('#quizQuestion').textContent = item.question;
    $('#quizFeedback').textContent = 'Pick your answer, birthday girl ♡';
    quizAction.hidden = true;
    quizAnswers.replaceChildren();
    shuffled(item.options).forEach((option) => {
      const answerButton = document.createElement('button');
      answerButton.className = 'quiz-answer';
      answerButton.type = 'button';
      answerButton.textContent = option;
      answerButton.addEventListener('click', () => {
        if (quizAnswered) return;
        quizAnswered = true;
        const correct = option === item.answer;
        if (correct) quizScore += 1;
        $$('.quiz-answer', quizAnswers).forEach((answer) => {
          answer.disabled = true;
          if (answer.textContent === item.answer) answer.classList.add('is-correct');
          else if (answer === answerButton && !correct) answer.classList.add('is-wrong');
        });
        $('#quizProgress').textContent = `QUESTION ${quizQuestionIndex + 1} / ${quizRound.length} · SCORE ${quizScore}`;
        $('#quizFeedback').textContent = correct ? 'You got it! Your birthday-surprise memory is lovely ♡' : `It was ${item.answer} — now it is tucked in your memory ♡`;
        quizAction.hidden = false;
        quizAction.innerHTML = quizQuestionIndex === quizRound.length - 1 ? 'See my score <span>✦</span>' : 'Next question <span>→</span>';
      });
      quizAnswers.appendChild(answerButton);
    });
  }

  function showQuizResult() {
    quizComplete = true;
    $('#quizProgress').textContent = `FINAL SCORE · ${quizScore} / ${quizRound.length}`;
    $('#quizQuestion').textContent = quizScore === quizRound.length ? 'A perfect score for my perfect favourite person!' : quizScore >= 3 ? 'You know our little universe so well!' : 'A lovely excuse to explore the page one more time!';
    quizAnswers.replaceChildren();
    $('#quizFeedback').textContent = `You got ${quizScore} out of ${quizRound.length}. No matter the score, you are my favourite answer ♡`;
    quizAction.innerHTML = 'Play again <span>↻</span>';
  }

  quizAction.addEventListener('click', () => {
    if (quizComplete || quizRound.length === 0) {
      startQuiz();
      return;
    }
    if (!quizAnswered) return;
    if (quizQuestionIndex === quizRound.length - 1) {
      showQuizResult();
      return;
    }
    quizQuestionIndex += 1;
    quizAnswered = false;
    renderQuizQuestion();
  });

  // The gallery is permanently populated with photos from assets/images.
  const galleryGrid = $('#galleryGrid');

  // Photo lightbox.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }
  galleryGrid.addEventListener('click', (event) => {
    const frame = event.target.closest('.photo-frame');
    if (!frame) return;
    const img = $('img', frame);
    if (!img) {
      showToast('This memory is still waiting to be framed ♡');
      return;
    }
    lightboxImage.src = img.src;
    const caption = $('.photo-caption p', frame.parentElement);
    lightboxCaption.textContent = caption ? caption.textContent : 'A little memory';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
  $('#lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  // Permanent six-song player and custom controls.
  const audioPlayer = $('#audioPlayer');
  const playButton = $('#playButton');
  const playIcon = $('#playIcon');
  const playerCard = $('.music-player-card');
  const audioProgress = $('#audioProgress');
  const currentTime = $('#currentTime');
  const totalTime = $('#totalTime');
  const playlistTracks = $$('.playlist-track');
  const tracks = [
    { title: 'A Thousand Years', subtitle: 'Christina Perri', file: 'assets/music/02-a-thousand-years-slowed-reverb.m4a' },
    { title: 'Those Eyes', subtitle: 'New West', file: 'assets/music/01-those-eyes-slowed-reverb.m4a' },
    { title: 'Modala Maleyanthe', subtitle: 'Our favourite melody', file: 'assets/music/04-modala-maleyanthe.mp3' },
    { title: 'Soul Vibez', subtitle: 'Sanju Mattu Geeta', file: 'assets/music/06-soul-vibez-slowed-reverb.m4a' },
    { title: 'Teri Meri Kahaani', subtitle: 'Arijit Singh & Palak Muchhal', file: 'assets/music/05-teri-meri-kahaani-slowed-reverb.m4a' },
    { title: 'Humnava', subtitle: 'Slowed + Reverb', file: 'assets/music/03-humnava-slowed-reverb.m4a' }
  ];
  let currentTrack = 0;

  function loadTrack(index, autoplay = false) {
    currentTrack = (index + tracks.length) % tracks.length;
    const track = tracks[currentTrack];
    audioPlayer.src = track.file;
    audioPlayer.load();
    $('#trackTitle').textContent = track.title;
    $('#trackSubtitle').textContent = `${track.subtitle} · ${String(currentTrack + 1).padStart(2, '0')} / 06`;
    playlistTracks.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === currentTrack));
    playIcon.textContent = '▶';
    playerCard.classList.remove('is-playing');
    if (autoplay) {
      audioPlayer.play().catch(() => showToast('Press play to start this song.'));
    }
  }

  playlistTracks.forEach((track, index) => {
    track.addEventListener('click', () => loadTrack(index, true));
  });

  playButton.addEventListener('click', async () => {
    if (!audioPlayer.src) {
      loadTrack(0);
      return;
    }
    if (audioPlayer.paused) {
      try {
        await audioPlayer.play();
      } catch (error) {
        showToast('This audio could not be played. Try another audio file.');
      }
    } else {
      audioPlayer.pause();
    }
  });
  audioPlayer.addEventListener('play', () => {
    playIcon.textContent = 'Ⅱ';
    playButton.setAttribute('aria-label', 'Pause song');
    playerCard.classList.add('is-playing');
  });
  audioPlayer.addEventListener('pause', () => {
    playIcon.textContent = '▶';
    playButton.setAttribute('aria-label', 'Play song');
    playerCard.classList.remove('is-playing');
  });
  audioPlayer.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audioPlayer.duration);
    audioProgress.value = '0';
  });
  audioPlayer.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
      audioProgress.value = String((audioPlayer.currentTime / audioPlayer.duration) * 100);
    }
  });
  audioPlayer.addEventListener('ended', () => {
    audioProgress.value = '0';
    loadTrack(currentTrack + 1, true);
  });
  audioPlayer.addEventListener('error', () => showToast('That audio file could not be loaded. Try an MP3 or WAV.'));
  audioProgress.addEventListener('input', () => {
    if (Number.isFinite(audioPlayer.duration)) audioPlayer.currentTime = (Number(audioProgress.value) / 100) * audioPlayer.duration;
  });
  $('#restartButton').addEventListener('click', () => {
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(() => showToast('Press play to start your song.'));
  });
  $('#previousButton').addEventListener('click', () => loadTrack(currentTrack - 1, true));
  $('#nextButton').addEventListener('click', () => loadTrack(currentTrack + 1, true));
  $('#muteButton').addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    $('#muteButton').textContent = audioPlayer.muted ? '×' : '♫';
    $('#muteButton').setAttribute('aria-label', audioPlayer.muted ? 'Unmute song' : 'Mute song');
  });

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Small toast notifications.
  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2900);
  }
})();
