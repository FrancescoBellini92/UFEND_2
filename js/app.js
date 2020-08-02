function main() {
  // ################ //

  const navbarList = $('#navbar__list');
  const sections = $('section');
  const scrollTopButton = $('#scroll-top-button');
  const mediumBreakpoint = 768;
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

      listChild.innerHTML = `<a class="navbar__menu-link" href="#${anchorRef}">${anchorText}</a>`;

      domFragment.appendChild(listChild);
    }
  }

  function addOnScrollHandler() {
    window.addEventListener('scroll', () => {
      clearInterval(updateUIOnScrollTimeout);
      if (window.innerWidth > mediumBreakpoint) {
        hide(navbarList);
      }
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
    navbarList.addEventListener('click', function(event) {
      // using a non arrow function to bint "this" to the element
      this.parentElement.classList.remove('open');
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
        collapsable.classList.toggle('open');
      });
    });
  }

  return () => {
    populateNavbarList();
    anchors = $('a'); // update the anchors
    addOnScrollHandler();
    addOnClickHandler();
  };
}

// ################ //

window.addEventListener('load', () => {
  main()();
});
