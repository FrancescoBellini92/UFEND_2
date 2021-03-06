document.addEventListener('DOMContentLoaded', () => {
  (() => { // using IIFE to avoid scope pollution and ensure variables and functions remain private
    const navbarList = $('#navbar__list');
    const sections = $('section');
    const scrollTopButton = $('#scroll-top-button');
    const mediumBreakpoint = 768;

    const getSectionInnerHTML = (sectionTitle) => `
    <div class="main__container">
      <h2>${sectionTitle}</h2>
      <button class="collapse-button">
        toggle section
      </button>
      <div class="collapsable open">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          fermentum metus faucibus lectus pharetra dapibus. Suspendisse
          potenti. Aenean aliquam elementum mi, ac euismod augue. Donec eget
          lacinia ex. Phasellus imperdiet porta orci eget mollis. Sed
          convallis sollicitudin mauris ac tincidunt. Donec bibendum, nulla
          eget bibendum consectetur, sem nisi aliquam leo, ut pulvinar quam
          nunc eu augue. Pellentesque maximus imperdiet elit a pharetra.
          Duis lectus mi, aliquam in mi quis, aliquam porttitor lacus. Morbi
          a tincidunt felis. Sed leo nunc, pharetra et elementum non,
          faucibus vitae elit. Integer nec libero venenatis libero ultricies
          molestie semper in tellus. Sed congue et odio sed euismod.
        </p>

        <p>
          Aliquam a convallis justo. Vivamus venenatis, erat eget pulvinar
          gravida, ipsum lacus aliquet velit, vel luctus diam ipsum a diam.
          Cras eu tincidunt arcu, vitae rhoncus purus. Vestibulum fermentum
          consectetur porttitor. Suspendisse imperdiet porttitor tortor,
          eget elementum tortor mollis non.
        </p>
      </div>
    </div>`;

    let anchors;
    let updateUIOnScrollTimeout;

    // currying native methods for sake of simplicity
    function $(selector) {
      return selector.includes('#') ? document.querySelector(selector) : document.querySelectorAll(selector);
    }

    function hasClass(className, element) {
      return element.className.includes(className);
    }

    function addClass(className, ...elements) {
      elements.forEach(el => el.classList.add(className));
    }

    function removeClass(className, ...elements) {
      elements.forEach(el => el.classList.remove(className));
    }

    function hide(element) {
      addClass('hidden', element);
    }

    function show(element) {
      removeClass('hidden', element);
    }

    function getHeigthFromTopViewport(element) {
      return element.getBoundingClientRect().y;
    }

    function scrolledBelowPageFold() {
      return visualViewport.pageTop >= visualViewport.height;
    }

    function applyActiveClass(targetSection) {
      if (!hasClass('active', targetSection)) {
        removeClass('active', ...sections);
        addClass('active', targetSection);
        const targetAnchor = $(`a[href="#${targetSection.id}"]`);
        removeClass('active', ...anchors);
        addClass('active', targetAnchor);
      }
    }

    function manageCollapsable(collapsable) {
      if (hasClass('open', collapsable)) {
        removeClass('open', collapsable);
        collapsable.style.maxHeight = '0';
        return;
      }
      let maxHeight = collapsable.style.maxHeight;
      switch (maxHeight) {
        case '':
        case '0px':
          maxHeight = collapsable.scrollHeight + 'px';
          break;
        default:
          maxHeight = '0';
      }
      collapsable.style.maxHeight = maxHeight;
    }

    function populateNavbarList() {
      const domFragment = document.createDocumentFragment(); // using a fragment to avoid creating a container element
      sections.forEach((section) => populateFragment(section));
      navbarList.appendChild(domFragment);
      anchors = $('a'); // update the anchors

      function populateFragment(section) {
        const listChild = document.createElement('li');

        const anchorText = section.attributes['data-nav'].textContent;
        const anchorRef = section.id;

        listChild.innerHTML = `<a class="navbar__menu-link hoverable" href="#${anchorRef}">${anchorText}</a>`;

        domFragment.appendChild(listChild); // elements created and appended to fragment to minimize DOM manipulation
      }
    }

    function populateSections() {
      let sectionCounter = 1;
      sections.forEach((section) => {
        section.innerHTML = getSectionInnerHTML(`Section ${sectionCounter}`);
        sectionCounter++;
      });
    }

    function addOnScrollHandler() {
      window.addEventListener('scroll', () => {
        clearInterval(updateUIOnScrollTimeout);
        const sectionsHeight = [];
        sections.forEach(section => {
          const sectionHeigth = getHeigthFromTopViewport(section);
          sectionsHeight.push(sectionHeigth);
        });

        if (visualViewport.width >= mediumBreakpoint) {
          hide(navbarList);
        }
        hide(scrollTopButton);

        sections.forEach((section, i) => {
          const sectionHeigth = sectionsHeight[i];
          if (sectionHeigth <= 100 && sectionHeigth >= -100) {
            applyActiveClass(section);
          }
        });

        updateUIOnScrollTimeout = setTimeout(() => {
          show(navbarList);
          if (scrolledBelowPageFold()) {
            show(scrollTopButton);
          }
        }, 200);
      });
    }

    function addOnClickHandler() {
      // using event delegation to avoid attaching too many handlers
      navbarList.addEventListener('click', function (event) {
        // using a non arrow function to bint "this" to the element
        event.preventDefault();
        const target = event.target;
        if (target.nodeName === 'A') {
          if (hasClass('active', target) && visualViewport.width < mediumBreakpoint) { // collapse if already on desired section
            manageCollapsable(this.parentElement);
          }
          const anchorRef = target.attributes.href.value;
          const targetSection = $(anchorRef);
          const yCoord = getHeigthFromTopViewport(targetSection);
          window.scrollTo({
            top: window.pageYOffset + yCoord,
            behavior: 'smooth'
          });
        }
      });

      scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

      $('.collapse-button').forEach((button) => {
        button.addEventListener('click', () => {
          const collapsable = button.nextElementSibling;
          manageCollapsable(collapsable);
        });
      });
    }

    populateNavbarList();
    populateSections();
    addOnScrollHandler();
    addOnClickHandler();
  })();
});
