function main() {
  // ################ //

  const navbarList = $('#navbar__list');
  const sections = $('section');
  const scrollTopButton = $('#scroll-top-button');
  const mediumBreakpoint = 768;

  const sectionInnerHTML = (sectionTitle) => `
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
  // ################ //

  function $(selector) {
    if (selector.includes('#')) {
      return document.querySelector(selector);
    }
    return document.querySelectorAll(selector);
  }

  function hasClass(element, className) {
    return element.className.includes(className);
  }

  function getHeigthFromTopViewport(element) {
    return element.getBoundingClientRect().y;
  }

  function applyActiveClass(targetSection) {
    if (!hasClass(targetSection, 'active')) {
      sections.forEach((section) => section.classList.remove('active'));
      targetSection.classList.add('active');
      const targetAnchor = $(`a[href="#${targetSection.id}"]`);
      anchors.forEach((section) => section.classList.remove('active'));
      targetAnchor.classList.add('active');
    }
  }

  function manageCollapsable(collapsable) {
    if (hasClass(collapsable, 'open')) {
      collapsable.classList.remove('open');
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

  function hide(element) {
    element.classList.add('hidden');
  }

  function show(element) {
    element.classList.remove('hidden');
  }

  function scrolledBelowPageFold() {
    return visualViewport.pageTop >= visualViewport.height;
  }

  // ################ //

  function populateNavbarList() {
    const domFragment = document.createDocumentFragment();
    sections.forEach((section) => populateFragment(section));
    navbarList.appendChild(domFragment);

    function populateFragment(section) {
      const listChild = document.createElement('li');

      const anchorText = section.attributes['data-nav'].textContent;
      const anchorRef = section.id;

      listChild.innerHTML = `<a class="navbar__menu-link hoverable" href="#${anchorRef}">${anchorText}</a>`;

      domFragment.appendChild(listChild);
    }
  }

  function populateSections() {
    let sectionCounter = 1;
    sections.forEach((section) => {
      section.innerHTML = sectionInnerHTML(`Section ${sectionCounter}`);
      sectionCounter++;
    });
  }

  function addOnScrollHandler() {
    window.addEventListener('scroll', () => {
      clearInterval(updateUIOnScrollTimeout);
      hide(navbarList);
      hide(scrollTopButton);
      sections.forEach((section) => {
        const sectionHeigth = getHeigthFromTopViewport(section);
        if (sectionHeigth <= 50 && sectionHeigth >= -50) {
          applyActiveClass(section);
        }
      });
      updateUIOnScrollTimeout = setTimeout(() => {
        show(navbarList);
        if (scrolledBelowPageFold()) {
          show(scrollTopButton);
        }
      }, 100);
    });
  }

  function addOnClickHandler() {
    // using event delegation to avoid attaching too many handlers
    navbarList.addEventListener('click', function (event) {
      // using a non arrow function to bint "this" to the element
      if (window.innerWidth < mediumBreakpoint) {
        manageCollapsable(this.parentElement);
      }
      event.preventDefault();
      const target = event.target;
      if (target.nodeName === 'A') {
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

  return () => {
    populateNavbarList();
    anchors = $('a'); // update the anchors
    populateSections();
    addOnScrollHandler();
    addOnClickHandler();
  };
}

// ################ //

window.addEventListener('load', () => {
  main()();
});
