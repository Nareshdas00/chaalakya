(function ($) {
  "use strict";

  // =============================================
  // PLUGIN REGISTRATION
  // =============================================
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    CustomEase,
    SplitText,
  );

  // =============================================
  // HELPER / UTILITY FUNCTIONS
  // =============================================

  function addHoverPause(el, timeline) {
    el.addEventListener("mouseenter", () => timeline.pause());
    el.addEventListener("mouseleave", () => timeline.resume());
  }

  const marquee = (el, duration, x) => {
    const wrap = gsap.utils.wrap(0, 50);
    return gsap.to(el, {
      duration,
      ease: "none",
      x,
      modifiers: { x: (v) => (x = wrap(parseFloat(v)) + "%") },
      repeat: -1,
    });
  };

  const marqueeRight = (el, duration, x) => {
    const wrap = gsap.utils.wrap(0, 50);
    return gsap.to(el, {
      duration,
      ease: "none",
      x,
      modifiers: { x: (v) => (x = wrap(parseFloat(v)) + "%") },
      repeat: -1,
    });
  };

  // =============================================
  // ANIMATION FUNCTIONS
  // =============================================

  // split text animation
  function bwSplitText() {
    if ($(".bw-split-text").length) {
      var textheading = $(".bw-split-text");

      if (textheading.length === 0) return;
      textheading.each(function (index, el) {
        el.split = new SplitText(el, {
          type: "lines,words,chars",
          linesClass: "split-line",
        });

        if ($(el).hasClass("bw-split-text")) {
          gsap.set(el.split.chars, {
            opacity: 0.3,
            x: "-7",
          });
        }
        el.anim = gsap.to(el.split.chars, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 20%",
            markers: false,
            scrub: 1,
          },
          x: "0",
          y: "0",
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
        });
      });
    }
  }

  // reveal text animation 01
  function bwRevealText() {
    const bwElements = document.querySelectorAll(".bw-reveal-text");

    bwElements.forEach((el) => {
      if (!el.dataset.original) {
        el.dataset.original = el.innerHTML;
      }
    });

    const splitWords = (el) => {
      const text = el.dataset.original;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = text;

      const nodes = Array.from(wrapper.childNodes);
      const wrappedHTML = nodes
        .map((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent
              .split(/\s/)
              .map((word) => {
                return word
                  .split("-")
                  .map((part) => `<span class="word">${part}</span>`)
                  .join('<span class="hyphen">-</span>');
              })
              .join('<span class="whitespace"> </span>');
          } else {
            return node.outerHTML;
          }
        })
        .join("");
      el.innerHTML = wrappedHTML;
    };

    const getLines = (el) => {
      const lines = [];
      let line = [];
      const words = el.querySelectorAll("span");
      let lastTop = null;

      words.forEach((word) => {
        if (
          word.offsetTop !== lastTop &&
          !word.classList.contains("whitespace")
        ) {
          lastTop = word.offsetTop;
          line = [];
          lines.push(line);
        }
        line.push(word);
      });

      return lines;
    };

    const splitLines = (el) => {
      splitWords(el);

      const lines = getLines(el);
      let wrappedHTML = "";

      lines.forEach((wordsArr) => {
        wrappedHTML += '<span class="line"><span class="words">';
        wordsArr.forEach((word) => {
          wrappedHTML += word.outerHTML;
        });
        wrappedHTML += "</span></span>";
      });

      el.innerHTML = wrappedHTML;
    };

    const initReveal = (el) => {
      const lines = el.querySelectorAll(".words");
      gsap.killTweensOf(lines);
      gsap.set(el, { autoAlpha: 1 });

      gsap.from(lines, {
        yPercent: 100,
        ease: "power3.out",
        stagger: 0.25,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: el,
          toggleActions: "restart none none reset",
        },
      });
    };

    const runAll = () => {
      bwElements.forEach((el) => {
        splitLines(el);
        initReveal(el);
      });
    };

    runAll();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        runAll();
      }, 200);
    });
  }

  // reveal text animation 02
  function bwRevealText2() {
    const textRevealElements = document.querySelectorAll(".bw-reveal-text-2");

    textRevealElements.forEach((element) => {
      const nodes = Array.from(element.childNodes);
      element.innerHTML = "";

      nodes.forEach((node) => {
        if (node.nodeName === "BR") {
          element.appendChild(node.cloneNode());
          return;
        }

        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach((text) => {
            if (!text.trim()) {
              element.append(text);
            } else {
              const word = document.createElement("div");
              word.className = "word";
              word.textContent = text;
              element.appendChild(word);
            }
          });
          return;
        }

        if (node.nodeType === 1) {
          const word = document.createElement("div");
          word.className = "word";
          word.appendChild(node.cloneNode(true));
          element.appendChild(word);
        }
      });

      element.querySelectorAll(".word").forEach((word) => {
        if (word.children.length) {
          word.querySelectorAll("*").forEach((tag) => {
            const childNodes = Array.from(tag.childNodes);
            tag.innerHTML = "";

            childNodes.forEach((node) => {
              if (node.nodeType === 1) {
                tag.appendChild(node);
                return;
              }

              if (node.nodeType === 3) {
                node.textContent.split("").forEach((char) => {
                  if (!char.trim()) {
                    tag.append(char);
                  } else {
                    const p = document.createElement("div");
                    p.className = "perspective";
                    p.innerHTML = `<div class="letter"><div>${char}</div></div>`;
                    tag.appendChild(p);
                  }
                });
              }
            });
          });
        }

        if (!word.children.length) {
          const text = word.textContent;
          word.innerHTML = "";
          text.split("").forEach((char) => {
            if (!char.trim()) {
              word.append(char);
            } else {
              const p = document.createElement("div");
              p.className = "perspective";
              p.innerHTML = `<div class="letter"><div>${char}</div></div>`;
              word.appendChild(p);
            }
          });
        }
      });

      const letters = element.querySelectorAll(".letter");

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          toggleActions: "restart none none reset",
        },
      });

      tl.set(element, { autoAlpha: 1 });
      tl.fromTo(
        letters,
        1.6,
        {
          transformOrigin: "center",
          rotationY: 90,
          x: 30,
        },
        {
          rotationY: 0.1,
          x: 0,
          stagger: 0.025,
          ease: CustomEase.create("custom", "M0,0 C0.425,0.005 0,1 1,1 "),
        },
      );
    });
  }

  // bw title animation
  function bwTitleAnimation() {
    if (!document.querySelector(".bw-title-anim")) return;

    let splitTitleLines = gsap.utils.toArray(".bw-title-anim");

    splitTitleLines.forEach((splitTextLine) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: "top 90%",
          end: "bottom 60%",
          scrub: false,
          markers: false,
          toggleActions: "play none none reverse",
        },
      });

      const itemSplitted = new SplitText(splitTextLine, {
        type: "words, lines",
      });

      gsap.set(splitTextLine, { perspective: 400 });

      itemSplitted.split({ type: "lines" });

      tl.from(itemSplitted.lines, {
        duration: 1,
        delay: 0.3,
        opacity: 0,
        rotationX: -80,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1,
      });
    });
  }

  // scroll content horizontal & vertically
  function bwScroll() {
    document.querySelectorAll(".bw-scroll").forEach((section) => {
      let rl = section.querySelector(".bw-scroll-rl");
      let lr = section.querySelector(".bw-scroll-lr");
      let top = section.querySelector(".bw-scroll-top");
      let bottom = section.querySelector(".bw-scroll-bottom");

      if (!rl && !lr && !top && !bottom) return;

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 100%",
          end: "bottom top",
          scrub: 1,
          markers: false,
        },
      });

      if (rl) tl.from(rl, { xPercent: 20 });
      if (lr) tl.from(lr, { xPercent: -20 }, 0);
      if (top) tl.from(top, { yPercent: 10 }, 0);
      if (bottom) tl.from(bottom, { yPercent: -10 }, 0);
    });
  }

  // rotate animation
  function bwAnimateRotate() {
    gsap.utils.toArray(".bw-animate-rotate").forEach((el) => {
      let arspin = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scrub: 1,
          start: "top 100%",
          end: "top -50%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      arspin
        .set(el, { transformOrigin: "center center" })
        .fromTo(
          el,
          { rotate: 0 },
          { rotate: 180, duration: 2, immediateRender: false },
        );
    });
  }

  // right to left animation
  function rightToLeftAnim() {
    document.querySelectorAll(".right-to-left-anim").forEach((el) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 10%",
          scrub: 2,
          markers: false,
        },
      });

      tl.fromTo(el, { x: 200 }, { x: 0, duration: 1.6 });
    });
  }

  // left to right animation
  function leftToRightAnim() {
    document.querySelectorAll(".left-to-right-anim").forEach((el) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 10%",
          scrub: 2,
          markers: false,
        },
      });

      tl.fromTo(el, { x: -200 }, { x: 0, duration: 1.6 });
    });
  }

  // scroll zoom effect
  function zoomEffect() {
    gsap.utils.toArray(".zoom-effect").forEach((el) => {
      let tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scrub: 1,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      });

      tl1.set(el, { transformOrigin: "center center" }).from(
        el,
        { scale: 0.7 },
        {
          background: "inherit",
          scale: 1,
          duration: 1,
          immediateRender: false,
        },
      );
    });
  }

  // scroll scale image
  function initScaleAnimation() {
    const scales = document.querySelectorAll(".scale-anim");
    scales.forEach((item) => {
      gsap.to(item, {
        scale: 1,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    });
    const images = document.querySelectorAll(`${".scale-anim"} img`);
    images.forEach((img) => {
      gsap.set(img, {
        scale: 1.3,
      });
      gsap.to(img, {
        scale: 1,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    });
  }

  // scroll move parallax image
  function parallaxEffect() {
    document.querySelectorAll(".img-move-wrap").forEach((wrapper) => {
      const imgLR = wrapper.querySelector(".img-move-lr");
      const imgRL = wrapper.querySelector(".img-move-rl");
      const isRTL = getComputedStyle(wrapper).direction === "rtl";

      gsap.set(wrapper, { overflow: "hidden" });

      function getXPercent(startLTR, endLTR) {
        return isRTL ? -startLTR : startLTR;
      }

      if (imgLR) {
        gsap.set(imgLR, {
          width: "125%",
          maxWidth: "none",
          xPercent: getXPercent(-12.5, 0),
          willChange: "transform",
        });

        gsap.to(imgLR, {
          xPercent: getXPercent(0, 12.5),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (imgRL) {
        gsap.set(imgRL, {
          width: "125%",
          maxWidth: "none",
          xPercent: getXPercent(0, -12.5),
          willChange: "transform",
        });

        gsap.to(imgRL, {
          xPercent: getXPercent(-12.5, 0),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });
  }

  // marquee - two lines
  const inibwarquees = () => {
    const containers = [...document.querySelectorAll(".marquee--gsap")];
    if (!containers.length) return;

    containers.forEach((container) => {
      const topEl = container.querySelector(".marquee__top");
      const bottomEl = container.querySelector(".marquee__bottom");

      if (!topEl || !bottomEl) return;

      topEl.innerHTML += topEl.innerHTML;
      bottomEl.innerHTML += bottomEl.innerHTML;

      const tlTop = gsap.timeline().add(marquee(topEl, 30, "-=50%"), 0);
      const rTop = gsap.to(tlTop, {
        duration: 1.5,
        timeScale: 1,
        paused: true,
      });

      const clampTS = gsap.utils.clamp(1, 6);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (st) => {
          tlTop.timeScale(clampTS(Math.abs(st.getVelocity() / 200)));
          rTop.invalidate().restart();
        },
      });

      addHoverPause(topEl, tlTop);

      const tlBottom = gsap.timeline().add(marquee(bottomEl, 30, "+=50%"), 0);
      const rBottom = gsap.to(tlBottom, {
        duration: 1.5,
        timeScale: 1,
        paused: true,
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (st) => {
          tlBottom.timeScale(clampTS(Math.abs(st.getVelocity() / 200)));
          rBottom.invalidate().restart();
        },
      });

      addHoverPause(bottomEl, tlBottom);
    });
  };

  const inibwarquee = () => {
    const containers = [...document.querySelectorAll(".marquee-right--gsap")];
    if (!containers.length) return;

    containers.forEach((container) => {
      const el = container.querySelector(".marquee__toright");
      if (!el) return;

      el.innerHTML += el.innerHTML;

      const tl = gsap.timeline().add(marqueeRight(el, 30, "+=50%"), 0);
      const r = gsap.to(tl, { duration: 1.5, timeScale: 1, paused: true });

      const clampTS = gsap.utils.clamp(1, 6);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (st) => {
          tl.timeScale(clampTS(Math.abs(st.getVelocity() / 200)));
          r.invalidate().restart();
        },
      });

      addHoverPause(el, tl);
    });
  };

  const inibwarqueeLeft = () => {
    const containers = [...document.querySelectorAll(".marquee-left--gsap")];
    if (!containers.length) return;

    containers.forEach((container) => {
      const el = container.querySelector(".marquee__toleft");
      if (!el) return;

      el.innerHTML += el.innerHTML;

      const tl = gsap.timeline().add(marquee(el, 30, "-=50%"), 0);
      const r = gsap.to(tl, { duration: 1.5, timeScale: 1, paused: true });

      const clampTS = gsap.utils.clamp(1, 6);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (st) => {
          tl.timeScale(clampTS(Math.abs(st.getVelocity() / 200)));
          r.invalidate().restart();
        },
      });

      addHoverPause(el, tl);
    });
  };

  // service 02 item anim
  function serviceItemAnim() {
    if (document.querySelectorAll(".services-item-wrap").length) {
      const pw = gsap.matchMedia();
      pw.add("(min-width: 992px)", () => {
        document.querySelectorAll(".services-item-wrap").forEach((wrap) => {
          const pairs = wrap.querySelectorAll(".col-lg-6:nth-child(odd)");
          pairs.forEach((pair) => {
            const item1 = pair.querySelector(".service-item-1");
            const item2 =
              pair.nextElementSibling?.querySelector(".service-item-2");

            if (item1 && item2) {
              gsap.set(item1, { x: -400, rotate: -40 });
              gsap.set(item2, { x: 400, rotate: 40 });

              let tl = gsap.timeline({
                scrollTrigger: {
                  trigger: pair,
                  start: "top 90%",
                  end: "top 20%",
                  scrub: 1,
                },
              });

              tl.to(item1, { x: 0, rotate: 0 }).to(
                item2,
                { x: 0, rotate: 0 },
                0,
              );
            }
          });
        });
      });
    }
  }

  // =============================================
  // CIRCLE BUTTON ANIMATION
  // =============================================

  $(".conlive-circle-btn").on("mouseenter", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    $(this).find(".conlive-circle-btn__dot").css({
      top: y,
      left: x,
    });
  });

  $(".conlive-circle-btn").on("mouseout", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    $(this).find(".conlive-circle-btn__dot").css({
      top: y,
      left: x,
    });
  });

  var hoverBtns = gsap.utils.toArray(".conlive-circle-btn-wrapper");
  const hoverBtnItem = gsap.utils.toArray(".conlive-circle-btn");
  hoverBtns.forEach((btn, i) => {
    $(btn).mousemove(function (e) {
      callParallax(e);
    });

    function callParallax(e) {
      parallaxIt(e, hoverBtnItem[i], 80);
    }

    function parallaxIt(e, target, movement) {
      var $this = $(btn);
      var relX = e.pageX - $this.offset().left;
      var relY = e.pageY - $this.offset().top;

      gsap.to(target, 0.5, {
        x: ((relX - $this.width() / 2) / $this.width()) * movement,
        y: ((relY - $this.height() / 2) / $this.height()) * movement,
        ease: Power2.easeOut,
      });
    }
    $(btn).mouseleave(function (e) {
      gsap.to(hoverBtnItem[i], 0.5, {
        x: 0,
        y: 0,
        ease: Power2.easeOut,
      });
    });
  });

  // =============================================
  //  WINDOW LOAD
  // =============================================

  $(window).on("load", function () {
    if ($("#smooth-wrapper").length && $("#smooth-content").length) {
      ScrollSmoother.create({
        smooth: 2,
        effects: true,
        smoothTouch: 0.1,
        ignoreMobileResize: false,
      });
    }

    bwSplitText();
    bwRevealText();
    bwRevealText2();
    bwTitleAnimation();
    bwScroll();
    bwAnimateRotate();
    rightToLeftAnim();
    leftToRightAnim();
    zoomEffect();
    initScaleAnimation();
    parallaxEffect();
    inibwarquees();
    inibwarquee();
    inibwarqueeLeft();
    serviceItemAnim();

    ScrollTrigger.refresh();
  });

  document.fonts.ready.then(function () {
    ScrollTrigger.refresh();
  });
})(jQuery);
