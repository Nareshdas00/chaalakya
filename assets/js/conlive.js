(function ($) {
  "use strict";

  /* hero slider title animation */
  function sliderTitle() {
    const textRevealElements = document.querySelectorAll(".slider-title");

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

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const $element = $(entry.target);
              $element.css("visibility", "visible");

              $element.find(".letter").each(function (index) {
                $(this)
                  .css({
                    "animation-delay": index * 0.025 + "s"
                  })
                  .addClass("animate");
              });

              observer.unobserve(entry.target);
            } else {
              const $element = $(entry.target);
              $element.css("visibility", "hidden");
              $element
                .find(".letter")
                .removeClass("animate")
                .css("animation-delay", "");
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
    });
  }

  /* hero slider title animation */
  function heroTitle() {
    $(".hero-title").each(function () {
      const originalHtml = $(this).html();
      let newHtml = "";
      let i = 0;
      let delay = 0.05;
      let insideTag = false;
      let tagBuffer = "";
      let tagStack = [];

      function wrapWord(word, isManualDiv = false) {
        let result = isManualDiv ? "" : '<span style="display:inline-block;">';
        for (let j = 0; j < word.length; j++) {
          const char = word[j];
          if (char.trim()) {
            result += `<span class="char" style="animation-delay:${delay.toFixed(
              2
            )}s">${char}</span>`;
            delay += 0.05;
          } else {
            result += char;
          }
        }
        if (!isManualDiv) result += "</span>";
        return result;
      }

      let buffer = "";
      let insideManualDiv = false;

      while (i < originalHtml.length) {
        const char = originalHtml[i];

        if (char === "<") {
          if (buffer.trim()) {
            const words = buffer.split(/(\s+)/);
            for (const word of words) {
              if (word.trim()) {
                newHtml += wrapWord(word, insideManualDiv);
              } else {
                newHtml += word;
              }
            }
          } else {
            newHtml += buffer;
          }
          buffer = "";
          insideTag = true;
          tagBuffer = "<";
        } else if (insideTag) {
          tagBuffer += char;
          if (char === ">") {
            insideTag = false;

            const isClosing = /^<\//.test(tagBuffer);
            const tagNameMatch = tagBuffer.match(/^<\/?(\w+)/);
            const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";

            if (tagName === "div") {
              if (!isClosing) {
                tagStack.push("div");
                insideManualDiv = true;
              } else {
                tagStack.pop();
                insideManualDiv = tagStack.includes("div");
              }
            }

            newHtml += tagBuffer;
            tagBuffer = "";
          }
        } else {
          buffer += char;
        }

        i++;
      }

      if (buffer.trim()) {
        const words = buffer.split(/(\s+)/);
        for (const word of words) {
          if (word.trim()) {
            newHtml += wrapWord(word, insideManualDiv);
          } else {
            newHtml += word;
          }
        }
      } else {
        newHtml += buffer;
      }

      $(this).html(newHtml);
    });
  }

  function titleAnimUpText() {
    const titleElements = document.querySelectorAll(".title-anim-up-text");
    if (!titleElements.length) return;

    titleElements.forEach((textEl) => {
      const text = textEl.textContent.trim();
      textEl.setAttribute("aria-label", text); // Accessibility

      const html = [...text]
        .map((char, i) => {
          const safeChar = char === " " ? "&nbsp;" : char;
          return `<span class="char" aria-hidden="true" style="--char:${i + 1};">${safeChar}</span>`;
        })
        .join("");

      textEl.innerHTML = html;
    });
  }

  // video play & pause
  $(function () {
    const playIcon = `<i class="fas fa-play"></i>`;
    const pauseIcon = `<i class="fas fa-pause"></i>`;

    $(document).on("click", ".play-btn", function () {
      const $btn = $(this);
      const video = $btn.closest(".video-section").find(".bg-video")[0];

      if (video.paused) {
        video.play();
        $btn.find("span").html(pauseIcon);
      } else {
        video.pause();
        $btn.find("span").html(playIcon);
      }
    });
  });

  //Select Country Phone Code List CSS
  $("#country-phone-code-list").on("focus", function () {
    $(".iti__flag-container").css("left", "0px");
  });
  $("#country-phone-code-list").on("focusout", function () {
    $(".iti__flag-container").css("left", "20px");
  });

  // webgl images hover animation
  function initWebglHover() {
    if ($(".bw-hover-item").length) {
      let hoverAnimation__do = function (t, n) {
        let a = new hoverEffect({
          parent: t.get(0),
          intensity: t.data("intensity") || void 0,
          speedIn: t.data("speedin") || void 0,
          speedOut: t.data("speedout") || void 0,
          easing: t.data("easing") || void 0,
          hover: t.data("hover") || void 0,
          image1: n.eq(0).attr("src"),
          image2: n.eq(0).attr("src"),
          displacementImage: t.data("displacement"),
          imagesRatio: n[0].height / n[0].width,
          hover: !1
        });
        t.closest(".bw-hover-item")
          .on("mouseenter", function () {
            a.next();
          })
          .on("mouseleave", function () {
            a.previous();
          });
      };
      let hoverAnimation = function () {
        $(".bw-hover-img").each(function () {
          let n = $(this);
          let e = n.find("img");
          let i = e.eq(0);
          i[0].complete
            ? hoverAnimation__do(n, e)
            : i.on("load", function () {
                hoverAnimation__do(n, e);
              });
        });
      };
      hoverAnimation();
    }
  }

  // countdown time
  let countdownEl = $(".countdown");

  // attributes
  let targetDateAttr = countdownEl.attr("data-date") || "";
  let dynamicDayAttr = countdownEl.attr("data-dynamic-day");
  let dynamicHourAttr = countdownEl.attr("data-dynamic-hour");

  function safeInt(val) {
    let parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }

  let dynamicDay = safeInt(dynamicDayAttr);
  let dynamicHour = safeInt(dynamicHourAttr);

  function parseDate(dateStr) {
    let parts = dateStr.split(/[\s,\-\/]+/).filter(Boolean);

    let result;

    if (parts.length === 3) {
      let a = parseInt(parts[0], 10);
      let b = parseInt(parts[1], 10);
      let c = parseInt(parts[2], 10);

      if (a > 12) {
        result = new Date(c, b - 1, a); // DD/MM/YYYY
      } else {
        result = new Date(c, a - 1, b); // MM/DD/YYYY
      }
    } else {
      result = new Date(dateStr);
    }

    return isNaN(result.getTime()) ? null : result;
  }

  let endDate;

  if (targetDateAttr) {
    let parsed = parseDate(targetDateAttr);

    if (parsed) {
      endDate = parsed.getTime();
      $(".dynamic-date").text(targetDateAttr);
    } else {
      console.warn("Invalid date provided:", targetDateAttr);
    }
  } else if (dynamicDay !== null || dynamicHour !== null) {
    let now = new Date();
    if (dynamicDay !== null) now.setDate(now.getDate() + dynamicDay);
    if (dynamicHour !== null) now.setHours(now.getHours() + dynamicHour);
    endDate = now.getTime();
    $(".dynamic-date").text("Starting from now");
  } else {
    let now = new Date();
    now.setDate(now.getDate() + 30);
    endDate = now.getTime();
    $(".dynamic-date").text("Next 30 Days");
  }

  // countdown function
  function updateCountdown() {
    if (!endDate) return;

    let now = new Date().getTime();
    let distance = endDate - now;

    if (distance < 0) {
      $("#days, #hours, #minute, #second").text("0");
      return;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let second = Math.floor((distance % (1000 * 60)) / 1000);

    $("#days").text(days);
    $("#hours").text(hours);
    $("#minute").text(minute);
    $("#second").text(second);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ripples animation
  $(".ripple-animation").each(function () {
    let filterEl = document.querySelector(
      '.ripple-svg-one [type="fractalNoise"]'
    );
    let tl = new TimelineMax({
      repeat: -1
    });

    tl.to(
      filterEl,
      10,
      {
        attr: {
          baseFrequency: "0.001 0.004"
        }
      },
      0
    );

    // tl.play();
    $(this).mouseover(function () {
      this.style.filter = "url(#warp)";
      tl.play();
      tl.yoyo(true);
    });
    $(this).mouseout(function () {
      this.style.filter = "none";
      tl.reverse();
      tl.yoyo(false);
    });
    let filterEl2 = document.querySelector(
      '.ripple-svg-two [type="fractalNoise"]'
    );
    let tl2 = new TimelineMax({
      repeat: -1
    });

    tl2.to(
      filterEl2,
      3,
      {
        attr: {
          baseFrequency: "0.0005 0.0005"
        }
      },
      0
    );

    tl2.yoyo(true);
  });

  // hover image
  const link = document.querySelectorAll(".hover-item");
  const linkHoverReveal = document.querySelectorAll(".hover-item__box");
  const linkImages = document.querySelectorAll(".hover-item__box-img");
  for (let i = 0; i < link.length; i++) {
    link[i].addEventListener("mousemove", (e) => {
      linkHoverReveal[i].style.opacity = 1;
      linkHoverReveal[i].style.transform =
        `translate(-100%, -50% ) rotate(-14deg)`;
      linkImages[i].style.transform = "scale(1, 1)";
      linkHoverReveal[i].style.left = e.clientX + "px";
    });
    link[i].addEventListener("mouseleave", (e) => {
      linkHoverReveal[i].style.opacity = 0;
      linkHoverReveal[i].style.transform =
        `translate(-50%, -50%) rotate(14deg)`;
      linkImages[i].style.transform = "scale(0.8, 0.8)";
    });
  }

  /*-- Checkout Accoradin --*/
  if ($(".checkout-page__payment__title").length) {
    $(".checkout-page__payment__item")
      .find(".checkout-page__payment__content")
      .hide();
    $(".checkout-page__payment__item--active")
      .find(".checkout-page__payment__content")
      .show();
    $(".checkout-page__payment__title").on("click", function (e) {
      e.preventDefault();
      $(this)
        .parents(".checkout-page__payment")
        .find(".checkout-page__payment__item")
        .removeClass("checkout-page__payment__item--active");
      $(this)
        .parents(".checkout-page__payment")
        .find(".checkout-page__payment__content")
        .slideUp();
      $(this).parent().addClass("checkout-page__payment__item--active");
      $(this).parent().find(".checkout-page__payment__content").slideDown();
    });
  }

  let dynamicyearElm = $(".dynamic-year");
  if (dynamicyearElm.length) {
    let currentYear = new Date().getFullYear();
    dynamicyearElm.html(currentYear);
  }

  // Date Picker
  if ($(".conlive-datepicker").length) {
    $(".conlive-datepicker").each(function () {
      $(this).datepicker();
    });
  }

  // Popular Causes Progress Bar
  if ($(".count-bar").length) {
    $(".count-bar").appear(
      function () {
        let el = $(this);
        let percent = el.data("percent");
        $(el).css("width", percent).addClass("counted");
      },
      {
        accY: -50
      }
    );
  }

  //Fact Counter + Text Count
  if ($(".count-box").length) {
    $(".count-box").appear(
      function () {
        let $t = $(this),
          n = $t.find(".count-text").attr("data-stop"),
          r = parseInt($t.find(".count-text").attr("data-speed"), 10);

        if (!$t.hasClass("counted")) {
          $t.addClass("counted");
          $({
            countNum: $t.find(".count-text").text()
          }).animate(
            {
              countNum: n
            },
            {
              duration: r,
              easing: "linear",
              step: function () {
                $t.find(".count-text").text(Math.floor(this.countNum));
              },
              complete: function () {
                $t.find(".count-text").text(this.countNum);
              }
            }
          );
        }
      },
      {
        accY: 0
      }
    );
  }

  // custom coursor
  if ($(".custom-cursor").length) {
    const cursor = document.querySelector(".custom-cursor__cursor");
    const cursorinner = document.querySelector(".custom-cursor__cursor-two");
    const links = document.querySelectorAll("a");

    document.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;

      cursorinner.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
    });

    document.addEventListener("mousedown", () => {
      cursor.classList.add("click");
      cursorinner.classList.add("custom-cursor__innerhover");
    });

    document.addEventListener("mouseup", () => {
      cursor.classList.remove("click");
      cursorinner.classList.remove("custom-cursor__innerhover");
    });

    links.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursor.classList.add("custom-cursor__hover");
      });

      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("custom-cursor__hover");
      });
    });
  }

  if ($(".contact-form-validated").length) {
    $(".contact-form-validated").validate({
      // initialize the plugin
      rules: {
        name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        message: {
          required: true
        },
        subject: {
          required: true
        }
      },
      submitHandler: function (form) {
        const $form = $(form);
        const $result = $form.parent().find(".result");
        const phoneInput = form.querySelector("#country-phone-code-list");

        // Only run if phone field + intlTelInput exist
        if (phoneInput && window.intlTelInputGlobals) {
          const iti = window.intlTelInputGlobals.getInstance(phoneInput);

          // Fallback if instance exists
          if (iti) {
            phoneInput.value = iti.getNumber();
          }
        }

        $.post($form.attr("action"), $form.serialize())

          .done(function (response) {
            $result.html('<div class="success-message">' + response + "</div>");

            $form.find('input[type="text"]').val("");
            $form.find('input[type="email"]').val("");
            $form.find("textarea").val("");
          })

          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Form submission failed:", textStatus, errorThrown);

            $result.html(
              '<div class="error-message">' +
                "Something went wrong. Please try again later." +
                "</div>"
            );
          });

        return false;
      }
    });
  }

  // mailchimp form
  if ($(".mc-form").length) {
    $(".mc-form").each(function () {
      let $self = $(this);
      let mcURL = $self.data("url");
      let mcResp = $self.parent().find(".mc-form__response");

      $self.ajaxChimp({
        url: mcURL,
        callback: function (resp) {
          const message = $("<p>", {
            class: "mc-message",
            text: resp.msg // safely escaped
          });
          // appending response
          mcResp.append(message);
          // making things based on response
          if (resp.result === "success") {
            // Do stuff
            $self.removeClass("errored").addClass("successed");
            mcResp.removeClass("errored").addClass("successed");
            $self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
          if (resp.result === "error") {
            $self.removeClass("successed").addClass("errored");
            mcResp.removeClass("successed").addClass("errored");
            $self.find("input").val("");

            mcResp.find("p").fadeOut(10000);
          }
        }
      });
    });
  }

  if ($(".video-popup").length) {
    $(".video-popup").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: true,

      fixedContentPos: false
    });
  }

  $(document).on("click", ".video-popup", function (e) {
    e.preventDefault();

    $.magnificPopup.open({
      items: {
        src: $(this).attr("href")
      },
      type: "iframe"
    });
  });

  if ($(".img-popup").length) {
    let groups = {};
    $(".img-popup").each(function () {
      let id = parseInt($(this).attr("data-group"), 10);

      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(this);
    });

    $.each(groups, function () {
      $(this).magnificPopup({
        type: "image",
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: {
          enabled: true
        }
      });
    });
  }

  function dynamicCurrentMenuClass(selector) {
    let $filename = window.location.href.split("/").reverse()[0];

    selector.find("li").each(function () {
      let anchor = $(this).find("a");
      if ($(anchor).attr("href") == $filename) {
        $(this).addClass("current");
      }
    });
    // if any li has .current elmnt add class
    selector.children("li").each(function () {
      if ($(this).find(".current").length) {
        $(this).addClass("current");
      }
    });
    // if no file name return
    if ("" == $filename) {
      selector.find("li").eq(0).addClass("current");
    }
  }

  if ($(".main-menu__list").length) {
    // dynamic current class
    let mainNavUL = $(".main-menu__list");
    dynamicCurrentMenuClass(mainNavUL);
  }

  if ($(".service-details__nav").length) {
    // dynamic current class
    let mainNavUL = $(".service-details__nav");
    dynamicCurrentMenuClass(mainNavUL);
  }

  if ($(".main-menu").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".sticky-header").length) {
    $(".sticky-header")
      .clone()
      .insertAfter(".sticky-header")
      .addClass("sticky-header--cloned");
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .dropdown > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }

  //Show Popup menu
  $(document).on("click", ".megamenu-clickable--toggler > a", function (e) {
    $("body").toggleClass("megamenu-popup-active");
    $(this).parent().find("ul").toggleClass("megamenu-clickable--active");
    e.preventDefault();
  });
  $(document).on("click", ".megamenu-clickable--close", function (e) {
    $("body").removeClass("megamenu-popup-active");
    $(".megamenu-clickable--active").removeClass("megamenu-clickable--active");
    e.preventDefault();
  });

  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  if ($(".sidebar-btn__toggler").length) {
    $(".sidebar-btn__toggler").on("click", function (e) {
      e.preventDefault();
      $(".sidebar-two").toggleClass("active");
      $("body").toggleClass("locked");
    });
  }

  if ($(".search-toggler").length) {
    $(".search-toggler").on("click", function (e) {
      e.preventDefault();
      $(".search-popup").toggleClass("active");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }
  if ($(".mini-cart__toggler").length) {
    $(".mini-cart__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mini-cart").toggleClass("expanded");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }
  if ($(".odometer").length) {
    $(".odometer").appear(function (e) {
      let odo = $(".odometer");
      odo.each(function () {
        let countNumber = $(this).attr("data-count");
        $(this).html(countNumber);
      });
    });
  }

  if ($("#donate-amount__predefined").length) {
    let donateInput = $("#donate-amount");
    $("#donate-amount__predefined")
      .find("li")
      .on("click", function (e) {
        e.preventDefault();
        let amount = $(this).find("a").text();
        donateInput.val(amount);
        $("#donate-amount__predefined").find("li").removeClass("active");
        $(this).addClass("active");
      });
  }

  //accordion
  if ($(".conlive-accordion").length) {
    let accordionGrp = $(".conlive-accordion");
    accordionGrp.each(function () {
      let accordionName = $(this).data("grp-name");
      let $self = $(this);
      let accordion = $self.find(".accordion");
      $self.addClass(accordionName);
      $self.find(".accordion .accordion-content").hide();
      $self.find(".accordion.active").find(".accordion-content").show();
      accordion.each(function () {
        $(this)
          .find(".accordion-title")
          .on("click", function () {
            if ($(this).parent().hasClass("active") === false) {
              $(".conlive-accordion." + accordionName)
                .find(".accordion")
                .removeClass("active");
              $(".conlive-accordion." + accordionName)
                .find(".accordion")
                .find(".accordion-content")
                .slideUp();
              $(this).parent().addClass("active");
              $(this).parent().find(".accordion-content").slideDown();
            }
          });
      });
    });
  }

  $(".add").on("click", function () {
    if ($(this).prev().val() < 999) {
      $(this)
        .prev()
        .val(+$(this).prev().val() + 1);
    }
  });

  $(".sub").on("click", function () {
    if ($(this).next().val() > 0) {
      if ($(this).next().val() > 0)
        $(this)
          .next()
          .val(+$(this).next().val() - 1);
    }
  });

  if ($(".tabs-box").length) {
    $(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
      e.preventDefault();
      let target = $($(this).attr("data-tab"));

      if ($(target).is(":visible")) {
        return false;
      } else {
        target
          .parents(".tabs-box")
          .find(".tab-buttons")
          .find(".tab-btn")
          .removeClass("active-btn");
        $(this).addClass("active-btn");
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .fadeOut(0);
        target
          .parents(".tabs-box")
          .find(".tabs-content")
          .find(".tab")
          .removeClass("active-tab");
        $(target).fadeIn(300);
        $(target).addClass("active-tab");
      }
    });
  }

  // speakers item hover
  function handleHover(itemClass, identityClass) {
    $(itemClass).on("mouseenter", function () {
      $(identityClass).addClass("active");
    });

    $(itemClass).on("mouseleave", function () {
      $(identityClass).removeClass("active");
    });

    $(identityClass).on("mouseenter", function () {
      $(itemClass).addClass("active");
    });

    $(identityClass).on("mouseleave", function () {
      $(itemClass).removeClass("active");
    });
  }

  // mapping each pair
  handleHover(
    ".speakers-two__item--one",
    ".speakers-two__identity__inner--one"
  );
  handleHover(
    ".speakers-two__item--two",
    ".speakers-two__identity__inner--two"
  );
  handleHover(
    ".speakers-two__item--three",
    ".speakers-two__identity__inner--three"
  );
  handleHover(
    ".speakers-two__item--four",
    ".speakers-two__identity__inner--four"
  );

  function thmOwlInit() {
    // owl slider
    let conliveowlCarousel = $(".conlive-owl__carousel");
    if (conliveowlCarousel.length) {
      conliveowlCarousel.each(function () {
        const elm = $(this);
        const rawOptions = elm.data("owl-options");

        let options = {};

        if (typeof rawOptions === "object") {
          options = rawOptions;
        } else if (typeof rawOptions === "string") {
          try {
            options = JSON.parse(rawOptions);
          } catch (error) {
            console.error("Invalid owl-options JSON:", error);
            options = {}; // fallback
          }
        }

        const thmOwlCarousel = elm.owlCarousel(options);
        elm.find("button").each(function () {
          $(this).attr("aria-label", "carousel button");
        });
      });
    }

    let conliveowlCarouselNav = $(".conlive-owl__carousel--custom-nav");
    if (conliveowlCarouselNav.length) {
      conliveowlCarouselNav.each(function () {
        let elm = $(this);
        let owlNavPrev = elm.data("owl-nav-prev");
        let owlNavNext = elm.data("owl-nav-next");
        $(owlNavPrev).on("click", function (e) {
          elm.trigger("prev.owl.carousel");
          e.preventDefault();
        });

        $(owlNavNext).on("click", function (e) {
          elm.trigger("next.owl.carousel");
          e.preventDefault();
        });
      });
    }

    let conliveowlCarouselWithCounter = $(
      ".conlive-owl__carousel--with-counter"
    );
    if (conliveowlCarouselWithCounter.length) {
      conliveowlCarouselWithCounter.each(function () {
        let elm = $(this);
        const rawOptions = elm.data("owl-options");

        let options = {};

        if (typeof rawOptions === "object") {
          options = rawOptions;
        } else if (typeof rawOptions === "string") {
          try {
            options = JSON.parse(rawOptions);
          } catch (error) {
            console.error("Invalid owl-options JSON:", error);
            options = {}; // fallback
          }
        }

        elm
          .on("initialized.owl.carousel", function (event) {
            let idx = event.item.index;
            let carousel = event.relatedTarget;
            let carouselCount = carousel.items().length;

            if (!event.namespace) {
              return;
            }

            elm.append(
              '<div class="conlive-owl__carousel__counter"><span class="conlive-owl__carousel__counter__current"></span> <span class="conlive-owl__carousel__counter__total"></span></div>'
            );
            elm
              .find(".conlive-owl__carousel__counter__current")
              .text(carousel.relative(carousel.current()) + 1);
            elm
              .find(".conlive-owl__carousel__counter__total")
              .text(carouselCount);
          })
          .owlCarousel(options)
          .on("changed.owl.carousel", function (event) {
            let carousel = event.relatedTarget;
            elm
              .find(".conlive-owl__carousel__counter__current")
              .text(carousel.relative(carousel.current()) + 1);
          });
      });
    }
  }

  function conliveSlickInit() {
    // slick slider
    let conliveslickCarousel = $(".conlive-slick__carousel");

    if (conliveslickCarousel.length) {
      conliveslickCarousel.each(function () {
        const elm = $(this);
        const rawOptions = elm.data("slick-options");

        let options = {};

        // Already parsed object
        if (typeof rawOptions === "object") {
          options = rawOptions;
        }

        // JSON string
        else if (typeof rawOptions === "string") {
          try {
            options = JSON.parse(rawOptions);
          } catch (error) {
            console.error("Invalid slick-options JSON:", error, rawOptions);

            // Safe fallback
            options = {};
          }
        }

        // Initialize slick safely
        elm.slick(options);
      });
    }
    let conliveslickCarouselCounter = $(".conlive-slick__custome-counter");
    if (conliveslickCarouselCounter.length) {
      conliveslickCarouselCounter.each(function () {
        let elm = $(this);
        let options = elm.data("slick-options");
        let currentSlide;
        let slidesCount;
        let sliderCounter = document.createElement("div");
        sliderCounter.classList.add("conlive-slick__counter");

        let updateSliderCounter = function (slick, currentIndex) {
          currentSlide = slick.slickCurrentSlide() + 1;
          slidesCount = slick.slideCount;
          $(sliderCounter).html(
            '<span class="conlive-slick__counter__active">' +
              currentSlide +
              "</span>" +
              "" +
              "<span>" +
              slidesCount +
              "</span>"
          );
        };
        elm.on("init", function (event, slick) {
          elm.append(sliderCounter);
          updateSliderCounter(slick);
        });
        elm.on("afterChange", function (event, slick, currentSlide) {
          updateSliderCounter(slick, currentSlide);
        });

        let conliveslickCarousel = elm.slick(
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }
  }

  function conliveSwiperInit() {
    let swipers = $(".conlive-swiper__carousel");

    if (swipers.length) {
      swipers.each(function (index, element) {
        let $this = $(element);
        let options = $this.attr("data-swiper-options");
        let parsedOptions;

        try {
          parsedOptions = JSON.parse(options);
        } catch (e) {
          console.warn("Invalid JSON in data-swiper-options:", e);
          parsedOptions = {}; // fallback
        }

        new Swiper(element, parsedOptions);
      });
    }
  }

  /*-- Handle Scrollbar --*/
  function handleScrollbar() {
    const bodyHeight = $("body").height();
    const scrollPos = $(window).innerHeight() + $(window).scrollTop();
    let percentage = (scrollPos / bodyHeight) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    $(".scroll-to-top .scroll-to-top__inner").css("width", percentage + "%");
  }

  /*-- One Page Menu --*/
  function SmoothMenuScroll() {
    let anchor = $(".scrollToLink");
    if (anchor.length) {
      anchor.children("a").on("click", function (event) {
        if ($(window).scrollTop() > 10) {
          let headerH = "0";
        } else {
          let headerH = "0";
        }
        let target = $(this);
        $("html, body")
          .stop()
          .animate(
            {
              scrollTop: $(target.attr("href")).offset().top - headerH + "px"
            },
            900,
            "easeInOutExpo"
          );
        anchor.removeClass("current");
        anchor.removeClass("current-menu-ancestor");
        anchor.removeClass("current_page_item");
        anchor.removeClass("current-menu-parent");
        target.parent().addClass("current");
        event.preventDefault();
      });
    }
  }
  SmoothMenuScroll();

  function OnePageMenuScroll() {
    let windscroll = $(window).scrollTop();
    if (windscroll >= 117) {
      let menuAnchor = $(".one-page-scroll-menu .scrollToLink").children("a");
      menuAnchor.each(function () {
        let sections = $(this).attr("href");
        $(sections).each(function () {
          if ($(this).offset().top <= windscroll + 100) {
            let Sectionid = $(sections).attr("id");
            $(".one-page-scroll-menu").find("li").removeClass("current");
            $(".one-page-scroll-menu")
              .find("li")
              .removeClass("current-menu-ancestor");
            $(".one-page-scroll-menu")
              .find("li")
              .removeClass("current_page_item");
            $(".one-page-scroll-menu")
              .find("li")
              .removeClass("current-menu-parent");
            $(".one-page-scroll-menu")
              .find("a[href*=\\#" + Sectionid + "]")
              .parent()
              .addClass("current");
          }
        });
      });
    } else {
      $(".one-page-scroll-menu li.current").removeClass("current");
      $(".one-page-scroll-menu li:first").addClass("current");
    }
  }

  // window scroll event
  function stickyMenuUpScroll($targetMenu, $toggleClass) {
    let lastScrollTop = 0;
    window.addEventListener(
      "scroll",
      function () {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > 500) {
          if (st > lastScrollTop) {
            // downscroll code
            $targetMenu.removeClass($toggleClass);
            // console.log("down");
          } else {
            // upscroll code
            $targetMenu.addClass($toggleClass);
            // console.log("up");
          }
        } else {
          $targetMenu.removeClass($toggleClass);
        }
        lastScrollTop = st;
      },
      false
    );
  }
  stickyMenuUpScroll($(".sticky-header--normal"), "active");

  //Strech Column
  function conlive_stretch() {
    let i = $(window).width();
    $(".row .conlive-stretch-element-inside-column").each(function () {
      let $this = $(this),
        row = $this.closest(".row"),
        cols = $this.closest('[class^="col-"]'),
        colsheight = $this.closest('[class^="col-"]').height(),
        rect = this.getBoundingClientRect(),
        l = row[0].getBoundingClientRect(),
        s = cols[0].getBoundingClientRect(),
        r = rect.left,
        d = i - rect.right,
        c = l.left + (parseFloat(row.css("padding-left")) || 0),
        u = i - l.right + (parseFloat(row.css("padding-right")) || 0),
        p = s.left,
        f = i - s.right,
        styles = {
          "margin-left": 0,
          "margin-right": 0
        };
      if (Math.round(c) === Math.round(p)) {
        let h = parseFloat($this.css("margin-left") || 0);
        styles["margin-left"] = h - r;
      }
      if (Math.round(u) === Math.round(f)) {
        let w = parseFloat($this.css("margin-right") || 0);
        styles["margin-right"] = w - d;
      }
      $this.css(styles);
    });
  }
  conlive_stretch();

  function conlive_cuved_circle() {
    let circleTypeElm = $(".curved-circle--item");
    if (circleTypeElm.length) {
      circleTypeElm.each(function () {
        let elm = $(this);
        let options = elm.data("circle-text-options");
        elm.circleType(
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }
  }

  /*-- Price Range --*/
  function priceFilter() {
    if ($(".price-ranger").length) {
      $(".price-ranger #slider-range").slider({
        range: true,
        min: 50,
        max: 1000,
        values: [11, 500],
        slide: function (event, ui) {
          $(".price-ranger .ranger-min-max-block .min").val("$" + ui.values[0]);
          $(".price-ranger .ranger-min-max-block .max").val("$" + ui.values[1]);
        }
      });
      $(".price-ranger .ranger-min-max-block .min").val(
        "$" + $(".price-ranger #slider-range").slider("values", 0)
      );
      $(".price-ranger .ranger-min-max-block .max").val(
        "$" + $(".price-ranger #slider-range").slider("values", 1)
      );
    }
  }

  // window load event
  $(window).on("load", function () {
    if ($(".preloader").length) {
      $(".preloader").fadeOut();
    }

    heroTitle();
    titleAnimUpText();
    thmOwlInit();
    conliveSlickInit();
    conliveSwiperInit();
    priceFilter();
    initWebglHover();
    sliderTitle();

    if ($(".circle-progress").length) {
      $(".circle-progress").appear(function () {
        let circleProgress = $(".circle-progress");
        circleProgress.each(function () {
          let progress = $(this);
          let progressOptions = progress.data("options");
          progress.circleProgress(progressOptions);
        });
      });
    }
    if ($(".masonry-layout").length) {
      $(".masonry-layout").imagesLoaded(function () {
        $(".masonry-layout").isotope({
          layoutMode: "masonry"
        });
      });
    }
    if ($(".fitRow-layout").length) {
      $(".fitRow-layout").imagesLoaded(function () {
        $(".fitRow-layout").isotope({
          layoutMode: "fitRows"
        });
      });
    }

    if ($(".post-filter").length) {
      let postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        let $self = $(this);
        let selector = $self.attr("data-filter");
        postFilterList.removeClass("active");
        $self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }

    if ($(".post-filter.has-dynamic-filter-counter").length) {
      // let allItem = $('.single-filter-item').length;

      let activeFilterItem = $(".post-filter.has-dynamic-filter-counter").find(
        "li"
      );

      activeFilterItem.each(function () {
        let filterElement = $(this).data("filter");
        let count = $(".filter-layout").find(filterElement).length;
        $(this).append("<sup>[" + count + "]</sup>");
      });
    }

    // Select Country Phone Code List
    let input = document.querySelector("#country-phone-code-list");
    if (input) {
      const iti = window.intlTelInput(input, {
        separateDialCode: true,
        initialCountry: "in"
      });
    }

    conlive_cuved_circle();
    AOS.init();
  });

  $(window).on("scroll", function () {
    OnePageMenuScroll();
    handleScrollbar();
    if ($(".sticky-header--one-page").length) {
      let headerScrollPos = 130;
      let stricky = $(".sticky-header--one-page");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("active");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("active");
      }
    }

    let scrollToTopBtn = ".scroll-to-top";
    if (scrollToTopBtn.length) {
      if ($(window).scrollTop() > 500) {
        $(scrollToTopBtn).addClass("show");
      } else {
        $(scrollToTopBtn).removeClass("show");
      }
    }
  });

  $(window).on("resize", function () {
    conlive_stretch();
  });
})(jQuery);
