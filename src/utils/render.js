const RenderPosition = {
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

const openPopup = (container, component) => {
  container.appendChild(component.getElement());
};

const closePopup = (container, component) => {
  container.removeChild(component.getElement());
};

const remove = (component) => {
  component.getElement().remove();
};

export {RenderPosition, createElement, render, openPopup, closePopup, remove};
