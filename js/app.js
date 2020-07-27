/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

const navbarList = document.querySelector('#navbar__list');
const sections = document.querySelectorAll('section');
let anchors;

function applyActiveClass(targetSection) {
  if (!targetSection.className.includes('your-active-class')) {
    sections.forEach((section) => section.classList.remove('your-active-class'));
    targetSection.classList.add('your-active-class');
    const targetAnchor = document.querySelector(`a[href="#${targetSection.id}"]`);
    anchors.forEach((section) => section.classList.remove('your-active-class'));
    targetAnchor.classList.add('your-active-class');
  }
}

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

// Add class 'active' to section when near top of viewport
function addOnScrollHandler() {
  window.addEventListener('scroll', function () {
    sections.forEach((section) => {
      // y is the offset between element y coordinates and viewport top
      const sectionHeigth = section.getBoundingClientRect().y;
      if (sectionHeigth <= 100 && sectionHeigth >= -100) {
        applyActiveClass(section);
      }
    });
  });
}

function addOnClickHandler() {
  navbarList.addEventListener('click', function (event) {
    event.preventDefault();
    const anchorRef = event.target.attributes.href.value;
    const targetSection = document.querySelector(anchorRef);
    const yCoord = targetSection.getBoundingClientRect().top;
    window.scrollTo({
      top: window.pageYOffset + yCoord,
      behavior: 'smooth'
    });
  });
}

// Scroll to anchor ID using scrollTO event
window.addEventListener('load', function () {
  populateNavbarList();
  anchors = document.querySelectorAll('a');
  addOnScrollHandler();
  addOnClickHandler();
});
