function main() {
  // ################ //

  const navbarList = $('#navbar__list');
  const sections = $('section');
  const scrollTopButton = $('#scroll-top-button');
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
    if (!hasClass(targetSection, 'your-active-class')) {
      sections.forEach((section) =>
        section.classList.remove('your-active-class')
      );
      targetSection.classList.add('your-active-class');
      const targetAnchor = $(`a[href="#${targetSection.id}"]`);
      anchors.forEach((section) =>
        section.classList.remove('your-active-class')
      );
      targetAnchor.classList.add('your-active-class');
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

      listChild.innerHTML = `<a href="#${anchorRef}">${anchorText}</a>`;

      domFragment.appendChild(listChild);
    }
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
    navbarList.addEventListener('click', (event) => {
      event.preventDefault();
      const anchorRef = event.target.attributes.href.value;
      const targetSection = $(anchorRef);
      const yCoord = getHeigthFromTopViewport(targetSection);
      window.scrollTo({
        top: window.pageYOffset + yCoord,
        behavior: 'smooth'
      });
    });

    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    $('.collapse').forEach((button) => {
      button.addEventListener('click', () => {
        const collapsable = button.nextElementSibling;
        collapsable.classList.toggle('open');
      });
    });
  }
  return () => {
    populateNavbarList();
    anchors = $('a');
    addOnScrollHandler();
    addOnClickHandler();
  }
}

// ################ //

window.addEventListener('load', () => {
  main()();
});
