//Main functions
// this function hides the item parent (collection list item)
function selectorHideParent(item) {
  if (item.parents("[role=listitem]").length > 0) {
    item.parents("[role=listitem]")[0].style.display = "none";
  } else {
    item.hide();
  }
  $(item).attr("selector-item-display", false);
}

// this function shows the item parent (collection list item)
function selectorShowParent(item) {
  if (item.parents("[role=listitem]").length > 0) {
    item.parents("[role=listitem]")[0].style.display = "block";
  } else {
    item.show();
  }
  $(item).attr("selector-item-display", true);
}

//this function is for filtering triggers when user clicks an item
function selectorFilters(selectorType) {
  // selector items are the categories, services and options on the lists
  let selectorItems = $("[selector-item]");
  selectorItems.removeClass("is-active");
  selectorItems.click(function () {
    //let thisGroupName = $(this).attr("selector-group");
    if ($(this).find("[" + selectorType + "]").length > 0) {
      // identifier is a category id
      let thisIdentifier = $(this).find("[" + selectorType + "]")[0].innerText;
      //gets the level it's a number 1,2,3
      let thisItemLevel = $(this)
        .parents("[selector-level]")[0]
        .getAttribute("selector-level");
      //removes the active state of all the other siblings on its level
      selectorItems.each(function () {
        if (
          $(this)
            .parents("[selector-level]")[0]
            .getAttribute("selector-level") === thisItemLevel
        ) {
          $(this).removeClass("is-active");
        }
      });
      $(this).addClass("is-active");
      //actual filtering checks identifiers and use selectorShowParents() and selectorHideParents();
      selectorItems.each(function () {
        //gets the level from the parent group, it's a number 1,2,3
        let groupItemLevel = $(this)
          .parents("[selector-level]")[0]
          .getAttribute("selector-level");
        if ($(this).find("[" + selectorType + "]").length > 0) {
          let groupItemIdentifier = $(this).find("[" + selectorType + "]")[0]
            .innerText;
          if (groupItemLevel > thisItemLevel) {
            $(this).show();
            selectorShowParent($(this));
            if (groupItemIdentifier !== thisIdentifier) {
              $(this).removeClass("is-active");
            }
          }
          if (
            groupItemIdentifier !== thisIdentifier &&
            groupItemLevel > thisItemLevel &&
            thisIdentifier !== ""
          ) {
            $(this).hide();
            selectorHideParent($(this));
            $(this).removeClass("is-active");
          }
        }
      });
    }
  });
}

//function for next slider changes the top position of the slides wrapper and jumps slides if necesary
function slideNext(wrapper, slides, jump) {
  let slidesJump = jump;
  let slidesWrapper = wrapper;
  let slidesLength = slides.length;
  let currentPosition = 0;
  slides.each(function () {
    if ($(this).attr("selector-slide-state") === "active") {
      currentPosition = $(this).index();
    }
  });
  let nextPosition = (jump + currentPosition) * 100;
  if (currentPosition < slidesLength - 1) {
    slidesWrapper.css({ top: "-" + nextPosition + "vh" });
    $(slides[currentPosition]).attr("selector-slide-state", "");
    $(slides[currentPosition]).removeClass("is-active");
    $(slides[currentPosition + jump]).attr("selector-slide-state", "active");
    $(slides[currentPosition + jump]).addClass("is-active");
  }
}
//function for next slider changes the top position of the slides wrapper and jumps slides if necesary
function slideBack(wrapper, slides, jump) {
  let slidesJump = jump;
  let slidesWrapper = wrapper;
  let slidesLength = slides.length;
  let currentPosition = 0;
  slides.each(function () {
    if ($(this).attr("selector-slide-state") === "active") {
      currentPosition = $(this).index();
    }
  });
  let nextPosition = currentPosition * 100 - 100 * jump;
  if (currentPosition > 0) {
    slidesWrapper.css({ top: "-" + nextPosition + "vh" });
    $(slides[currentPosition]).attr("selector-slide-state", "");
    $(slides[currentPosition]).removeClass("is-active");
    $(slides[currentPosition - jump]).attr("selector-slide-state", "active");
    $(slides[currentPosition - jump]).addClass("is-active");
  }
}
function disableNext(nextButton) {
  $(nextButton).addClass("is-disabled pointer-events-off");
}
function enableNext(nextButton) {
  $(nextButton).removeClass("is-disabled pointer-events-off");
  $(nextButton).text("Next →");
  $(nextButton).attr("selector-next-state", "is-next");
}
function nextButtonIsSubmit(nextButton) {
  $(nextButton).text("Submit");
  $(nextButton).attr("selector-next-state", "is-submit");
}
function nextButtonIsBackToSide(nextButton) {
  $(nextButton).text("BACK TO SITE");
  $(nextButton).attr("selector-next-state", "is-back-to-site");
}
//checks if its necessary to disable and enable back next buttons
function slideCheck(slides, nextButton, backButton) {
  let thisSlideNextState = "disable";
  backButton.show();
  slides.each(function () {
    if ($(this).attr("selector-slide-state") === "active") {
      if ($(this).find("[selector-item]").length > 0) {
        let thisSlideOptions = $(this).find("[selector-item]");
        thisSlideOptions.each(function () {
          if ($(this).hasClass("is-active")) {
            thisSlideNextState = "enable";
          }
        });
        if (thisSlideNextState === "disable") {
          disableNext(nextButton);
        } else {
          enableNext(nextButton);
        }
      }
      if ($(this).find("[selector=is-form]").length > 0) {
        nextButtonIsSubmit(nextButton);
      }
      if ($(this).index() === 0 || $(this).index() === slides.length - 1) {
        backButton.hide();
      }
    }
  });
}
// returns a jump size 1 or 2 if the next slide is empty
function slideCheckNextSlideSkip(slides, direction) {
  let jumpSize = 1;
  let nextSlide;
  slides.each(function () {
    if ($(this).attr("selector-slide-state") === "active") {
      if (direction === "next") {
        nextSlide = slides[$(this).index() + 1];
      } else if (direction === "back") {
        nextSlide = slides[$(this).index() - 1];
      }
      if ($(nextSlide).find("[selector-item]").length > 0) {
        if ($(nextSlide).find("[selector-item-display=true]").length > 0) {
          jumpSize = 1;
          $(nextSlide).attr("selector-slide-state", "");
        } else {
          jumpSize = 2;
          $(nextSlide).attr("selector-slide-state", "skip");
        }
      }
    }
    if ($(this).find("[selector-item]").length > 0) {
      if ($(this).attr("selector-slide-state") !== "active") {
        if ($(this).find("[selector-item-display=true]").length > 0) {
          $(this).attr("selector-slide-state", "");
        } else {
          $(this).attr("selector-slide-state", "skip");
        }
      }
    }
  });
  return jumpSize;
}
// function for change css for rotation.
function rotate($el, degrees) {
  $el.css({
    "-webkit-transform": "rotate(" + degrees + "deg)",
    "-moz-transform": "rotate(" + degrees + "deg)",
    "-ms-transform": "rotate(" + degrees + "deg)",
    "-o-transform": "rotate(" + degrees + "deg)",
    transform: "rotate(" + degrees + "deg)",
    zoom: 1
  });
}
// progress circle indicator text display and progress circle rotation
function progressCircle(circle, slides) {
  let slidesLength = slides.length;
  let slidesSkip = $("[selector-slide-state=skip]").length;
  slidesLength = slidesLength - slidesSkip;
  let activeIndex = 0;
  let currentText = $("[selector=progress-current-text]");
  let totalText = $("[selector=progress-total-text]");
  slides.each(function () {
    if ($(this).attr("selector-slide-state") === "active") {
      activeIndex = $(this).index();
    }
  });
  if (slidesSkip > 0) {
    let skipSlidesBeforeActive = 0;
    slides.each(function () {
      if (
        $(this).attr("selector-slide-state") === "skip" &&
        $(this).index() < activeIndex
      ) {
        skipSlidesBeforeActive = skipSlidesBeforeActive + 1;
      }
    });
    activeIndex = activeIndex - skipSlidesBeforeActive;
  }
  activeIndex = activeIndex + 1;
  currentText.each(function () {
    $(this).text(activeIndex);
  });
  totalText.each(function () {
    $(this).text(slidesLength);
  });
  let rotationGrades = -((activeIndex * 180) / slidesLength);
  rotate(circle, rotationGrades);
}

function formClickSumit(submitButton) {
  submitButton.click();
}
//function for create the final selected service, and optional product
function createSelectedProduct(slides, mainInputID, aditionalID) {
  let finalText = "";
  let aditionalProduct = "";
  slides.each(function () {
    if (
      $(this).attr("selector-slide-state") !== "skip" &&
      $(this).find("[selector-item]").length > 0
    ) {
      let optionItems = $(this).find("[selector-item]");
      optionItems.each(function () {
        if ($(this).hasClass("is-active")) {
          let thisOptionType = "";
          if ($(this).find("[selector-option-type]").length > 0) {
            thisOptionType = $(this).find("[selector-option-type]")[0]
              .innerText;
          }
          if (thisOptionType === "") {
            let thisText = $(this).find("[selector-item-text]")[0].innerText;
            if (finalText !== "") {
              finalText = finalText + " " + "|" + " " + thisText;
            } else {
              finalText = thisText;
            }
          } else if (thisOptionType === "option") {
            let thisText = $(this).find("[selector-item-text]")[0].innerText;
            finalText = finalText + " " + thisText;
          } else {
            aditionalProduct = $(this).find("[selector-item-text]")[0]
              .innerText;
          }
        }
      });
    }
  });
  finalText = finalText.toUpperCase();
  aditionalProduct = aditionalProduct.toUpperCase();
  $("#" + mainInputID).val(finalText);
  $("#" + aditionalID).val(aditionalProduct);
}

//Categories sometimes have optional slide this changes the displayed question text
function changeOptionText(item, questionTextID) {
  let questionTextItem = $("#" + questionTextID);
  let questionText = "";
  if ($(item).find("[selector-option-question]").length > 0) {
    questionText = $(item).find("[selector-option-question]")[0].innerText;
    $(questionTextItem).text(questionText);
  }
}

// creates controls and determines interface elements
let selectorNext = $("[selector=next]");
let selectorBack = $("[selector=back]");
let selecorSlidesMask = $("[selector=slides-mask]");
let selectorSlidesWrapper = $("[selector=slides-wrapper]");
let selectorSlides = $("[selector=slide]");
let selectorOption = $("[selector-item]");
let selectorProgressCircle = $("[selector=progress-circle]");
let selectorForm = $("[selector=is-form]")[0];
let selectorFormSubmit = $("[selector=form-submit]")[0];

// initial states
$(selectorNext).attr("selector-next-state", "is-next");
selectorSlides.attr("selector-slide-state", "");
$(selectorSlides[0]).attr("selector-slide-state", "active");
$(selectorSlides[0]).addClass("is-active");
$(selectorOption).attr("selector-item-display", true);
$(selecorSlidesMask[0]).removeClass("overflow-visible");

//Run and triggers funtions

//run filter funtions
selectorFilters("selector-id");
selectorFilters("selector-building");

slideCheck(selectorSlides, selectorNext, selectorBack);

selectorNext.click(function () {
  let nextJumpSize = slideCheckNextSlideSkip(selectorSlides, "next");
  if ($(this).attr("selector-next-state") === "is-submit") {
    formClickSumit(selectorFormSubmit);
  } else if ($(this).attr("selector-next-state") === "is-back-to-site") {
    window.location.href = "https://www.galaxyplumbinginc.ca/";
  } else {
    slideNext(selectorSlidesWrapper, selectorSlides, nextJumpSize);
    slideCheck(selectorSlides, selectorNext, selectorBack);
    progressCircle(selectorProgressCircle, selectorSlides);
  }
});

selectorBack.click(function () {
  let nextJumpSize = slideCheckNextSlideSkip(selectorSlides, "back");
  slideBack(selectorSlidesWrapper, selectorSlides, nextJumpSize);
  slideCheck(selectorSlides, selectorNext, selectorBack);
  progressCircle(selectorProgressCircle, selectorSlides);
});
selectorOption.click(function () {
  slideCheckNextSlideSkip(selectorSlides, "");
  slideCheck(selectorSlides, selectorNext, selectorBack);
  progressCircle(selectorProgressCircle, selectorSlides);
  createSelectedProduct(
    selectorSlides,
    "service-name-input",
    "additional-product-input"
  );
  changeOptionText($(this), "option-question-text");
});

$(selectorForm).submit(function (event) {
  event.preventDefault();
  let nextJumpSize = slideCheckNextSlideSkip(selectorSlides, "next");
  nextButtonIsBackToSide(selectorNext);
  slideNext(selectorSlidesWrapper, selectorSlides, nextJumpSize);
  slideCheck(selectorSlides, selectorNext, selectorBack);
  progressCircle(selectorProgressCircle, selectorSlides);
});
